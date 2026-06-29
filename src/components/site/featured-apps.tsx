import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { apps, appsNote, featured, type App } from "@/lib/site-data";
import { PhoneMockup } from "./phone-mockup";
import { HabitQuestScreen } from "./habitquest-screen";
import { StoreButtons } from "./store-buttons";

function AppCard({ app }: { app: App }) {
  return (
    <div className="flex h-full flex-col gap-[18px] rounded-[16px] border border-line bg-paper-card p-6 transition-shadow duration-300 hover:shadow-[0_18px_36px_-22px_rgba(26,23,20,0.4)]">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <PhoneMockup>
          {app.image ? (
            <Image
              src={app.image}
              alt={app.imageAlt ?? app.name}
              fill
              sizes="132px"
              className="object-cover"
            />
          ) : (
            <HabitQuestScreen />
          )}
        </PhoneMockup>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="font-display text-[24px] font-extrabold tracking-[-0.02em] text-ink">
              {app.name}
            </span>
            <span className="font-mono text-[10px] text-faint">{app.period}</span>
          </div>
          <div className="mt-1.5 mb-3 font-mono text-[11px] text-muted-3">{app.kind}</div>
          <ul className="flex flex-col gap-2">
            {app.highlights.map((h) => (
              <li key={h} className="flex gap-2 text-[13.5px] leading-[1.45] text-ink-soft">
                <ArrowRight size={15} className="mt-[3px] flex-none text-brand" aria-hidden />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-[5px]">
        {app.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-[5px] border border-line-soft bg-[rgba(26,23,20,0.04)] px-[7px] py-[3px] font-mono text-[10px] text-muted-2"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-auto">
        <StoreButtons store={app.store} />
      </div>
    </div>
  );
}

export function FeaturedApps() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-12 sm:px-7 sm:pt-[48px]">
      <Reveal>
        <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
          {featured.kicker}
        </p>
        <h2 className="mb-6 font-display text-[clamp(28px,3.4vw,42px)] font-extrabold tracking-[-0.025em] text-ink">
          {featured.heading}
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
        {apps.map((app, i) => (
          <Reveal key={app.id} delay={i * 0.08}>
            <AppCard app={app} />
          </Reveal>
        ))}
      </div>
      <p className="mt-3 font-mono text-[10.5px] text-faint">↳ {appsNote}</p>
    </section>
  );
}
