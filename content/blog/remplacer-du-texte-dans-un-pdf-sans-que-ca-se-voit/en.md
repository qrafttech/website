---
title: "Replacing text in a PDF without it showing"
slug: replacing-text-in-a-pdf-without-it-showing
date: 2026-06-12
author: "Nicolas Rouanne"
---

I wanted to fix a label in a generated PDF — replace `Heures pleines / Heures creuses` with `Heures forfaitaires`. Five minutes, I figured. It turned into a dive into how PDF fonts actually work, and a good lesson on the difference between « looks right » and « is right ». The script that came out of it fits in one file; the road to get there, much less so.

Everything rides on [PyMuPDF](https://pymupdf.readthedocs.io/) (`fitz`), the Python bindings for [MuPDF](https://mupdf.com/), which does rendering, text extraction, redaction, and low-level content-stream editing all at once.

## 1. Redact, don't cover

The naive reflex — drawing a white rectangle over the text — removes nothing: the glyphs stay in the stream, recoverable by copy-paste or with `pdftotext`. PyMuPDF offers real [redaction](https://pymupdf.readthedocs.io/en/latest/page.html#Page.add_redact_annot) that pulls the glyphs out of the content stream.

```python
page.add_redact_annot(rect, fill=bg)
page.apply_redactions()
```

The catch: the redaction fill is white by default. On a beige sidebar, that leaves a pale rectangle. So we sample the background color right next to the text before redacting — to the left, else to the right, else above:

```python
def sample_background(page, rect, dpi=144):
    candidates = (
        fitz.Rect(rect.x0 - 6, rect.y0, rect.x0 - 2, rect.y1),
        fitz.Rect(rect.x1 + 2, rect.y0, rect.x1 + 6, rect.y1),
        fitz.Rect(rect.x0, rect.y0 - 6, rect.x1, rect.y0 - 2),
    )
    for clip in candidates:
        clip = clip & page.rect
        if clip.is_empty or clip.width < 1 or clip.height < 1:
            continue
        pix = page.get_pixmap(dpi=dpi, clip=clip)
        r, g, b = pix.pixel(pix.width // 2, pix.height // 2)[:3]
        return (r / 255, g / 255, b / 255)
    return (1, 1, 1)
```

A silly detail, but it's exactly the kind of detail that separates « clean » from « hacked together ». At this point the text is replaced and the background invisible. I could have stopped there. It's the font that tipped everything over.

→ [apply_redactions](https://pymupdf.readthedocs.io/en/latest/page.html#Page.apply_redactions)

## 2. Match like grep, not like full-text search

`page.search_for` ([docs](https://pymupdf.readthedocs.io/en/latest/page.html#Page.search_for)) matches across line breaks and returns partial rectangles. For `grep -F` behavior — each line of the pattern on a single PDF line, consecutive lines vertically adjacent and in the same column — we filter on geometry:

```python
candidates = [
    (t, b)
    for t, b in lines
    if needle in t
    and b.y0 > prev_bbox.y1 - 2                        # below the previous line
    and b.y0 - prev_bbox.y1 < prev_bbox.height * 1.5   # adjacent
    and b.x1 > prev_bbox.x0 and b.x0 < prev_bbox.x1    # same column
]
```

This keeps a label that recurs elsewhere on the page, broken differently, from polluting the replacement.

## 3. The rabbit hole: nameless fonts

Capturing a span's size, color, and baseline is trivial with [`get_text("dict")`](https://pymupdf.readthedocs.io/en/latest/textpage.html). The font is another story. The PDF came from a printed web page — its metadata says `producer: Skia/PDF`, `creator: Chromium`. And `page.get_fonts()` often returns:

```text
(7, 'n/a', 'Type3', '', 'F7', '', 0)
```

A **Type3** font: the glyphs are vector drawings embedded directly in the PDF — no font file, no name, no weight flag. To the code, an obviously bold label and plain body text are… identical (`flags = 0` for both).

With no metadata, we **measure the ink**. We render the text at high zoom and take the 25th percentile of horizontal black-run lengths — an approximation of vertical stem thickness, in em:

```python
def stem_from_pixmap(pix, fontsize, zoom):
    runs = []
    for y in range(pix.height):
        run = 0
        for x in range(pix.width):
            if sum(pix.pixel(x, y)[:3]) < 240:
                run += 1
            elif run:
                runs.append(run)
                run = 0
        if run:
            runs.append(run)
    if not runs:
        return 0.0
    runs.sort()
    return runs[len(runs) // 4] / (zoom * fontsize)
```

Calibration cleanly separates regular (≈ 0.083 em) from bold (0.125 em). But it still doesn't tell you **which** font to use for reinsertion.

## 4. Finding the real font

The clue was in the metadata: `Skia/Chromium`, it's a web page. So the PDF's fonts are the ones from the issuer's **site**. A single `curl` lists them:

```bash
curl -sL https://example.com | grep -oiE '[a-z0-9_/.-]+\.(woff2?|ttf|otf)' | sort -u
```

The `.ttf` files download directly, and PyMuPDF loads them via [`fitz.Font(fontfile=…)`](https://pymupdf.readthedocs.io/en/latest/font.html). I figured: done. It wasn't. The project got interesting precisely because I was wrong three times in a row, each time announcing it was « indistinguishable ».

## 5. Spacing: Chromium quantizes to the pixel

First mistake: even with the right file, the letter rhythm drifted along the line. Comparing advances character by character, the cause jumps out: Chromium **rounds every advance to the whole CSS pixel** (at 9 pt, 1 em = 12 px). The PDF's « T » is 4.50 pt where the font gives 5.39.

No font file reproduces that. You have to reuse the advances **observed** in the PDF, via [`get_text("rawdict")`](https://pymupdf.readthedocs.io/en/latest/textpage.html) which goes down to the character:

```python
def harvest_advances(page, caches):
    if "advances" not in caches:
        adv = {}
        for block in page.get_text("rawdict")["blocks"]:
            for line in block.get("lines", []):
                for span in line["spans"]:
                    fname, size = span["font"], round(span["size"], 1)
                    chars = span["chars"]
                    for i in range(len(chars) - 1):
                        d = chars[i + 1]["origin"][0] - chars[i]["origin"][0]
                        if d > 0:
                            adv.setdefault((fname, size, chars[i]["c"]), d)
        caches["advances"] = adv
    return caches["advances"]
```

For a character absent from the page (introduced by the replacement), we round the font's advance to the detected pixel grid — exactly what the generator would have done. On insertion, then, each glyph is positioned by hand.

## 6. Fake bold: rewriting the stroke width in the stream

Second mistake, the trickiest. The bold block measured 0.125 em of stem. Yet no real weight of the family landed there: Regular 0.083, Medium 0.111, Bold 0.139. The reason: Chromium had no « bold » file for this font, so it **strokes an outline** around the Regular (CSS fake bold). Regular's widths, thickened stems — unreproducible with a font file.

PyMuPDF can stroke text ([`render_mode=2`](https://pymupdf.readthedocs.io/en/latest/textwriter.html#TextWriter.write_text), the PDF `Tr` operator), but the stroke width isn't exposed by the API: `write_text` hardcodes `0.05 × fontsize`. Inspecting the emitted stream, you see the line-width operator:

```text
q
0 0 0 RG
0 0 0 rg
BT
2 Tr
.45 w        ← stroke width, hardcoded
/F0 9 Tf
1 0 0 1 2 10 Tm
[<00170012...>]TJ
ET
Q
```

The fix: let `write_text` write its stream, then **rewrite that .45 w** with a width calibrated on the measured stem gap. A stroke of width `w` thickens the stem by ~`w`; so we aim for `(target_stem − plain_stem) × size`:

```python
if stroke_w:
    tw.write_text(page, color=color, render_mode=2)
    xref = page.get_contents()[-1]
    stream = doc.xref_stream(xref)
    stream = re.sub(rb"[0-9.]+ w",
                    (f"{stroke_w:.4f} w").encode(), stream, count=1)
    doc.update_stream(xref, stream)
```

Calibration: `0.375 pt` of stroke → 0.125 em of stem, right on target. A single pass (clean text layer, correct copy-paste), exact thickness. The low-level stream access — [`xref_stream`](https://pymupdf.readthedocs.io/en/latest/document.html#Document.xref_stream) / [`update_stream`](https://pymupdf.readthedocs.io/en/latest/document.html#Document.update_stream) — is what makes the whole thing possible.

## 7. What ended the back-and-forth

The real lesson isn't technical: **my eye was a bad judge.** « Looks right » was wrong three times in a row.

What unblocked everything was to stop looking and **measure**. Replace the text **with itself**, then overlay the original and the output in false color — original ink on one channel, new ink on the other. Anything that isn't green is a deviation.

```python
from PIL import Image
a = orig_page.get_pixmap(dpi=500, clip=zone)
b = new_page.get_pixmap(dpi=500, clip=zone)
ia = Image.frombytes('RGB', (a.width, a.height), a.samples).convert('L')
ib = Image.frombytes('RGB', (b.width, b.height), b.samples).convert('L')
# red channel = new, blue channel = original, green = empty
Image.merge('RGB', (ib, Image.new('L', ib.size, 255), ia)).save('diff.png')
```

Paired with per-zone stem measurement, this yields a numeric criterion (0.0952 vs 0.0952, 0.125 vs 0.139) instead of an impression. That check is what revealed, zone by zone, that the header and sidebar were already perfect but the bold block was overshooting — not « looks thick », no: a number, wrong. Once the criterion is in place, fixing becomes mechanical.

→ [Pillow](https://pillow.readthedocs.io/), [Pixmap.samples](https://pymupdf.readthedocs.io/en/latest/pixmap.html#Pixmap.samples)

## 8. Packaging: a uv script with no install

Everything fits in one executable file, thanks to [uv scripts](https://docs.astral.sh/uv/guides/scripts/) and inline [PEP 723](https://peps.python.org/pep-0723/) metadata:

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pymupdf"]
# ///
```

The shebang runs `uv run`, which resolves and installs PyMuPDF in an ephemeral environment on first run. `./pdf_replace.py …` and you're off — zero `pip install`, zero virtualenv to manage.

## What's still pending

- **Fonts required.** Without the family's `.ttf`/`.otf`, you fall back to a base-14 (Helvetica & co): close, not identical. Chromium/Skia detection helps find them, but some sites obfuscate their fonts.
- **Mixed styles on one line.** The span with the largest overlap wins for the whole line; no intra-line splitting.
- **Noisy stem measurement.** The 25th percentile is sensitive to content (caps vs lowercase) and size; the thresholds are calibrated, not universal.
- **No OCR.** The text must exist in the text layer.
- **Validated on single-page Chromium/Skia.** Other generators quantize differently, or not at all.

My main takeaway: on a visual problem, **build your judge before you judge**. The false-color overlay did in one command what my eye had missed for three iterations.

## All links

- PyMuPDF: [https://pymupdf.readthedocs.io/](https://pymupdf.readthedocs.io/)
- TextWriter: [https://pymupdf.readthedocs.io/en/latest/textwriter.html](https://pymupdf.readthedocs.io/en/latest/textwriter.html)
- Redaction: [https://pymupdf.readthedocs.io/en/latest/page.html#Page.add_redact_annot](https://pymupdf.readthedocs.io/en/latest/page.html#Page.add_redact_annot)
- MuPDF: [https://mupdf.com/](https://mupdf.com/)
- uv (scripts): [https://docs.astral.sh/uv/guides/scripts/](https://docs.astral.sh/uv/guides/scripts/)
- PEP 723: [https://peps.python.org/pep-0723/](https://peps.python.org/pep-0723/)
- Pillow: [https://pillow.readthedocs.io/](https://pillow.readthedocs.io/)
- Skia: [https://skia.org/](https://skia.org/)
- Source code (gist): [https://gist.github.com/nicolasrouanne/a4eabaa146dc9709f1a0c5568b552076](https://gist.github.com/nicolasrouanne/a4eabaa146dc9709f1a0c5568b552076)
