import { notFound } from "next/navigation";

/**
 * The 404 catch-all.
 *
 * Every unprefixed URL is rewritten to `/fr/…` by the middleware, so a URL
 * that matches nothing arrives here as `/fr/<whatever>` rather than as an
 * unmatched request. Without this segment those would fall through to Next's
 * built-in 404 — the site's root layout lives under `[lang]`, so there is no
 * layout above to give an unmatched URL the nav bar, the footer or `<html lang>`.
 * Catching them here puts the branded `app/[lang]/not-found.tsx` inside the
 * real chrome, and keeps the 404 status.
 */
/** Cache Components requires at least one result; the value is irrelevant,
 *  since every path through this segment ends in `notFound()`. */
export function generateStaticParams() {
  return [{ rest: ["_"] }];
}

export default function CatchAll(): never {
  notFound();
}
