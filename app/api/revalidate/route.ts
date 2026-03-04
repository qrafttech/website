import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.verification_token) {
    console.log("Notion verification_token:", payload.verification_token);
    return NextResponse.json({ ok: true });
  }

  const secret = process.env.NOTION_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const rawSignature = request.headers.get("x-notion-signature");
  if (!rawSignature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const signature = rawSignature.replace(/^sha256=/, "");
  const expected = createHmac("sha256", secret).update(body).digest("hex");

  const expectedBuf = new Uint8Array(Buffer.from(expected, "hex"));
  const signatureBuf = new Uint8Array(Buffer.from(signature, "hex"));

  if (
    expectedBuf.length !== signatureBuf.length ||
    !timingSafeEqual(expectedBuf, signatureBuf)
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const type = typeof payload.type === "string" ? payload.type : "";
  const entity = payload.entity as Record<string, unknown> | undefined;
  const pageId =
    typeof entity?.id === "string" ? entity.id.replace(/-/g, "") : "";
  const normalizedPageId = pageId
    ? [
        pageId.slice(0, 8),
        pageId.slice(8, 12),
        pageId.slice(12, 16),
        pageId.slice(16, 20),
        pageId.slice(20),
      ].join("-")
    : "";

  const revalidated: string[] = [];

  switch (type) {
    case "page.content_updated":
      if (normalizedPageId) {
        revalidateTag(`blog-article-${normalizedPageId}`, "max");
        revalidated.push(`blog-article-${normalizedPageId}`);
      }
      break;

    case "page.properties_updated":
      revalidateTag("blog-list", "max");
      revalidated.push("blog-list");
      if (normalizedPageId) {
        revalidateTag(`blog-article-${normalizedPageId}`, "max");
        revalidated.push(`blog-article-${normalizedPageId}`);
      }
      break;

    case "page.created":
      revalidateTag("blog-list", "max");
      revalidated.push("blog-list");
      break;

    case "page.deleted":
      revalidateTag("blog-list", "max");
      revalidated.push("blog-list");
      if (normalizedPageId) {
        revalidateTag(`blog-article-${normalizedPageId}`, "max");
        revalidated.push(`blog-article-${normalizedPageId}`);
      }
      break;

    default:
      revalidateTag("blog-list", "max");
      revalidated.push("blog-list");
      break;
  }

  return NextResponse.json({ revalidated });
}
