import { Reveal } from "@/components/motion/reveal";
import { metrics } from "@/lib/site-data";
import { MetricCard } from "./metric-card";

export function ProofMetrics() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-3 sm:px-7">
      <div className="grid grid-cols-2 gap-[14px] md:grid-cols-4">
        {metrics.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.06}>
            <MetricCard metric={m} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
