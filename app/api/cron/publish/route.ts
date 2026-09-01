import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { LOCALES } from "@/lib/i18n/config";

/**
 * Releases the articles scheduled for today. The blog lists are cached until
 * something drops them, and a page whose `Date` arrives triggers no Notion
 * webhook — so Vercel calls this every night (see `vercel.json`) to re-query
 * Notion with the new day. Vercel sends its `CRON_SECRET` as a bearer token.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Cron not configured" }, { status: 500 });
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const revalidated = LOCALES.map((locale) => `blog-list-${locale}`);
  for (const tag of revalidated) {
    revalidateTag(tag, "max");
  }

  console.log(`[cron/publish] revalidated ${revalidated.join(", ")}`);

  return NextResponse.json({ revalidated });
}
