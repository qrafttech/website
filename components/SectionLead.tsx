import type { ReactNode } from "react";
import clsx from "clsx";

/** The paragraph that follows a `SectionTitle` and states the argument before
 *  the proof underneath it. One measure, one size, on every section. */
export default function SectionLead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={clsx(
        "mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.65] text-muted",
        className
      )}
    >
      {children}
    </p>
  );
}
