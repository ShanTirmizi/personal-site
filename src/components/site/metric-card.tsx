"use client";

import { useCountUp } from "@/hooks/use-count-up";
import type { Metric } from "@/lib/site-data";

export function MetricCard({ metric }: { metric: Metric }) {
  const { ref, value } = useCountUp(metric.value);
  const n = Math.round(value);
  const display = `${n === 0 ? "" : metric.prefix}${n}${metric.suffix}`;

  return (
    <div className="rounded-[13px] border border-line bg-paper-card px-[22px] py-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-22px_rgba(26,23,20,0.4)]">
      <span
        ref={ref}
        className="block [font-family:var(--font-display)] text-[34px] font-extrabold leading-none tracking-[-0.025em] text-brand tabular-nums sm:text-[38px]"
      >
        {display}
      </span>
      <div className="mt-2.5 text-[14.5px] font-semibold text-ink">{metric.label}</div>
      <div className="mt-[3px] text-[12px] text-muted-3">{metric.context}</div>
    </div>
  );
}
