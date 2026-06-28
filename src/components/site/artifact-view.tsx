"use client";

import { motion, useReducedMotion } from "motion/react";
import { impactMetrics, experience, skills } from "@/lib/cv-data";
import type { Artifact } from "@/hooks/use-assistant";

const EASE = [0.2, 0.7, 0.2, 1] as const;
const MAX = Math.max(...impactMetrics.map((m) => m.value));

function ArtifactCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="mt-3 rounded-[14px] border border-white/[0.1] bg-white/[0.03] p-3.5"
    >
      <div className="mb-3 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-faint-on-dark">
        <span className="h-1 w-1 rounded-full bg-brand" />
        {label}
      </div>
      {children}
    </motion.div>
  );
}

function MetricsChart({ highlight }: { highlight?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-2.5">
      {impactMetrics.map((m, i) => {
        const pct = Math.round((m.value / MAX) * 100);
        const isHi = highlight && m.label.toLowerCase() === highlight.toLowerCase();
        return (
          <div key={m.label}>
            <div className="flex items-baseline justify-between text-[12px]">
              <span className="text-paper-on-dark">
                {m.label} <span className="text-faint-on-dark">· {m.company}</span>
              </span>
              <span className="font-mono font-semibold tabular-nums text-brand-bright">
                {m.prefix}
                {m.value}
                {m.suffix}
              </span>
            </div>
            <div className="mt-1 h-[6px] w-full overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                className={isHi ? "h-full rounded-full bg-brand-bright" : "h-full rounded-full bg-brand"}
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, delay: reduce ? 0 : 0.1 + i * 0.07, ease: EASE }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ExperienceTimeline() {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex flex-col gap-3.5 pl-4">
      <div className="absolute top-1.5 bottom-1.5 left-[3px] w-px bg-white/[0.12]" />
      {experience.map((r, i) => (
        <motion.div
          key={r.company}
          className="relative"
          initial={reduce ? false : { opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.1, ease: EASE }}
        >
          <span className="absolute top-[5px] -left-4 h-2 w-2 rounded-full bg-brand ring-2 ring-ink" />
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[13px] font-semibold text-paper-on-dark">{r.company}</span>
            <span className="shrink-0 font-mono text-[10px] text-faint-on-dark">{r.period}</span>
          </div>
          <div className="text-[11px] text-muted-on-dark">
            {r.role} · {r.note}
          </div>
          <div className="mt-0.5 text-[12px] leading-[1.45] text-ink-on-dark">{r.win}</div>
        </motion.div>
      ))}
    </div>
  );
}

function SkillsBreakdown() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-2.5">
      {skills.map((g, gi) => (
        <motion.div
          key={g.group}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: reduce ? 0 : gi * 0.06, ease: EASE }}
        >
          <div className="font-mono text-[10px] tracking-[0.1em] text-brand-bright">
            {g.group.toUpperCase()}
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {g.items.map((it) => (
              <span
                key={it}
                className="rounded-[6px] border border-white/[0.1] bg-white/[0.05] px-2 py-0.5 text-[11px] text-paper-on-dark"
              >
                {it}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function ArtifactView({ artifact }: { artifact: Artifact }) {
  switch (artifact.kind) {
    case "metrics":
      return (
        <ArtifactCard label="Measurable impact">
          <MetricsChart highlight={artifact.highlight} />
        </ArtifactCard>
      );
    case "timeline":
      return (
        <ArtifactCard label="Career timeline">
          <ExperienceTimeline />
        </ArtifactCard>
      );
    case "skills":
      return (
        <ArtifactCard label="Tech stack">
          <SkillsBreakdown />
        </ArtifactCard>
      );
    default:
      return null;
  }
}
