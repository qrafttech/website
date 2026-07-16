"use client";

import { memo, useEffect, useState } from "react";
import clsx from "clsx";
import { useReducedMotion } from "motion/react";

import { hero } from "@/lib/i18n/fr/landing";
import type { StreamRow } from "@/lib/i18n/types";

const DIFF_RE = /([+−])(\d+)/g;

const SESSIONS = hero.stream.sessions;
const LABEL_PREFIX = hero.stream.labelPrefix;
const FIRST_SESSION = SESSIONS[0].number;

const CHAR_MS = 35;
const SUB_CHAR_MS = 22;
const STATUS_MS = 600;
const ROW_PAUSE_MS = 900;
const LABEL_PAUSE_MS = 520;
const BOOT_PACE = 4;
const MAX_LINES = 24;
const PENDING = "…";

const ABORT = Symbol("stream-cancelled");

type Caret = "text" | "sub" | null;

interface LabelLine {
  id: string;
  kind: "label";
  text: string;
}

interface RowLine {
  id: string;
  kind: "row";
  ix: string;
  text: string;
  status: string;
  resolved: boolean;
  caret: Caret;
  sub: string | null;
}

type Line = LabelLine | RowLine;

const STATIC_LINES: Line[] = SESSIONS.flatMap((session) => {
  const label = `${LABEL_PREFIX}${session.number}`;

  return [
    { id: label, kind: "label", text: label } as LabelLine,
    ...session.rows.map(
      (row): RowLine => ({
        id: `${label}${row.ix}`,
        kind: "row",
        ix: row.ix,
        text: row.text,
        status: row.status,
        resolved: true,
        caret: null,
        sub: row.sub ?? null,
      })
    ),
  ];
});

function delay(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout>;

    const onAbort = () => {
      clearTimeout(timer);
      reject(ABORT);
    };

    timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function height(line: Line) {
  if (line.kind === "label") return 1;
  return line.sub ? 2 : 1;
}

function prune(lines: Line[]) {
  let total = 0;

  for (let i = lines.length - 1; i >= 0; i -= 1) {
    total += height(lines[i]);
    if (total > MAX_LINES) return lines.slice(i + 1);
  }

  return lines;
}

async function play(set: (next: Line[]) => void, signal: AbortSignal) {
  let lines: Line[] = [];
  let seq = 0;

  const flush = () => {
    lines = prune(lines);
    set(lines.slice());
  };

  flush();

  const patch = (fields: Partial<RowLine>) => {
    const last = lines[lines.length - 1] as RowLine;
    lines[lines.length - 1] = { ...last, ...fields };
    flush();
  };

  const type = async (field: "text" | "sub", full: string, pace: number) => {
    const step = (field === "sub" ? SUB_CHAR_MS : CHAR_MS) / pace;

    for (let i = 1; i <= full.length; i += 1) {
      await delay(step, signal);
      const value = full.slice(0, i);
      patch(
        field === "sub"
          ? { sub: value, caret: "sub" }
          : { text: value, caret: "text" }
      );
    }
  };

  const playRow = async (row: StreamRow, pace: number) => {
    seq += 1;
    lines.push({
      id: `l${seq}`,
      kind: "row",
      ix: row.ix,
      text: "",
      status: row.status,
      resolved: false,
      caret: "text",
      sub: null,
    });
    flush();

    await type("text", row.text, pace);
    if (row.sub) await type("sub", row.sub, pace);

    patch({ caret: null });
    await delay(STATUS_MS / pace, signal);
    patch({ resolved: true });
    await delay(ROW_PAUSE_MS / pace, signal);
  };

  let index = FIRST_SESSION;
  let pace = BOOT_PACE;

  while (!signal.aborted) {
    const session = SESSIONS[(index - FIRST_SESSION) % SESSIONS.length];

    seq += 1;
    lines.push({
      id: `l${seq}`,
      kind: "label",
      text: `${LABEL_PREFIX}${index}`,
    });
    flush();
    await delay(LABEL_PAUSE_MS / pace, signal);

    for (const row of session.rows) {
      await playRow(row, pace);
    }

    pace = 1;
    index += 1;
  }
}

function renderSub(sub: string) {
  const parts: { text: string; cls?: string }[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = DIFF_RE.exec(sub)) !== null) {
    if (match.index > last) parts.push({ text: sub.slice(last, match.index) });
    parts.push({
      text: match[0],
      cls: match[1] === "+" ? "text-term-ok" : "text-term-del",
    });
    last = DIFF_RE.lastIndex;
  }
  if (last < sub.length) parts.push({ text: sub.slice(last) });

  return parts.map((part, index) => (
    <span key={index} className={part.cls}>
      {part.text}
    </span>
  ));
}

function Caret({ blink = false }: { blink?: boolean }) {
  return (
    <span
      className={clsx(
        "inline-block h-[1.02em] w-[0.4375rem] bg-blue align-[-0.125rem]",
        blink && "animate-caret"
      )}
    />
  );
}

const StreamLine = memo(function StreamLine({ line }: { line: Line }) {
  if (line.kind === "label") {
    return (
      <div className="mt-2.5 text-[0.85em] uppercase tracking-[0.06em] text-stream-dim">
        {line.text}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-3 overflow-hidden whitespace-nowrap">
        <span className="w-[4ch] flex-none text-[0.85em] text-stream-dim">
          {line.ix}
        </span>
        <span>
          {line.text}
          {line.caret === "text" ? <Caret /> : null}
        </span>
        <span
          className={clsx(
            "ml-auto flex-none pl-2.5",
            line.resolved ? "text-term-ok" : "text-stream-dim"
          )}
        >
          {line.resolved ? line.status : PENDING}
        </span>
      </div>
      {line.sub ? (
        <div className="pl-[calc(4ch+0.75rem)] text-[0.85em] text-stream-dim">
          {renderSub(line.sub)}
          {line.caret === "sub" ? <Caret /> : null}
        </div>
      ) : null}
    </div>
  );
});

export default function Stream() {
  const reduced = useReducedMotion();
  const [lines, setLines] = useState<Line[] | null>(null);

  useEffect(() => {
    if (reduced) return;

    const controller = new AbortController();

    play(setLines, controller.signal).catch((error) => {
      if (error !== ABORT) throw error;
    });

    return () => controller.abort();
  }, [reduced]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 left-[42%] hidden flex-col justify-end overflow-hidden px-gutter pb-hero-b font-mono text-[clamp(0.8125rem,1.1vw,0.9375rem)] leading-[2.15] text-stream-txt opacity-60 [-webkit-mask-image:linear-gradient(180deg,transparent_26%,#000_58%)] [mask-image:linear-gradient(180deg,transparent_26%,#000_58%)] nav:flex"
    >
      {(reduced ? STATIC_LINES : lines ?? STATIC_LINES).map((line) => (
        <StreamLine key={line.id} line={line} />
      ))}
      <div className="flex gap-3">
        <span className="w-[4ch] flex-none text-[0.85em] text-stream-dim">
          ❯
        </span>
        <span>
          <Caret blink />
        </span>
      </div>
    </div>
  );
}
