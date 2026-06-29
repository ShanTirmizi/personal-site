"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { INTRO_QUESTION, INTRO_ANSWER, INTRO_TRACE_STEPS } from "@/lib/knowledge-base";

// Once-per-session guard. MUST match the literal key in the pre-paint script in
// layout.tsx (which decides whether to arm the intro before first paint).
export const INTRO_STORAGE_KEY = "intro_seen_c1";

// ── Timing knobs (ms) ───────────────────────────────────────────────────────
// Tune the whole feel here. The typewriter "speed" is governed by the type
// durations divided by the copy length (so the beats stay aligned if the copy
// changes). Sequence: card in → question types → 3-step trace → answer streams
// → DWELL (hold so it's readable) → lift away. Paced unhurried so a visitor
// comfortably reads the whole answer; the Skip control is there for the impatient.
export const INTRO_TIMING = {
  cardInMs: 240, // card fades/rises in
  questionStartMs: 340, // question begins typing
  questionTypeMs: 720, //           …types out → ends ~1.06s
  traceStartMs: 1180, // agent trace appears
  traceStepMs: 300, //           each step ticks → ends ~2.08s
  answerStartMs: 2120, // trace is replaced by the streaming answer
  answerStreamMs: 1800, //           …streams at a readable pace → ends ~3.92s
  dwellMs: 2100, // HOLD the finished answer (~2.1s) so it reads
  liftMs: 720, // overlay sweeps up and away (0→−106%)
} as const;

// Progress bar fills across the answer-build so it reads "100% → about to open".
const BAR_MS = INTRO_TIMING.answerStartMs + INTRO_TIMING.answerStreamMs;

function IntroTrace({ step }: { step: number }) {
  // Identical look to the live assistant's AgentTrace, with the intro's 3 steps.
  return (
    <div className="flex flex-col gap-2 py-0.5">
      {INTRO_TRACE_STEPS.map((label, i) => {
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

export function IntroOpener() {
  const [dismissed, setDismissed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [lifting, setLifting] = useState(false);
  const [qLen, setQLen] = useState(0);
  const [showTrace, setShowTrace] = useState(false);
  const [traceStep, setTraceStep] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [aLen, setALen] = useState(0);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervals = useRef<ReturnType<typeof setInterval>[]>([]);
  const finishing = useRef(false);

  // Reveal: lift the overlay, then unmount once it's gone. Idempotent so Skip +
  // a key press + the natural end can't fight each other. Used by Skip too.
  const finishRef = useRef<() => void>(() => {});
  finishRef.current = () => {
    if (finishing.current) return;
    finishing.current = true;
    timers.current.forEach(clearTimeout);
    intervals.current.forEach(clearInterval);
    timers.current = [];
    intervals.current = [];
    setLifting(true);
    const t = setTimeout(() => setDismissed(true), INTRO_TIMING.liftMs);
    timers.current.push(t);
  };
  const skip = useCallback(() => finishRef.current(), []);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    // The pre-paint script only arms when unseen this session. Re-check
    // reduced-motion here too (belt and braces) — if not armed, never play:
    // the overlay is display:none via CSS, the homepage is already there.
    const armed =
      document.documentElement.classList.contains("intro-armed") && !reduce;
    if (!armed) {
      setDismissed(true);
      return;
    }

    // Mark seen now so a refresh mid-intro reveals the site instead of replaying.
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      /* private mode — fine, it just plays again next load */
    }

    const T = INTRO_TIMING;
    setPlaying(true); // → card-in + progress bar (CSS); also arms the lock effect below

    // 1) Question types in (right-aligned user bubble)
    const qChars = INTRO_QUESTION.length;
    const qStep = Math.max(16, Math.round(T.questionTypeMs / qChars));
    timers.current.push(
      setTimeout(() => {
        let i = 0;
        const iv = setInterval(() => {
          i += 1;
          setQLen(i);
          if (i >= qChars) clearInterval(iv);
        }, qStep);
        intervals.current.push(iv);
      }, T.questionStartMs),
    );

    // 2) Agent trace ticks step-by-step
    timers.current.push(
      setTimeout(() => {
        setShowTrace(true);
        setTraceStep(0);
        let s = 0;
        const iv = setInterval(() => {
          s += 1;
          setTraceStep(s);
          if (s >= INTRO_TRACE_STEPS.length) clearInterval(iv);
        }, T.traceStepMs);
        intervals.current.push(iv);
      }, T.traceStartMs),
    );

    // 3) Trace is replaced by the streaming answer
    timers.current.push(
      setTimeout(() => {
        setShowTrace(false);
        setShowAnswer(true);
        const aChars = INTRO_ANSWER.length;
        const aStep = Math.max(8, Math.round(T.answerStreamMs / aChars));
        let i = 0;
        const iv = setInterval(() => {
          i += 1;
          setALen(i);
          if (i >= aChars) clearInterval(iv);
        }, aStep);
        intervals.current.push(iv);
      }, T.answerStartMs),
    );

    // 4) Dwell, then lift + unmount (via finish)
    timers.current.push(
      setTimeout(
        () => finishRef.current(),
        T.answerStartMs + T.answerStreamMs + T.dwellMs,
      ),
    );

    const localTimers = timers.current;
    const localIntervals = intervals.current;
    return () => {
      localTimers.forEach(clearTimeout);
      localIntervals.forEach(clearInterval);
    };
  }, []);

  // Scroll-lock + keyboard skip (Esc/Enter/Space) live exactly as long as the
  // overlay is on screen. Keyed on [playing, dismissed] so they tear down the
  // instant the intro is dismissed: this component sits permanently in the
  // layout and "dismisses" by rendering null, so it never truly unmounts —
  // relying on unmount cleanup would leave the page stuck at overflow:hidden.
  useEffect(() => {
    if (!playing || dismissed) return;
    // Reserve the scrollbar's width as padding before hiding it, so the page
    // keeps the same content width while locked. Without this, always-on
    // scrollbars reflow the page ~15px when the bar vanishes here and returns
    // on reveal, jittering the homepage as the overlay lifts. Overlay
    // scrollbars (macOS default) measure 0, so it's a no-op there.
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        finishRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      window.removeEventListener("keydown", onKey);
    };
  }, [playing, dismissed]);

  if (dismissed) return null;

  const questionTyping = playing && !showTrace && !showAnswer;
  const answerStreaming = showAnswer && aLen < INTRO_ANSWER.length;

  return (
    <div
      className={cn("intro-overlay", playing && "is-playing", lifting && "is-lifting")}
      style={
        {
          "--intro-cardin": `${INTRO_TIMING.cardInMs}ms`,
          "--intro-bar-ms": `${BAR_MS}ms`,
          "--intro-lift-ms": `${INTRO_TIMING.liftMs}ms`,
        } as React.CSSProperties
      }
      role="dialog"
      aria-modal="true"
      aria-label="Shan's portfolio assistant — intro"
    >
      {/* Skip — always available */}
      <button
        type="button"
        onClick={skip}
        className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-[8px] border border-white/[0.14] bg-white/[0.05] px-2.5 py-1.5 font-mono text-[11px] text-faint-on-dark transition-colors hover:bg-white/[0.12] hover:text-paper-on-dark"
      >
        Skip
        <span className="rounded-[5px] border border-white/[0.18] px-1.5 py-px text-[10px] leading-none">
          ↵
        </span>
      </button>

      {/* Chat card — same visual language as the live AssistantCard */}
      <div className="intro-card relative w-[min(560px,92vw)] overflow-hidden rounded-[16px] border border-white/10 bg-ink shadow-[0_36px_70px_-28px_rgba(0,0,0,0.6),0_4px_14px_-6px_rgba(0,0,0,0.4)]">
        {/* ambient vermillion aurora behind the header (matches the live card) */}
        <div
          aria-hidden
          className="aurora-glow pointer-events-none absolute -top-10 right-[-10px] left-[-10px] z-0 h-[210px]"
          style={{
            background:
              "radial-gradient(190px 130px at 30% 0%, rgba(217,60,27,0.5), transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* progress bar */}
        <div className="relative z-10 h-[3px] w-full bg-white/[0.06]">
          <div className="intro-bar-fill h-full w-full bg-[linear-gradient(90deg,#d93c1b,#e8693f)]" />
        </div>

        <div className="relative z-10">
          {/* header — identical to the live assistant */}
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

          {/* body */}
          <div className="min-h-[188px] px-5 pt-5 pb-5">
            {/* question (right-aligned user bubble) */}
            <div className="mb-3 flex justify-end">
              <div className="max-w-[80%] rounded-[13px_13px_4px_13px] bg-white/[0.08] px-[13px] py-[9px] text-[14px] leading-[1.45] text-ink-on-dark">
                {INTRO_QUESTION.slice(0, qLen)}
                {questionTyping && (
                  <span
                    aria-hidden
                    className="ml-px border-l-2 border-brand-bright"
                    style={{ animation: "blink 1s steps(1) infinite" }}
                  >
                    &nbsp;
                  </span>
                )}
              </div>
            </div>

            {/* assistant turn — trace, then streaming answer */}
            {(showTrace || showAnswer) && (
              <div className="flex items-start gap-[11px]">
                <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-[7px] border border-brand/35 bg-brand/[0.16] font-display text-[10px] font-bold tracking-[-0.02em] text-brand-bright">
                  ST
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  {showTrace ? (
                    <IntroTrace step={traceStep} />
                  ) : (
                    <div className="prose-chat" data-streaming={answerStreaming ? "true" : undefined}>
                      <p>{INTRO_ANSWER.slice(0, aLen)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
