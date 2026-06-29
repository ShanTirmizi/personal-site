"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  INTRO_MESSAGE,
  INITIAL_CHIPS,
  DEMO_QUESTION,
  localAnswer,
  followupsFor,
  sourcesFor,
} from "@/lib/knowledge-base";

export type ChatRole = "user" | "assistant";
export type ArtifactKind = "metrics" | "timeline" | "skills";
export type Artifact = { id: string; kind: ArtifactKind; highlight?: string };
export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  done: boolean;
  artifacts?: Artifact[];
  sources?: string[];
};
export type Status = "idle" | "thinking" | "streaming";

export const THINK_PHRASES = [
  "Searching 5 years of shipped work",
  "Pulling the relevant projects",
  "Checking the impact metrics",
  "Composing a grounded answer",
];

const TOOL_KIND: Record<string, ArtifactKind> = {
  show_impact_metrics: "metrics",
  show_experience_timeline: "timeline",
  show_skills: "skills",
};

const ARTIFACT_LEAD: Record<ArtifactKind, string> = {
  metrics: "Here’s his impact, by the numbers.",
  timeline: "Here’s the shape of his career so far.",
  skills: "Here’s his stack, grouped by area.",
};

const MIN_THINK_MS = 1550;
const TRACE_STEP_MS = 430;
const DEMO_DELAY_MS = 1700;
const DEMO_CHAR_MS = 45;

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2)}`;

export function useAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "intro", role: "assistant", content: INTRO_MESSAGE, done: true },
  ]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [chips, setChips] = useState<string[]>([...INITIAL_CHIPS]);
  const [thinkingStep, setThinkingStep] = useState(0);
  const busy = status !== "idle";

  // streaming / reveal
  const fullRef = useRef("");
  const shownRef = useRef(0);
  const rafRef = useRef(0);
  const streamDoneRef = useRef(false);
  const activeId = useRef<string | null>(null);
  const activeQ = useRef("");
  const pendingArtifacts = useRef<Artifact[]>([]);
  const busyRef = useRef(false);

  // trace + reveal gating
  const thinkTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const minWindowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minWindowDone = useRef(false);
  const gotFirstToken = useRef(false);
  const revealStarted = useRef(false);

  // self-demo
  const userTook = useRef(false);
  const demoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finalize = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    const id = activeId.current;
    const text = fullRef.current;
    const arts = pendingArtifacts.current;
    const sources = sourcesFor(activeQ.current);
    setMessages((ms) =>
      ms.map((m) =>
        m.id === id
          ? { ...m, content: text, done: true, artifacts: arts.length ? arts : undefined, sources }
          : m,
      ),
    );
    setChips(followupsFor(activeQ.current));
    setStatus("idle");
    busyRef.current = false;
    activeId.current = null;
  }, []);

  const runTyper = useCallback(() => {
    if (rafRef.current) return;
    const tick = () => {
      const full = fullRef.current;
      const id = activeId.current;
      if (shownRef.current < full.length) {
        const remaining = full.length - shownRef.current;
        const step = Math.max(2, Math.floor(remaining / 6));
        shownRef.current = Math.min(full.length, shownRef.current + step);
        const slice = full.slice(0, shownRef.current);
        setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, content: slice } : m)));
      }
      if (!streamDoneRef.current || shownRef.current < fullRef.current.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        finalize();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [finalize]);

  // Reveal only once BOTH the minimum trace window has passed AND we have content.
  const maybeReveal = useCallback(() => {
    if (revealStarted.current) return;
    if (!minWindowDone.current || !gotFirstToken.current) return;
    revealStarted.current = true;
    if (thinkTimer.current) clearInterval(thinkTimer.current);
    setStatus("streaming");
    runTyper();
  }, [runTyper]);

  const markUser = useCallback(() => {
    userTook.current = true;
    if (demoTimer.current) clearTimeout(demoTimer.current);
  }, []);

  const send = useCallback(
    async (question: string, opts?: { demo?: boolean }) => {
      const q = question.trim();
      if (!q || busyRef.current) return;
      const demo = opts?.demo ?? false;

      const firstUser = messages.findIndex((m) => m.role === "user");
      const prior =
        firstUser === -1
          ? []
          : messages
              .slice(firstUser)
              .filter((m) => m.content.trim().length > 0)
              .map((m) => ({ role: m.role, content: m.content }));

      const userMsg: ChatMessage = { id: uid(), role: "user", content: q, done: true };
      const assistantMsg: ChatMessage = { id: uid(), role: "assistant", content: "", done: false };
      activeId.current = assistantMsg.id;
      activeQ.current = q;
      fullRef.current = "";
      shownRef.current = 0;
      streamDoneRef.current = false;
      pendingArtifacts.current = [];
      minWindowDone.current = false;
      gotFirstToken.current = false;
      revealStarted.current = false;
      busyRef.current = true;

      setMessages((ms) => [...ms, userMsg, assistantMsg]);
      setInput("");
      setStatus("thinking");
      setThinkingStep(0);

      // agent trace: tick the 4 steps, holding on the last one
      if (thinkTimer.current) clearInterval(thinkTimer.current);
      let step = 0;
      thinkTimer.current = setInterval(() => {
        step = Math.min(step + 1, THINK_PHRASES.length - 1);
        setThinkingStep(step);
      }, TRACE_STEP_MS);

      // minimum thinking window so the trace always reads
      if (minWindowTimer.current) clearTimeout(minWindowTimer.current);
      minWindowTimer.current = setTimeout(() => {
        minWindowDone.current = true;
        maybeReveal();
      }, MIN_THINK_MS);

      // The self-demo uses the local fallback (don't burn an API call on load).
      if (demo) {
        fullRef.current = localAnswer(q);
        gotFirstToken.current = true;
        streamDoneRef.current = true;
        maybeReveal();
        return;
      }

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...prior, { role: "user", content: q }] }),
        });
        if (!res.ok || !res.body) throw new Error("bad response");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const handleLine = (line: string) => {
          const trimmed = line.trim();
          if (!trimmed) return;
          let evt: { t?: string; v?: string; name?: string; args?: { highlight?: string } };
          try {
            evt = JSON.parse(trimmed);
          } catch {
            return;
          }
          if (evt.t === "d" && typeof evt.v === "string") {
            fullRef.current += evt.v;
            if (!gotFirstToken.current) {
              gotFirstToken.current = true;
              maybeReveal();
            }
          } else if (evt.t === "a" && evt.name) {
            const kind = TOOL_KIND[evt.name];
            if (kind) pendingArtifacts.current.push({ id: uid(), kind, highlight: evt.args?.highlight });
          }
        };

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buffer.indexOf("\n")) >= 0) {
            handleLine(buffer.slice(0, nl));
            buffer = buffer.slice(nl + 1);
          }
        }
        buffer += decoder.decode();
        if (buffer.trim()) handleLine(buffer);

        if (!fullRef.current) {
          fullRef.current = pendingArtifacts.current.length
            ? ARTIFACT_LEAD[pendingArtifacts.current[0].kind]
            : localAnswer(q);
        }
        streamDoneRef.current = true;
        gotFirstToken.current = true;
        maybeReveal();
      } catch {
        if (!fullRef.current && pendingArtifacts.current.length === 0) {
          fullRef.current = localAnswer(q);
        }
        streamDoneRef.current = true;
        gotFirstToken.current = true;
        maybeReveal();
      }
    },
    [messages, maybeReveal],
  );

  // keep a ref to the latest send so the mount-only demo effect never goes stale
  const sendRef = useRef(send);
  useEffect(() => {
    sendRef.current = send;
  }, [send]);

  // self-running demo, ONCE on mount; cancels the moment the user interacts.
  // Deps are [] on purpose: if this re-ran when `send` changed (i.e. on every
  // message update) its cleanup would kill the in-flight trace/reveal timers.
  useEffect(() => {
    const typeInto = (q: string, i: number) => {
      if (userTook.current) return;
      if (i > q.length) {
        setInput("");
        void sendRef.current(q, { demo: true });
        return;
      }
      setInput(q.slice(0, i));
      demoTimer.current = setTimeout(() => typeInto(q, i + 1), DEMO_CHAR_MS);
    };
    demoTimer.current = setTimeout(() => {
      if (!userTook.current) typeInto(DEMO_QUESTION, 0);
    }, DEMO_DELAY_MS);
    return () => {
      if (demoTimer.current) clearTimeout(demoTimer.current);
      if (thinkTimer.current) clearInterval(thinkTimer.current);
      if (minWindowTimer.current) clearTimeout(minWindowTimer.current);
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInputChange = useCallback(
    (value: string) => {
      markUser();
      setInput(value);
    },
    [markUser],
  );
  const submit = useCallback(() => {
    markUser();
    void send(input);
  }, [markUser, send, input]);
  const ask = useCallback(
    (q: string) => {
      markUser();
      void send(q);
    },
    [markUser, send],
  );

  return {
    messages,
    input,
    onInputChange,
    onInputFocus: markUser,
    submit,
    ask,
    status,
    busy,
    chips,
    thinkingStep,
  };
}
