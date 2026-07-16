import clsx from "clsx";

import type { RichText } from "@/lib/i18n/types";

interface RichProps {
  content: RichText;
  strongClassName?: string;
}

export default function Rich({ content, strongClassName }: RichProps) {
  return (
    <>
      {content.map((segment, index) => {
        const { text, strong, accent, underline, href } = segment;

        if (href) {
          const external = href.startsWith("http");
          return (
            <a
              key={index}
              href={href}
              className="font-display font-semibold text-blue underline decoration-2 underline-offset-4 hover:text-ink2"
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

        if (accent || underline) {
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
