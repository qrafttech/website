---
title: "Chaining HLS videos into one player"
slug: chaining-hls-videos-into-one-player
date: 2026-06-03
author: "Nicolas Rouanne"
---

We needed a single video player to play a sequence of short clips back to back — like a playlist, but composed at request time from clips stored separately on Bunny Stream. The naive approach failed. The production-grade approach (double `<video>` elements) felt heavy. The thing that actually worked was server-side HLS playlist concatenation, with the player doing zero clip-switching logic of its own.

Code repo (public) : [https://github.com/nicolasrouanne/video-chaining](https://github.com/nicolasrouanne/video-chaining)

Live POC (CodeSandbox) : [https://codesandbox.io/p/github/nicolasrouanne/video-chaining/main](https://codesandbox.io/p/github/nicolasrouanne/video-chaining/main)

> [!NOTE]
> 📸 SCREENSHOT — final POC playing a chained playlist, with the manifest visible in the network tab

## 1. First attempt — JS array, swap src on ended

The naive thing : one `<video>` element, an array of URLs, switch to the next when the current one ends.

```javascript
const urls = [videoA, videoB, videoC];
let i = 0;
video.addEventListener("ended", () => {
  video.src = urls[++i];
  video.play();
});
```

What we got :

- A black flash at every junction while the new source loaded
- No prebuffering of the next clip
- A visible loading pause every few seconds

Setting `src` triggers a full reload — the browser has to discover duration, fetch the first segment, decode it, then start playback. Hundreds of milliseconds at best, full seconds on slow networks. Not what we wanted.

## 2. Considered — double \<video> with crossfade

The "production" approach used by YouTube and Instagram Reels : two `<video>` elements stacked, one playing while the other preloads the next clip. Swap visibility on `ended`.

We sketched it. Verdict : a lot of state management JS (which element is active, which is preloading, when to swap, what if the preload isn't ready), plus the audio boundary between clips still exists at the source level. Workable but heavy for the problem at hand.

## 3. Working approach — server-side HLS playlist concatenation

HLS is built for this. A `.m3u8` manifest can chain segments from different sources with `#EXT-X-DISCONTINUITY` markers between them. The player handles transitions natively — no JS swap logic, no second `<video>` element, no manual buffer juggling.

The shape :

```text
SOURCES ──┐
          │   fetch + parse        emit one m3u8 with
          ├──► strip headers ─────► #EXT-X-DISCONTINUITY ──► /playlist.m3u8
          │   absolutize segments  between each source
SOURCES ──┘
```

Server side, the core is ~30 lines of Node. For each source URL, descend the master playlist to a variant, keep only the `#EXTINF` lines and segment URLs (made absolute), join them all with `#EXT-X-DISCONTINUITY` between sources :

```javascript
async function segmentsOf(src) {
  const text = await fetch(src).then((r) => r.text());
  return text
    .split("\n")
    .filter((l) => l.startsWith("#EXTINF") || (l && !l.startsWith("#")))
    .map((l) => (l.startsWith("#") ? l : new URL(l, src).href))
    .join("\n");
}

const parts = await Promise.all(sources.map(segmentsOf));
return [
  "#EXTM3U",
  "#EXT-X-VERSION:6",
  "#EXT-X-TARGETDURATION:11",
  "#EXT-X-PLAYLIST-TYPE:VOD",
  parts.join("\n#EXT-X-DISCONTINUITY\n"),
  "#EXT-X-ENDLIST",
].join("\n");
```

→ Full server : [https://github.com/nicolasrouanne/video-chaining/blob/main/server.mjs](https://github.com/nicolasrouanne/video-chaining/blob/main/server.mjs)

Frontend, no clip-switching JS at all :

```html
<video id="v" controls autoplay muted playsinline></video>
<script type="module">
  import Hls from "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.mjs";
  const h = new Hls();
  h.loadSource("/playlist.m3u8");
  h.attachMedia(document.getElementById("v"));
</script>
```

The segments stream directly from the original CDN (Bunny in our case). The server only emits the manifest text — a few KB. Cheap and fast.

> [!NOTE]
> 📸 SCREENSHOT — Network tab showing one /playlist.m3u8 request (~1 KB) followed by .ts segments served directly by vz-\*.b-cdn.net

## 4. The subtle gotcha — ABR is silently dropped

Bunny exposes each video as a master playlist referencing multiple renditions (e.g. 360p + 240p). Our first implementation descended to the first variant of each source and stitched only those segments. Result : a single-rendition media playlist — no adaptive bitrate, no quality switching on slow networks.

The fix : emit a master playlist that references one concatenated media playlist per shared rendition.

```text
GET /playlist.m3u8?source=A&source=B            → master with N variants
GET /variant.m3u8?rendition=640x360&source=...  → 360p concat
GET /variant.m3u8?rendition=426x240&source=...  → 240p concat
```

The master endpoint walks each source's master, finds the resolutions present in every source (the intersection), and emits one `#EXT-X-STREAM-INF` per shared rendition. The variant endpoint does what the old endpoint did — concat segments for one specific rendition.

Verified end to end :

```text
[level-controller]: manifest loaded, 2 level(s) found
[level-controller]: Switching to level 1 (360p @1416800) from level -1   ← fast network
```

Throttle the network to Slow 3G in DevTools, reload :

```text
[abr] switch candidate:1->0 ... fetchDuration:3.3
[abr] rebuffering expected, optimal quality level 0
[level-controller]: Switching to level 0 (240p @1062600) from level 1   ← ABR drops to 240p
```

The player downgrades to 240p before any stall happens — exactly the desired behaviour.

You can inspect ABR state from the browser console (the POC exposes `window.hls`) :

```javascript
hls.levels             // [{ width, height, bitrate }, …]
hls.currentLevel       // -1 = auto, 0/1 = forced
hls.bandwidthEstimate  // measured bandwidth in bits/s
```

> [!NOTE]
> 📸 SCREENSHOT — DevTools console showing hls.levels output with two entries, before/after throttling

→ Tracked in [https://github.com/nicolasrouanne/video-chaining/issues/2](https://github.com/nicolasrouanne/video-chaining/issues/2)

## 5. What's still pending

For very short clips (~3-5s each), the per-clip discontinuity overhead can outpace the player's ability to prefetch the next segment on very slow networks. The symptom : a brief loading pause between clips on Slow 3G. Slow 4G and faster show no visible issue.

If the use case requires bulletproof seamless playback on bad networks with very short clips, the realistic next step is server-side pre-rendering with `ffmpeg -c copy` — generate one truly concatenated MP4 per playlist, upload to Bunny once, play normally. No discontinuities, no per-clip costs.

→ Tracked in [https://github.com/nicolasrouanne/video-chaining/issues/1](https://github.com/nicolasrouanne/video-chaining/issues/1)

## In production at Episto

The POC is intentionally stateless — sources pass through query parameters. In real production this maps cleanly to a Rails endpoint :

```text
GET /api/playlists/:id/playlist.m3u8                    → master
GET /api/playlists/:id/variant.m3u8?rendition=640x360   → 360p concat
```

…where sources come from `Playlist.find(id).videos`. The manifest is immutable per playlist version, so aggressive HTTP caching (or Redis) is the obvious next step.

## All links

- Repo : [https://github.com/nicolasrouanne/video-chaining](https://github.com/nicolasrouanne/video-chaining)
- Live POC : [https://codesandbox.io/p/github/nicolasrouanne/video-chaining/main](https://codesandbox.io/p/github/nicolasrouanne/video-chaining/main)
- hls.js : [https://github.com/video-dev/hls.js](https://github.com/video-dev/hls.js)
- HLS EXT-X-DISCONTINUITY (Mux) : [https://www.mux.com/articles/hls-ext-tags](https://www.mux.com/articles/hls-ext-tags)
- Bunny Stream docs : [https://docs.bunny.net/docs/stream-collections](https://docs.bunny.net/docs/stream-collections)
