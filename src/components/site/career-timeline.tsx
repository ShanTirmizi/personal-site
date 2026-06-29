"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { timeline, type TimelineRole } from "@/lib/cv-data";
import { cn } from "@/lib/utils";

function Panel({
  role,
  focused,
  isDark,
  onFocus,
}: {
  role: TimelineRole;
  focused: boolean;
  isDark: boolean;
  onFocus: () => void;
}) {
  return (
    <div
      onMouseEnter={onFocus}
      onClick={onFocus}
      style={{
        flexGrow: focused ? 6 : 1,
        flexBasis: 0,
        transition:
          "flex-grow 0.44s cubic-bezier(0.22,1,0.36,1), background-color 0.3s ease, border-color 0.3s ease",
      }}
      className={cn(
        "relative flex min-w-0 cursor-pointer overflow-hidden rounded-[16px] border",
        "max-[820px]:!grow-0 max-[820px]:!basis-auto",
        isDark ? "border-ink bg-ink" : "border-line bg-paper-card",
      )}
    >
      {/* Spine: shown only when collapsed on desktop; hidden on mobile */}
      <div
        className={cn(
          "h-full w-full flex-col items-center justify-between py-[22px]",
          focused ? "hidden" : "flex",
          "max-[820px]:hidden",
        )}
      >
        <span className="font-mono text-[11px] tracking-[0.06em] text-muted-3">{role.year}</span>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <span className="rotate-180 font-display text-[23px] font-extrabold tracking-[-0.01em] whitespace-nowrap text-ink [writing-mode:vertical-rl]">
            {role.shortName}
          </span>
        </div>
        <span className="font-display text-[17px] font-extrabold tracking-[-0.01em] text-brand">
          {role.hero}
        </span>
      </div>

      {/* Full: shown when focused on desktop; always shown (cards) on mobile */}
      <div
        className={cn(
          "om-sc h-full w-full flex-col overflow-y-auto px-7 py-[26px]",
          focused ? "flex" : "hidden",
          "max-[820px]:flex",
        )}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "font-mono text-[10.5px] tracking-[0.05em]",
              isDark ? "text-muted-on-dark" : "text-muted-3",
            )}
          >
            {role.period}
          </span>
          {role.current && (
            <span className="rounded-[4px] border border-brand-bright/50 px-[5px] py-px font-mono text-[9px] uppercase tracking-[0.12em] text-brand-bright">
              Now
            </span>
          )}
        </div>

        <div
          className={cn(
            "mt-2 font-display text-[27px] leading-[1.02] font-extrabold tracking-[-0.02em]",
            isDark ? "text-paper-on-dark" : "text-ink",
          )}
        >
          {role.company}
        </div>
        <div className={cn("mt-[5px] font-mono text-[11px]", isDark ? "text-[#9b9488]" : "text-muted-3")}>
          {role.role} · {role.location}
        </div>

        <div className="mt-5 mb-1 flex flex-wrap items-end gap-x-[18px] gap-y-2">
          <div>
            <div
              className={cn(
                "font-display text-[46px] leading-[0.9] font-extrabold tracking-[-0.03em]",
                isDark ? "text-brand-bright" : "text-brand",
              )}
            >
              {role.hero}
            </div>
            <div
              className={cn(
                "mt-[7px] font-mono text-[10px] uppercase tracking-[0.06em]",
                isDark ? "text-[#9b9488]" : "text-muted-3",
              )}
            >
              {role.heroLabel}
            </div>
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 pb-[3px] font-mono text-[11px]",
              isDark ? "text-muted-on-dark" : "text-muted-3",
            )}
          >
            <span className="text-brand-bright">+</span>
            {role.secondary}
          </div>
        </div>

        <div
          className={cn(
            "mt-4 flex flex-col gap-[9px] border-t pt-4",
            isDark ? "border-white/[0.14]" : "border-line",
          )}
        >
          {role.bullets.map((b) => (
            <div
              key={b}
              className={cn(
                "flex gap-2.5 text-[13.5px] leading-[1.45]",
                isDark ? "text-[#dad4c7]" : "text-ink-soft",
              )}
            >
              <ArrowRight size={15} className="mt-[3px] flex-none text-brand-bright" aria-hidden />
              <span>{b}</span>
            </div>
          ))}
        </div>

        <div className="mt-[18px] flex flex-wrap gap-1.5">
          {role.stack.map((t) => (
            <span
              key={t}
              className={cn(
                "rounded-[5px] border px-2 py-[3px] font-mono text-[10px]",
                isDark
                  ? "border-white/[0.12] bg-white/[0.06] text-[#c8c2b5]"
                  : "border-line-soft bg-[rgba(26,23,20,0.04)] text-muted-2",
              )}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CareerTimeline() {
  const [focused, setFocused] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // On mobile every card is open, so the dark highlight stays on PolyAI (index 0)
  // rather than following focus. On desktop the focused panel is the dark one.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-[50px] sm:px-7">
      <Reveal>
        <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">The path</p>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h2 className="font-display text-[clamp(28px,3.4vw,42px)] font-extrabold tracking-[-0.025em] text-ink">
            Five years, on the record.
          </h2>
          <span className="flex items-center gap-1.5 pb-1 font-mono text-[11px] tracking-[0.04em] text-muted-3">
            hover or tap a role to open it
            <ArrowDown size={13} aria-hidden />
          </span>
        </div>
        <p className="mt-2.5 mb-7 max-w-[600px] text-[16px] leading-[1.5] text-ink-soft-2">
          Most recent first. Open any role to see the full story: every shipped win, in its own space.
        </p>
      </Reveal>

      <div className="flex h-[452px] gap-3 max-[820px]:h-auto max-[820px]:flex-col">
        {timeline.map((role, i) => (
          <Panel
            key={role.company}
            role={role}
            focused={focused === i}
            isDark={isMobile ? i === 0 : focused === i}
            onFocus={() => setFocused(i)}
          />
        ))}
      </div>
    </section>
  );
}
