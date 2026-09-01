import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { LOCALES } from "@/lib/i18n/config";

/**
 * One list per locale. The webhook payload does not say which language the
 * page is in, and a property update may be the `Language` select itself, so
 * both lists are dropped together.
 */
const lists = LOCALES.map((locale) => `blog-list-${locale}`);

const tagsByEvent: Record<string, (pageId: string) => string[]> = {
  "page.content_updated": (id) => (id ? [`blog-article-${id}`] : []),
  "page.properties_updated": (id) =>
    id ? [...lists, `blog-article-${id}`] : lists,
  "page.created": () => lists,
  "page.deleted": (id) => (id ? [...lists, `blog-article-${id}`] : lists),
};

export async function POST(request: NextRequest) {
  const body = await request.text();

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
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
  const pageId = typeof entity?.id === "string" ? entity.id : "";

  console.log(`[revalidate] type=${type} pageId=${pageId}`);

  const getTags = tagsByEvent[type];
  const revalidated = getTags ? getTags(pageId) : [];

  for (const tag of revalidated) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ revalidated });
}
