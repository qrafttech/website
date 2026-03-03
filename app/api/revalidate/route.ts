import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

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

  const expectedBuf = Buffer.from(expected, "hex");
  const signatureBuf = Buffer.from(signature, "hex");

  if (
    expectedBuf.length !== signatureBuf.length ||
    !timingSafeEqual(expectedBuf, signatureBuf)
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  revalidateTag("blog-articles", "max");
  return NextResponse.json({ revalidated: true });
}
