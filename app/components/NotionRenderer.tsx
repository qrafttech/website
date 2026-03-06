import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import type { NotionBlock } from "../../lib/notion";
import { extractPlainText } from "../../lib/notion";

function isSafeHref(href: string): boolean {
  return href.startsWith("https://") || href.startsWith("http://");
}

function getBlockRichText(block: NotionBlock): RichTextItemResponse[] | null {
  const typeData = (block as Record<string, unknown>)[block.type];
  if (
    typeof typeData === "object" &&
    typeData !== null &&
    "rich_text" in typeData &&
    Array.isArray((typeData as { rich_text: unknown }).rich_text)
  ) {
    return (typeData as { rich_text: RichTextItemResponse[] }).rich_text;
  }
  return null;
}

function RichText({ richText }: { richText: RichTextItemResponse[] }) {
  return (
    <>
      {richText.map((text, i) => {
        const { bold, italic, strikethrough, underline, code } =
          text.annotations;

        let content: React.ReactNode = text.plain_text;

        if (code) {
          content = (
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
              {content}
            </code>
          );
        }
        if (bold) content = <strong>{content}</strong>;
        if (italic) content = <em>{content}</em>;
        if (strikethrough) content = <s>{content}</s>;
        if (underline) content = <u>{content}</u>;

        if (text.href) {
          const safeHref = isSafeHref(text.href) ? text.href : "#";
          return (
            <a
              key={i}
              href={safeHref}
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          );
        }

        return <span key={i}>{content}</span>;
      })}
    </>
  );
}

type GroupedItem =
  | { kind: "block"; block: NotionBlock }
  | { kind: "list"; listType: "ul" | "ol"; items: NotionBlock[] };

function groupBlocks(blocks: NotionBlock[]): GroupedItem[] {
  const result: GroupedItem[] = [];

  for (const block of blocks) {
    if (
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item"
    ) {
      const listType = block.type === "bulleted_list_item" ? "ul" : "ol";
      const last = result[result.length - 1];
      if (last && last.kind === "list" && last.listType === listType) {
        last.items.push(block);
      } else {
        result.push({ kind: "list", listType, items: [block] });
      }
    } else {
      result.push({ kind: "block", block });
    }
  }

  return result;
}

function ListItem({ block }: { block: NotionBlock }) {
  const richText = getBlockRichText(block);
  if (!richText) return null;

  return (
    <li className="text-base text-zinc-700">
      <RichText richText={richText} />
      {block.children && block.children.length > 0 && (
        <NotionRenderer blocks={block.children} />
      )}
    </li>
  );
}

function BlockRenderer({ block }: { block: NotionBlock }) {
  switch (block.type) {
    case "paragraph":
      if (block.paragraph.rich_text.length === 0) {
        return <div className="h-6" />;
      }
      return (
        <p className="text-base leading-relaxed text-zinc-700">
          <RichText richText={block.paragraph.rich_text} />
        </p>
      );

    case "heading_1":
    case "heading_2":
    case "heading_3": {
      const config = {
        heading_1: { tag: "h2" as const, size: "text-xl md:text-2xl" },
        heading_2: { tag: "h3" as const, size: "text-lg md:text-xl" },
        heading_3: { tag: "h4" as const, size: "text-base md:text-lg" },
      }[block.type];
      const richText = getBlockRichText(block);
      if (!richText) return null;
      const Tag = config.tag;
      return (
        <Tag className={`font-serif ${config.size} font-bold text-zinc-900`}>
          <RichText richText={richText} />
        </Tag>
      );
    }

    case "code":
      return (
        <div>
          {block.code.language && (
            <span className="text-xs uppercase tracking-wide text-zinc-400">
              {block.code.language}
            </span>
          )}
          <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-2 md:p-4">
            <code className="text-sm text-zinc-100">
              {extractPlainText(block.code.rich_text)}
            </code>
          </pre>
        </div>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-zinc-300 pl-4 italic text-zinc-600">
          <RichText richText={block.quote.rich_text} />
        </blockquote>
      );

    case "callout":
      return (
        <div className="flex gap-3 rounded-lg bg-zinc-50 p-4">
          {block.callout.icon?.type === "emoji" && (
            <span className="text-xl">{block.callout.icon.emoji}</span>
          )}
          <div className="text-base text-zinc-700">
            <RichText richText={block.callout.rich_text} />
          </div>
        </div>
      );

    case "divider":
      return <hr className="border-zinc-200" />;

    case "image": {
      const imgUrl =
        block.image.type === "file"
          ? block.image.file.url
          : block.image.external.url;
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt={
              block.image.caption.length > 0
                ? extractPlainText(block.image.caption)
                : ""
            }
            className="max-w-full rounded-lg"
          />
          {block.image.caption.length > 0 && (
            <figcaption className="pt-2 text-center text-sm text-zinc-500">
              <RichText richText={block.image.caption} />
            </figcaption>
          )}
        </figure>
      );
    }

    case "bookmark": {
      const bookmarkUrl = block.bookmark.url;
      const safeUrl = isSafeHref(bookmarkUrl) ? bookmarkUrl : "#";
      return (
        <a
          href={safeUrl}
          className="block rounded-lg border border-zinc-200 p-4 text-sm text-blue-600 underline hover:bg-zinc-50 hover:text-blue-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          {block.bookmark.caption.length > 0
            ? extractPlainText(block.bookmark.caption)
            : bookmarkUrl}
        </a>
      );
    }

    default:
      return null;
  }
}

export default function NotionRenderer({ blocks }: { blocks: NotionBlock[] }) {
  const grouped = groupBlocks(blocks);

  return (
    <div className="space-y-6">
      {grouped.map((item, i) => {
        if (item.kind === "list") {
          const Tag = item.listType;
          const listClass =
            item.listType === "ul"
              ? "list-disc space-y-2 pl-6"
              : "list-decimal space-y-2 pl-6";
          return (
            <Tag key={i} className={listClass}>
              {item.items.map((block) => (
                <ListItem key={block.id} block={block} />
              ))}
            </Tag>
          );
        }
        return <BlockRenderer key={item.block.id} block={item.block} />;
      })}
    </div>
  );
}
