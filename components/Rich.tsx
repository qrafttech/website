import clsx from "clsx";

import type { RichText } from "@/lib/i18n/types";

interface RichProps {
  content: RichText;
  strongClassName?: string;
  /** Overrides the body-copy link treatment. A display heading needs the link
   *  to inherit its own size and weight — the default 2px underline set for
   *  17px prose reads as a scar at 4.5rem. */
  linkClassName?: string;
}

export default function Rich({
  content,
  strongClassName,
  linkClassName,
}: RichProps) {
  return (
    <>
      {content.map((segment, index) => {
        const { text, strong, accent, href } = segment;

        if (href) {
          const external = href.startsWith("http");
          return (
            <a
              key={index}
              href={href}
              className={clsx(
                linkClassName ??
                  "font-display font-semibold text-blue underline decoration-2 underline-offset-4 hover:text-ink2"
              )}
              {...(external
                ? { target: "_blank", rel: "noreferrer" }
                : undefined)}
            >
              {text}
            </a>
          );
        }

        if (strong) {
          return (
            <strong
              key={index}
              className={clsx(strongClassName ?? "font-semibold")}
            >
              {text}
            </strong>
          );
        }

        if (accent) {
          return (
            <span
              key={index}
              className="bg-brand bg-clip-text text-transparent"
            >
              {text}
            </span>
          );
        }

        return <span key={index}>{text}</span>;
      })}
    </>
  );
}
