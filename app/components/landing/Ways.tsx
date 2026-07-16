import Wrap from "@/components/Wrap";
import { ways } from "@/lib/i18n/fr/landing";

export default function Ways() {
  return (
    <section className="bg-panel py-24 text-ink nav:py-[8rem]">
      <Wrap>
        <dl className="border-t border-rule">
          {ways.columns.map((column) => (
            <div
              key={column.title}
              className="grid gap-x-14 gap-y-2 border-b border-rule py-7 nav:grid-cols-[minmax(0,22rem)_1fr]"
            >
              <dt className="font-display text-[1.1875rem] font-semibold leading-[1.25]">
                {column.title}
              </dt>
              <dd className="max-w-[64ch] text-[0.9375rem] text-muted">
                {column.body}
              </dd>
            </div>
          ))}
        </dl>
      </Wrap>
    </section>
  );
}
