"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAssistant } from "@/hooks/use-assistant";
import { ArtifactView } from "./artifact-view";
import { SUGGESTIONS } from "@/lib/knowledge-base";

const md: Components = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

function Thinking() {
  return (
    <div className="flex items-center gap-[11px] font-mono text-[12px] text-faint-on-dark">
      <span className="flex gap-1">
        {[0, 0.18, 0.36].map((d) => (
          <span
            key={d}
            className="pulse-dot h-[5px] w-[5px] rounded-full bg-faint-on-dark"
            style={{ animationDuration: "1s", animationDelay: `${d}s` }}
          />
        ))}
      </span>
      thinking
    </div>
  );
}

export function AssistantCard() {
  const { messages, input, setInput, submit, ask, status, busy } = useAssistant();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom as content streams, but don't fight a user who scrolled up.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const last = messages[messages.length - 1];
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom || last?.role === "user") el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className="flex h-[500px] flex-col overflow-hidden rounded-[18px] border border-white/[0.07] bg-ink shadow-[0_36px_70px_-28px_rgba(26,23,20,0.55),0_4px_14px_-6px_rgba(26,23,20,0.3)]">
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.015] px-[18px] py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-brand text-[13px] text-paper-on-dark">
            <span aria-hidden>✦</span>
          </div>
          <span className="text-[13.5px] font-semibold text-paper-on-dark">
            Shan&apos;s portfolio assistant
          </span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-faint-on-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-live" />
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
          const isThinking = isActive && status === "submitted";
          return (
            <div key={m.id} className="mb-[18px] flex items-start gap-[11px]">
              <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-[7px] border border-brand/35 bg-brand/[0.16] text-[12px] text-brand-bright">
                <span aria-hidden>✦</span>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                {isThinking ? (
                  <Thinking />
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
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* suggestion chips */}
      <div className="om-sc flex gap-[7px] overflow-x-auto px-4 pb-2.5">
        {SUGGESTIONS.map((s) => (
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
          onChange={(e) => setInput(e.target.value)}
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
          Ask{" "}
          <span className="text-[15px] leading-none" aria-hidden>
            →
          </span>
        </Button>
      </form>
    </div>
  );
}
