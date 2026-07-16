import { hero } from "@/lib/i18n/fr/landing";

const DIFF_RE = /([+−])(\d+)/g;

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

export default function Stream() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 left-[42%] hidden flex-col justify-end px-[clamp(1.5rem,3.6vw,3.75rem)] pb-[clamp(2.5rem,6vh,4.25rem)] font-mono text-[clamp(0.8125rem,1.1vw,0.9375rem)] leading-[2.15] text-stream-txt opacity-60 [-webkit-mask-image:linear-gradient(180deg,transparent_26%,#000_58%)] [mask-image:linear-gradient(180deg,transparent_26%,#000_58%)] nav:flex"
    >
      {hero.stream.sessions.map((session) => (
        <div key={session.label} className="flex flex-col">
          <div className="mt-2.5 text-[0.85em] uppercase tracking-[0.06em] text-stream-dim">
            {session.label}
          </div>
          {session.rows.map((row) => (
            <div key={row.ix} className="flex flex-col">
              <div className="flex gap-3 overflow-hidden whitespace-nowrap">
                <span className="w-[4ch] flex-none text-[0.85em] text-stream-dim">
                  {row.ix}
                </span>
                <span>{row.text}</span>
                <span className="ml-auto flex-none pl-2.5 text-term-ok">
                  {row.status}
                </span>
              </div>
              {row.sub ? (
                <div className="pl-[calc(4ch+0.75rem)] text-[0.85em] text-stream-dim">
                  {renderSub(row.sub)}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ))}
      <div className="flex gap-3">
        <span className="w-[4ch] flex-none text-[0.85em] text-stream-dim">
          ❯
        </span>
        <span>
          <span className="inline-block h-[1.02em] w-[0.4375rem] animate-caret bg-blue align-[-0.125rem]" />
        </span>
      </div>
    </div>
  );
}
