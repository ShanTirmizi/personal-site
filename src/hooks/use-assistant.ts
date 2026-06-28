"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { INTRO_MESSAGE, localAnswer } from "@/lib/knowledge-base";

export type ChatRole = "user" | "assistant";
export type ArtifactKind = "metrics" | "timeline" | "skills";
export type Artifact = { id: string; kind: ArtifactKind; highlight?: string };
export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  done: boolean;
  artifacts?: Artifact[];
};
export type Status = "idle" | "submitted" | "streaming";

const TOOL_KIND: Record<string, ArtifactKind> = {
  show_impact_metrics: "metrics",
  show_experience_timeline: "timeline",
  show_skills: "skills",
};

// Guaranteed lead line if a model ever returns a chart with no prose.
const ARTIFACT_LEAD: Record<ArtifactKind, string> = {
  metrics: "Here’s his impact, by the numbers.",
  timeline: "Here’s the shape of his career so far.",
  skills: "Here’s his stack, grouped by area.",
};

// Unique ids: static for the seeded message (SSR/hydration-stable), random at
// runtime (generated only in client event handlers, so no hydration mismatch).
const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2)}`;

/**
 * Drives the portfolio assistant. Reads an NDJSON stream from /api/chat: text
 * deltas reveal with a smoothing typewriter + caret; artifact (chart) events are
 * held and shown once the text finishes, for a clean reveal. Falls back to a
 * grounded local answer if anything fails, so the chat is never broken.
 */
export function useAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "intro", role: "assistant", content: INTRO_MESSAGE, done: true },
  ]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const busy = status !== "idle";

  const fullRef = useRef("");
  const shownRef = useRef(0);
  const rafRef = useRef(0);
  const streamDoneRef = useRef(false);
  const activeId = useRef<string | null>(null);
  const pendingArtifacts = useRef<Artifact[]>([]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const finalize = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    const id = activeId.current;
    const text = fullRef.current;
    const arts = pendingArtifacts.current;
    setMessages((ms) =>
      ms.map((m) =>
        m.id === id
          ? { ...m, content: text, done: true, artifacts: arts.length ? arts : undefined }
          : m,
      ),
    );
    setStatus("idle");
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

  const send = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || busy) return;

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
      fullRef.current = "";
      shownRef.current = 0;
      streamDoneRef.current = false;
      pendingArtifacts.current = [];

      setMessages((ms) => [...ms, userMsg, assistantMsg]);
      setInput("");
      setStatus("submitted");

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
        let first = true;

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
            if (first) {
              first = false;
              setStatus("streaming");
              runTyper();
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

        streamDoneRef.current = true;
        if (first) {
          // no text streamed: use a lead line if there's a chart, else fall back
          if (pendingArtifacts.current.length > 0) {
            fullRef.current = ARTIFACT_LEAD[pendingArtifacts.current[0].kind];
          } else {
            fullRef.current = localAnswer(q);
          }
          setStatus("streaming");
          runTyper();
        }
      } catch {
        if (!fullRef.current && pendingArtifacts.current.length === 0) {
          fullRef.current = localAnswer(q);
        }
        streamDoneRef.current = true;
        setStatus("streaming");
        runTyper();
      }
    },
    [busy, messages, runTyper],
  );

  const submit = useCallback(() => void send(input), [send, input]);
  const ask = useCallback((qn: string) => void send(qn), [send]);

  return { messages, input, setInput, submit, ask, status, busy };
}
