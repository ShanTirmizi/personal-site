import { Fragment } from "react";
import { Reveal } from "@/components/motion/reveal";
import { shippedAt } from "@/lib/site-data";

export function ShippedAt() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-[30px] sm:px-7">
      <Reveal className="flex flex-wrap items-center gap-x-[22px] gap-y-3 rounded-[13px] border border-line bg-paper-card px-6 py-[18px]">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-3">
          Shipped production software at
        </span>
        {shippedAt.map((co, i) => (
          <Fragment key={co}>
            {i > 0 && (
              <span className="text-faint-2 max-sm:hidden" aria-hidden>
                ·
              </span>
            )}
            <span className="font-display text-[17px] font-bold tracking-[-0.01em] text-ink sm:text-[18px]">
              {co}
            </span>
          </Fragment>
        ))}
      </Reveal>
    </section>
  );
}
