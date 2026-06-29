"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAssistant, THINK_PHRASES } from "@/hooks/use-assistant";
import { ArtifactView } from "./artifact-view";

const md: Components = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

function AgentTrace({ step }: { step: number }) {
  return (
    <div className="flex flex-col gap-2 py-0.5">
      {THINK_PHRASES.map((label, i) => {
        const state = i < step ? "done" : i === step ? "active" : "pending";
        return (
          <div key={label} className="flex items-center gap-2.5 font-mono text-[12px]">
            <span className="flex h-[15px] w-[15px] flex-none items-center justify-center">
              {state === "done" && <Check size={13} strokeWidth={3} className="text-live" />}
              {state === "active" && (
                <span className="h-[15px] w-[15px] animate-spin rounded-full border-[1.5px] border-[rgba(232,105,63,0.25)] border-t-brand-bright [animation-duration:0.7s]" />
              )}
              {state === "pending" && (
                <span className="h-[7px] w-[7px] rounded-full border border-faint-on-dark/50" />
              )}
            </span>
            <span
              className={
                state === "pending"
                  ? "text-faint-on-dark"
                  : state === "active"
                    ? "text-paper-on-dark"
                    : "text-muted-on-dark"
              }
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SourcePills({ sources }: { sources: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-faint-on-dark">
        Grounded in
      </span>
      {sources.map((s) => (
        <span
          key={s}
          className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(217,60,27,0.28)] bg-[rgba(217,60,27,0.1)] px-2 py-[3px] font-mono text-[10px] text-[#e7d2c8]"
        >
          <span className="h-1 w-1 rounded-full bg-brand" />
          {s}
        </span>
      ))}
    </div>
  );
}

export function AssistantCard() {
  const { messages, input, onInputChange, onInputFocus, submit, ask, status, busy, chips, thinkingStep } =
    useAssistant();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom as content streams, but don't fight a user who scrolled up.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const last = messages[messages.length - 1];
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom || last?.role === "user") el.scrollTop = el.scrollHeight;
  }, [messages, status, thinkingStep]);

  return (
    <div className="relative flex h-[500px] flex-col overflow-hidden rounded-[18px] border border-white/[0.07] bg-ink shadow-[0_36px_70px_-28px_rgba(26,23,20,0.55),0_4px_14px_-6px_rgba(26,23,20,0.3)]">
      {/* ambient vermillion aurora behind the header */}
      <div
        aria-hidden
        className="aurora-glow pointer-events-none absolute -top-10 right-[-10px] left-[-10px] z-0 h-[210px]"
        style={{
          background: "radial-gradient(190px 130px at 30% 0%, rgba(217,60,27,0.5), transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.015] px-[18px] py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="glow-pulse flex h-6 w-6 items-center justify-center rounded-[7px] bg-brand font-display text-[10px] font-bold tracking-[-0.02em] text-paper-on-dark">
              ST
            </div>
            <span className="text-[13.5px] font-semibold text-paper-on-dark">
              Shan&apos;s portfolio assistant
            </span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-faint-on-dark">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" />
            live
          </span>
        </div>

        {/* transcript */}
        <div ref={scrollRef} className="om-sc flex-1 overflow-y-auto px-5 pt-5 pb-2">
          {messages.map((m) => {
            if (m.role === "user") {
              return (
                <div key={m.id} className="mb-3 flex justify-end">
                  <div className="max-w-[80%] rounded-[13px_13px_4px_13px] bg-white/[0.08] px-[13px] py-[9px] text-[14px] leading-[1.45] text-ink-on-dark">
                    {m.content}
                  </div>
                </div>
              );
            }
            const isActive = !m.done;
            const showTrace = isActive && status === "thinking";
            return (
              <div key={m.id} className="mb-[18px] flex items-start gap-[11px]">
                <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-[7px] border border-brand/35 bg-brand/[0.16] font-display text-[10px] font-bold tracking-[-0.02em] text-brand-bright">
                  ST
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  {showTrace ? (
                    <AgentTrace step={thinkingStep} />
                  ) : (
                    <>
                      {m.content && (
                        <div
                          className="prose-chat"
                          data-streaming={isActive && status === "streaming" ? "true" : undefined}
                        >
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      )}
                      {m.artifacts?.map((a) => (
                        <ArtifactView key={a.id} artifact={a} />
                      ))}
                      {m.done && m.sources && m.sources.length > 0 && (
                        <SourcePills sources={m.sources} />
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* dynamic follow-up chips */}
        <div className="om-sc flex gap-[7px] overflow-x-auto px-4 pb-2.5">
          {chips.map((s) => (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => ask(s)}
              className="flex-none cursor-pointer whitespace-nowrap rounded-[8px] border border-white/[0.12] bg-white/[0.05] px-2.5 py-1.5 font-mono text-[11px] text-[#c8c2b5] transition-colors hover:bg-white/[0.12] disabled:cursor-default disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>

        {/* input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-stretch gap-2 border-t border-white/[0.08] bg-black/[0.12] px-3.5 py-3"
        >
          <label htmlFor="assistant-input" className="sr-only">
            Ask the assistant about Shan
          </label>
          <Input
            id="assistant-input"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onFocus={onInputFocus}
            disabled={busy}
            autoComplete="off"
            placeholder="Ask anything about Shan's work…"
            className="h-auto flex-1 rounded-[10px] border-white/[0.12] bg-white/[0.06] px-[14px] py-[11px] text-[14px] text-paper-on-dark placeholder:text-[rgba(246,242,233,0.42)] focus-visible:border-[rgba(217,60,27,0.65)] focus-visible:ring-[3px] focus-visible:ring-[rgba(217,60,27,0.22)] md:text-[14px]"
          />
          <Button
            type="submit"
            disabled={busy}
            aria-label="Ask"
            className="h-auto shrink-0 gap-1.5 rounded-[10px] border-transparent bg-brand px-[17px] text-[14px] font-semibold text-paper-on-dark hover:bg-brand-hover"
          >
            Ask
            <ArrowRight aria-hidden />
          </Button>
        </form>
      </div>
    </div>
  );
}
