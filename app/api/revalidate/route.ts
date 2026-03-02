import { createHmac } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const secret = process.env.NOTION_WEBHOOK_SECRET;

  if (secret) {
    const signature = request.headers.get("x-notion-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const expected = createHmac("sha256", secret).update(body).digest("hex");

    if (signature !== expected) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const payload = JSON.parse(body);

  if (payload.type === "url_verification") {
    return NextResponse.json({ challenge: payload.challenge });
  }

  revalidateTag("blog-articles", "max");
  return NextResponse.json({ revalidated: true });
}
