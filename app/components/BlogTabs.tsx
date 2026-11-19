import clsx from "clsx";

import MonoLink from "@/components/MonoLink";
import Wrap from "@/components/Wrap";
import { type Locale, localePath } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

/**
 * Under the hero of `/blog` and `/tmba`: the TMBA talks live in the blog
 * rather than in the nav, and these tabs are the way between the two lists.
 */
export default function BlogTabs({
  lang,
  current,
  copy,
}: {
  lang: Locale;
  current: "blog" | "tmba";
  copy: Dictionary["blog"]["tabs"];
}) {
  const tabs = [
    { key: "blog", label: copy.articles },
    { key: "tmba", label: copy.tmba },
  ] as const;

  return (
    <Wrap>
      <nav aria-label={copy.label} className="flex gap-8 border-b border-hair">
        {tabs.map((tab) => (
          <MonoLink
            key={tab.key}
            href={localePath(lang, `/${tab.key}`)}
            aria-current={tab.key === current ? "page" : undefined}
            className={clsx(
              "-mb-px border-b-2 py-4",
              tab.key === current
                ? "border-ink text-ink"
                : "border-transparent text-muted"
            )}
          >
            {tab.label}
          </MonoLink>
        ))}
      </nav>
    </Wrap>
  );
}
