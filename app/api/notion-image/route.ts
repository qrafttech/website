import { NextRequest, NextResponse } from "next/server";
import { notion } from "../../../lib/notion";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CACHE_HEADER =
  "public, s-maxage=86400, stale-while-revalidate=604800, max-age=3600";

export async function GET(request: NextRequest) {
  const blockId = request.nextUrl.searchParams.get("blockId");

  if (!blockId || !UUID_RE.test(blockId)) {
    return NextResponse.json({ error: "Invalid blockId" }, { status: 400 });
  }

  let block;
  try {
    block = await notion.blocks.retrieve({ block_id: blockId });
  } catch {
    return NextResponse.json({ error: "Block not found" }, { status: 404 });
  }

  if (
    !("type" in block) ||
    block.type !== "image" ||
    block.image.type !== "file"
  ) {
    return NextResponse.json(
      { error: "Block is not a Notion-hosted image" },
      { status: 404 }
    );
  }

  const upstream = await fetch(block.image.file.url);
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "Upstream fetch failed" },
      { status: 502 }
    );
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "image/*",
      "Cache-Control": CACHE_HEADER,
    },
  });
}
