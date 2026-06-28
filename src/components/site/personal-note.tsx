import { Reveal } from "@/components/motion/reveal";
import { personal } from "@/lib/site-data";

export function PersonalNote() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-[50px] sm:px-7">
      <Reveal className="mx-auto max-w-[720px] text-center">
        <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
          {personal.kicker}
        </p>
        <p className="text-[18px] leading-[1.6] text-ink-soft text-balance sm:text-[19px]">
          {personal.line}
        </p>
      </Reveal>
    </section>
  );
}
