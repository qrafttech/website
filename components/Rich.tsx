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

        if (accent) {
          return (
            <span key={index} className="text-blue">
              {text}
            </span>
          );
        }

        if (underline) {
          return (
            <span
              key={index}
              className="underline decoration-blue decoration-[0.09em] underline-offset-[0.14em]"
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
