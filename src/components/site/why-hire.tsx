import { Reveal } from "@/components/motion/reveal";
import { whyHire, type HireCard } from "@/lib/site-data";
import { cn } from "@/lib/utils";

function Card({ card }: { card: HireCard }) {
  return (
    <div
      className={cn(
        "h-full rounded-[16px] p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 sm:p-[28px]",
        card.inverted
          ? "bg-ink hover:shadow-[0_28px_56px_-30px_rgba(26,23,20,0.7)]"
          : "border border-line bg-paper-card hover:shadow-[0_18px_36px_-22px_rgba(26,23,20,0.4)]",
      )}
    >
      <div
        className={cn(
          "mb-3.5 font-mono text-[11px]",
          card.inverted ? "text-brand-bright" : "text-brand",
        )}
      >
        {card.idx}
      </div>
      <h3
        className={cn(
          "mb-[9px] font-display text-[21px] font-bold tracking-[-0.01em]",
          card.inverted ? "text-paper-on-dark" : "text-ink",
        )}
      >
        {card.title}
      </h3>
      <p
        className={cn(
          "text-[14.5px] leading-[1.55]",
          card.inverted ? "text-muted-on-dark" : "text-ink-soft-2",
        )}
      >
        {card.body}
      </p>
    </div>
  );
}

export function WhyHire() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-[50px] sm:px-7">
      <Reveal>
        <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
          {whyHire.kicker}
        </p>
        <h2 className="mb-[26px] font-display text-[clamp(28px,3.4vw,42px)] font-extrabold tracking-[-0.025em] text-ink">
          {whyHire.heading}
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
        {whyHire.cards.map((card, i) => (
          <Reveal key={card.idx} delay={i * 0.07}>
            <Card card={card} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
