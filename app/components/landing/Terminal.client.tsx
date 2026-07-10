"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useReducedMotion } from "motion/react";

import { getDictionary } from "@/lib/i18n";

interface TermStep {
  label: string;
  status: string;
  detail?: string;
  progress?: boolean;
}

type Line =
  | { id: number; kind: "sess"; n: number }
  | {
      id: number;
      kind: "cmd";
      index: number;
      text: string;
      running: boolean;
      time: string;
      status: string;
    }
  | { id: number; kind: "sub"; detail: string }
  | { id: number; kind: "bar"; filled: number }
  | { id: number; kind: "prompt" };

const FRAMES = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
const T_MAX = 8;

const pad2 = (n: number) => String(n).padStart(2, "0");

function parseDetail(detail: string): { text: string; cls?: string }[] {
  const parts: { text: string; cls?: string }[] = [];
  // U+2212 MINUS SIGN, as stored in the dictionary.
  const re = /([+−])(\d+)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(detail)) !== null) {
    if (match.index > last)
      parts.push({ text: detail.slice(last, match.index) });
    parts.push({
      text: match[0],
      cls: match[1] === "+" ? "text-term-add" : "text-term-del",
    });
    last = re.lastIndex;
  }
  if (last < detail.length) parts.push({ text: detail.slice(last) });
  return parts;
}

function Caret() {
  return (
    <span className="inline-block h-[1.02em] w-[7px] animate-caret bg-term-acc align-[-2px] shadow-[0_0_10px_1px_#2f4bd0]" />
  );
}

const LINE_BASE =
  "flex items-baseline whitespace-nowrap text-term-txt transition-opacity duration-500 ease-epure";
const SEG = "relative flex items-center gap-1.5 px-3";
const DIVIDER =
  "before:content-[''] before:absolute before:left-0 before:top-[5px] before:bottom-[5px] before:w-px before:bg-term-hair";

export default function Terminal() {
  const t = getDictionary();
  const term = t.hero.terminal;
  const steps = term.steps as readonly TermStep[];
  const reduced = useReducedMotion();

  // The hero hides the terminal below 900px; without this the session loop
  // would still tick behind `display: none`.
  const [onDesktop, setOnDesktop] = useState(false);

  const [lines, setLines] = useState<Line[]>([]);
  const [footer, setFooter] = useState<{
    sp: string;
    act: string;
    clock: string;
    tok: string;
  }>({
    sp: "⠋",
    act: term.idle,
    clock: "00:00",
    tok: `0 ${term.tokenSuffix}`,
  });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 900px)");
    const sync = () => setOnDesktop(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!onDesktop) return;

    if (reduced) {
      setFooter({
        sp: "✓",
        act: term.doneLabel,
        clock: term.doneClock,
        tok: `${term.doneTokens} ${term.tokenSuffix}`,
      });
      let sid = 0;
      const out: Line[] = [{ id: sid++, kind: "sess", n: 1 }];
      steps.forEach((step, i) => {
        out.push({
          id: sid++,
          kind: "cmd",
          index: i,
          text: step.label,
          running: false,
          time: (0.4 + i * 0.3).toFixed(1) + "s",
          status: step.status,
        });
        if (step.progress) out.push({ id: sid++, kind: "bar", filled: 12 });
        else if (step.detail)
          out.push({ id: sid++, kind: "sub", detail: step.detail });
      });
      setLines(out);
      return;
    }

    let aborted = false;
    const timers = new Set<number>();
    let idSeq = 0;
    let buffer: Line[] = [];
    let sess = 1;
    let tFrame = 0;
    let tTokens = 0;

    const commit = () => {
      if (!aborted) setLines(buffer.slice());
    };
    const pushLine = (line: Line) => {
      buffer.push(line);
      while (buffer.length > T_MAX) buffer.shift();
    };
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });

    const t0 = Date.now();
    const footerId = window.setInterval(() => {
      if (aborted) return;
      tFrame = (tFrame + 1) % FRAMES.length;
      tTokens += 12 + Math.floor(Math.random() * 46);
      const s = Math.floor((Date.now() - t0) / 1000);
      setFooter((f) => ({
        ...f,
        sp: FRAMES[tFrame],
        tok: `${tTokens.toLocaleString("fr-FR")} ${term.tokenSuffix}`,
        clock: `${pad2((s / 60) | 0)}:${pad2(s % 60)}`,
      }));
    }, 90);
    timers.add(footerId);

    const runTerm = async () => {
      buffer = [];
      pushLine({ id: idSeq++, kind: "sess", n: sess });
      commit();
      setFooter((f) => ({ ...f, act: term.starting }));
      await wait(850);
      if (aborted) return;

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        setFooter((f) => ({ ...f, act: step.label }));
        const line: Extract<Line, { kind: "cmd" }> = {
          id: idSeq++,
          kind: "cmd",
          index: i,
          text: "",
          running: true,
          time: "",
          status: "",
        };
        pushLine(line);
        commit();

        for (const ch of step.label) {
          line.text += ch;
          commit();
          await wait(18 + Math.random() * 30);
          if (aborted) return;
        }

        const start = Date.now();
        const tick = window.setInterval(() => {
          if (aborted) return;
          line.status = FRAMES[Math.floor(Date.now() / 90) % FRAMES.length];
          line.time = ((Date.now() - start) / 1000).toFixed(1) + "s";
          commit();
        }, 90);
        timers.add(tick);

        if (step.progress) {
          const bar: Extract<Line, { kind: "bar" }> = {
            id: idSeq++,
            kind: "bar",
            filled: 0,
          };
          pushLine(bar);
          commit();
          for (let k = 0; k < 12; k++) {
            await wait(70 + Math.random() * 120);
            if (aborted) {
              window.clearInterval(tick);
              return;
            }
            bar.filled = k + 1;
            commit();
          }
        } else {
          await wait(480 + Math.random() * 820);
          if (aborted) {
            window.clearInterval(tick);
            return;
          }
        }

        window.clearInterval(tick);
        timers.delete(tick);
        line.running = false;
        line.status = step.status;
        line.time = ((Date.now() - start) / 1000).toFixed(1) + "s";
        commit();

        if (step.detail && !step.progress) {
          await wait(170);
          if (aborted) return;
          pushLine({ id: idSeq++, kind: "sub", detail: step.detail });
          commit();
        }
        await wait(340);
        if (aborted) return;
      }

      setFooter((f) => ({ ...f, act: term.idle }));
      pushLine({ id: idSeq++, kind: "prompt" });
      commit();
      await wait(2600);
      if (aborted) return;
      sess++;
      runTerm();
    };

    runTerm();

    return () => {
      aborted = true;
      timers.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
      timers.clear();
    };
  }, [onDesktop, reduced, term, steps]);

  const dimUntil = lines.length - 4;

  return (
    <>
      <div
        aria-hidden
        className="flex h-10 flex-none items-center gap-2 border-b border-term-hair bg-term-chrome px-[18px] font-mono text-[11px] uppercase tracking-[0.05em] text-term-dim"
      >
        <div className="flex gap-[7px]">
          <i className="h-[11px] w-[11px] rounded-full bg-[#e05561]" />
          <i className="h-[11px] w-[11px] rounded-full bg-[#d9a441]" />
          <i className="h-[11px] w-[11px] rounded-full bg-[#4fb96a]" />
        </div>
        <span className="ml-1.5">{term.title}</span>
        <span className="ml-auto flex items-center gap-1.5 text-term-meta">
          <b className="h-[6px] w-[6px] animate-tpulse rounded-full bg-[#4fb96a] shadow-[0_0_8px_1px_#4fb96a]" />
          {term.live}
        </span>
      </div>

      <div
        aria-hidden
        className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-[clamp(18px,2.2vw,30px)] py-4 font-mono text-[15px] leading-[1.85]"
      >
        {lines.map((line, i) =>
          renderLine(line, !reduced && i < dimUntil, term)
        )}
      </div>

      <div
        aria-hidden
        className="flex h-[26px] flex-none items-center border-t border-term-hair bg-term-chrome px-3 font-mono text-[11px] text-term-dim"
      >
        <span className={SEG}>
          <span className="inline-block w-[1ch] text-term-acc">
            {footer.sp}
          </span>
          <span className="text-term-meta">{footer.act}</span>
        </span>
        <span className={clsx(SEG, "ml-auto", DIVIDER)}>{footer.clock}</span>
        <span className={clsx(SEG, DIVIDER)}>
          <span className="text-term-meta">{footer.tok}</span>
        </span>
        <span className={clsx(SEG, DIVIDER)}>
          <span className="text-term-ok">{term.branch}</span>
        </span>
      </div>
    </>
  );
}

function renderLine(
  line: Line,
  dim: boolean,
  term: ReturnType<typeof getDictionary>["hero"]["terminal"]
) {
  const dimCls = dim ? "opacity-30" : "";

  if (line.kind === "sess") {
    return (
      <div
        key={line.id}
        className={clsx(
          "mb-0.5 flex items-center gap-[9px] text-xs uppercase tracking-[0.05em] text-term-dim transition-opacity duration-500 ease-epure",
          dimCls
        )}
      >
        <span className="block h-[6px] w-[6px] bg-term-acc" />
        {`${term.sessionPrefix} ${String(line.n).padStart(3, "0")}`}
      </div>
    );
  }

  if (line.kind === "cmd") {
    return (
      <div key={line.id} className={clsx(LINE_BASE, dimCls)}>
        <span className="w-[4.5ch] flex-none text-term-dim">
          / 0{line.index + 1}
        </span>
        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis">
          {line.text}
          {line.running && <Caret />}
        </span>
        <span className="flex-none px-2.5 text-xs text-term-dim">
          {line.time}
        </span>
        <span
          className={clsx(
            "min-w-[3.5ch] flex-none text-right",
            line.running ? "text-term-acc" : "animate-tpop text-term-ok"
          )}
        >
          {line.status}
        </span>
      </div>
    );
  }

  if (line.kind === "sub") {
    return (
      <div key={line.id} className={clsx(LINE_BASE, dimCls)}>
        <span className="w-[4.5ch] flex-none text-term-dim" />
        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis text-term-dim">
          {"└ "}
          {parseDetail(line.detail).map((p, i) =>
            p.cls ? (
              <span key={i} className={p.cls}>
                {p.text}
              </span>
            ) : (
              <span key={i}>{p.text}</span>
            )
          )}
        </span>
      </div>
    );
  }

  if (line.kind === "bar") {
    return (
      <div key={line.id} className={clsx(LINE_BASE, dimCls)}>
        <span className="w-[4.5ch] flex-none text-term-dim" />
        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis text-term-dim">
          {"└ "}
          <span className="inline-flex gap-[3px] text-term-acc">
            {Array.from({ length: 12 }).map((_, k) => (
              <i
                key={k}
                className={clsx(
                  "h-[11px] w-[7px] rounded-[1px] bg-current transition-opacity duration-200",
                  k < line.filled ? "opacity-100" : "opacity-[0.22]"
                )}
              />
            ))}
          </span>{" "}
          <span>{line.filled}/12</span>
        </span>
      </div>
    );
  }

  return (
    <div key={line.id} className={clsx(LINE_BASE, dimCls)}>
      <span className="w-[4.5ch] flex-none text-term-dim" />
      <span className="min-w-0 flex-1 overflow-hidden text-ellipsis text-term-acc">
        {"❯ "}
        <Caret />
      </span>
    </div>
  );
}
