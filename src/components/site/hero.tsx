import { hero } from "@/lib/site-data";
import { AssistantCard } from "./assistant-card";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-5 pt-10 pb-[34px] sm:px-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.06fr)] lg:gap-[50px] lg:pt-[46px]">
      {/* left:headline */}
      <div className="animate-rise">
        <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
          {hero.kicker}
        </div>
        <h2 className="font-display text-[clamp(33px,5vw,68px)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink sm:leading-[0.96]">
          {hero.headlineTop}
          <br />
          <span className="text-brand">{hero.headlineAccent}</span>
        </h2>
        <p className="mt-6 max-w-[440px] text-[17px] leading-[1.55] text-ink-soft-2 sm:text-[17.5px]">
          {hero.sub}
        </p>
        <div className="mt-5 font-mono text-[12px] leading-[1.6] text-muted-3">
          {hero.proofLine}
        </div>
      </div>

      {/* right:the live assistant */}
      <div className="animate-rise [animation-delay:0.1s]">
        <AssistantCard />
      </div>
    </section>
  );
}
