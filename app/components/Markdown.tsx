import Link from "next/link";
import ReactMarkdown, {
  type Components,
  defaultUrlTransform,
} from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Root } from "mdast";

import Eyebrow from "@/components/Eyebrow";
import { assetUrl } from "@/lib/blog";

const CALLOUT_MARKER = /^\[!(NOTE|TIP|WARNING)\]\s*/;
const CALLOUT_ICON: Record<string, string> = { tip: "💡", warning: "⚠️" };

/**
 * GitHub's alert syntax, `> [!TIP]` on the first line of a quote, makes the
 * quote a callout: it is rendered as an `<aside data-callout="tip">`.
 */
function remarkCallouts() {
  return (tree: Root) => {
    for (const node of tree.children) {
      if (node.type !== "blockquote") continue;
      const paragraph = node.children[0];
      const text =
        paragraph?.type === "paragraph" ? paragraph.children[0] : undefined;
      const match = text?.type === "text" && text.value.match(CALLOUT_MARKER);
      if (!text || text.type !== "text" || !match) continue;

      text.value = text.value.slice(match[0].length);
      node.data = {
        hName: "aside",
        hProperties: { dataCallout: match[1].toLowerCase() },
      };
    }
  };
}

function isSafeHref(href: string): boolean {
  return /^(https?:\/\/|mailto:|\/|#)/.test(href);
}

const components: Components = {
  // An image on its own line is a figure, not a paragraph.
  p: ({ node, children }) => {
    const only = node?.children.length === 1 ? node.children[0] : null;
    if (only?.type === "element" && only.tagName === "img")
      return <>{children}</>;
    return <p className="text-base leading-relaxed text-muted">{children}</p>;
  },
  h1: ({ children }) => (
    <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="font-display text-lg font-semibold text-ink md:text-xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display text-base font-semibold text-ink md:text-lg">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-2 pl-6">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-2 pl-6">{children}</ol>
  ),
  li: ({ children }) => <li className="text-base text-muted">{children}</li>,
  a: ({ href = "", children }) => {
    const className = "text-blue underline underline-offset-4 hover:text-ink2";
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    }
    return (
      <a
        href={isSafeHref(href) ? href : "#"}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  },
  code: ({ children }) => (
    <code className="bg-chip px-1.5 py-0.5 font-mono text-sm">{children}</code>
  ),
  pre: ({ node }) => {
    const code = node?.children[0];
    if (code?.type !== "element") return null;
    const className = code.properties.className;
    const language = Array.isArray(className)
      ? String(className[0]).replace(/^language-/, "")
      : "";
    const text = code.children
      .map((child) => (child.type === "text" ? child.value : ""))
      .join("")
      .replace(/\n$/, "");
    return (
      <div>
        {language && <Eyebrow as="span">{language}</Eyebrow>}
        <pre className="overflow-x-auto bg-chip p-2 md:p-4">
          <code className="font-mono text-sm text-ink2">{text}</code>
        </pre>
      </div>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="space-y-4 border-l-2 border-blue pl-4 text-muted">
      {children}
    </blockquote>
  ),
  aside: ({ node, children }) => {
    const icon = CALLOUT_ICON[String(node?.properties.dataCallout)];
    return (
      <aside className="flex gap-3 border border-hair bg-chip p-4">
        {icon && <span className="text-xl">{icon}</span>}
        <div className="space-y-4">{children}</div>
      </aside>
    );
  },
  hr: () => <hr className="border-hair" />,
  img: ({ src, alt = "", title }) => (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={typeof src === "string" ? src : undefined}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="max-w-full"
      />
      {title && (
        <Eyebrow as="figcaption" className="pt-2 text-center">
          {title}
        </Eyebrow>
      )}
    </figure>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-hair p-2 text-left font-semibold text-ink">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-hair p-2 align-top text-muted">{children}</td>
  ),
};

/**
 * An article body. `dir` is the article's folder: an image written
 * `![…](diagram.png)` is the file next to the Markdown.
 */
export default function Markdown({ body, dir }: { body: string; dir: string }) {
  return (
    <div className="space-y-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkCallouts]}
        components={components}
        urlTransform={(url, key) =>
          key === "src" && !/^([a-z]+:|\/)/i.test(url)
            ? assetUrl(dir, url)
            : defaultUrlTransform(url)
        }
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
