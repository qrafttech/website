import clsx from "clsx";

import type { LedgerBlock } from "@/lib/i18n/types";

/**
 * The two-column ledger — a statement of account, used for the offer blocks
 * and for the values.
 *
 * One rule opens it and none divide it. The rows needed no dividers: the grid
 * gap and each row's own display heading already say where one ends, and four
 * ruled rows read as a form rather than as a statement. The opening rule's
 * colour is the caller's, because it has to sit against that section's band.
 */
export default function Ledger({
  blocks,
  className,
}: {
  blocks: readonly LedgerBlock[];
  className?: string;
}) {
  return (
    <dl
      className={clsx(
        "grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-4 border-t nav:grid-cols-2",
        className
      )}
    >
      {blocks.map((block) => (
        <div key={block.key} className="py-7">
          <dt className="font-display text-[1.3125rem] font-bold leading-[1.2]">
            {block.title}
          </dt>
          <dd className="mt-2.5 max-w-[58ch] text-[0.9375rem] leading-[1.7] text-muted">
            {block.body}
          </dd>
        </div>
      ))}
    </dl>
  );
}
