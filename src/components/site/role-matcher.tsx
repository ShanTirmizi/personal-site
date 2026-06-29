"use client";

import { useState } from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { ROLE_ARCHETYPES } from "@/lib/knowledge-base";

// Inline composer that sits where the follow-up chips normally are. Recruiters
// either click a role archetype or paste a job description; both flow back out
// through the same callbacks into useAssistant's tailorToRole.
export function RoleMatcher({
  busy,
  onSubmit,
  onArchetype,
  onCancel,
}: {
  busy: boolean;
  onSubmit: (jd: string) => void;
  onArchetype: (brief: string, key: string) => void;
  onCancel: () => void;
}) {
  const [jd, setJd] = useState("");
  const canSubmit = jd.trim().length >= 20 && !busy;

  return (
    <div className="border-t border-white/[0.08] bg-black/[0.12] px-3.5 py-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint-on-dark">
          <Sparkles size={12} className="text-brand-bright" aria-hidden />
          Match Shan to your role
        </span>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close role matcher"
          className="flex h-6 w-6 items-center justify-center rounded-[6px] text-faint-on-dark transition-colors hover:bg-white/[0.08] hover:text-paper-on-dark"
        >
          <X size={14} aria-hidden />
        </button>
      </div>

      <div className="om-sc mb-2 flex gap-[7px] overflow-x-auto">
        {ROLE_ARCHETYPES.map((r) => (
          <button
            key={r.key}
            type="button"
            disabled={busy}
            onClick={() => onArchetype(r.brief, r.key)}
            className="flex-none cursor-pointer whitespace-nowrap rounded-[8px] border border-white/[0.12] bg-white/[0.05] px-2.5 py-1.5 font-mono text-[11px] text-[#c8c2b5] transition-colors hover:bg-white/[0.12] disabled:cursor-default disabled:opacity-40"
          >
            {r.label}
          </button>
        ))}
      </div>

      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        disabled={busy}
        rows={3}
        placeholder="…or paste a job description and I’ll tailor the pitch to it."
        className="om-sc w-full resize-none rounded-[10px] border border-white/[0.12] bg-white/[0.06] px-[14px] py-[10px] text-[13.5px] leading-[1.5] text-paper-on-dark outline-none placeholder:text-[rgba(246,242,233,0.42)] focus-visible:border-[rgba(217,60,27,0.65)] focus-visible:ring-[3px] focus-visible:ring-[rgba(217,60,27,0.22)]"
      />

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] text-faint-on-dark">
          Pasted text is treated as a role description only.
        </span>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => onSubmit(jd.trim())}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-[9px] bg-brand px-[15px] py-[9px] font-sans text-[13px] font-semibold text-paper-on-dark transition-colors hover:bg-brand-hover disabled:cursor-default disabled:opacity-40"
        >
          Match me to this role
          <ArrowRight size={14} aria-hidden />
        </button>
      </div>
    </div>
  );
}
