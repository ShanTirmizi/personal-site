"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { INTRO_MESSAGE, localAnswer } from "@/lib/knowledge-base";

export type ChatRole = "user" | "assistant";
export type ChatMessage = { id: string; role: ChatRole; content: string; done: boolean };
export type Status = "idle" | "submitted" | "streaming";

let counter = 0;
const nextId = () => `m${++counter}`;

/**
 * Drives the portfolio assistant. Streams plain text from /api/chat and reveals
 * it with a smoothing typewriter (so bursty model chunks still read like steady
 * typing). Falls back to a grounded local answer if anything goes wrong, so the
 * chat is never broken.
 */
export function useAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: nextId(), role: "assistant", content: INTRO_MESSAGE, done: true },
  ]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const busy = status !== "idle";

  const fullRef = useRef("");
  const shownRef = useRef(0);
  const rafRef = useRef(0);
  const streamDoneRef = useRef(false);
  const activeId = useRef<string | null>(null);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const finalize = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    const id = activeId.current;
    const text = fullRef.current;
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, content: text, done: true } : m)));
    setStatus("idle");
    activeId.current = null;
  }, []);

  const runTyper = useCallback(() => {
    if (rafRef.current) return;
    const tick = () => {
      const full = fullRef.current;
      const id = activeId.current;
      if (shownRef.current < full.length) {
        // catch up faster when far behind; gentle when close → smooth reveal
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

      // history for the model — must start with a user turn (Anthropic requirement)
      const firstUser = messages.findIndex((m) => m.role === "user");
      const prior =
        firstUser === -1
          ? []
          : messages
              .slice(firstUser)
              .filter((m) => m.content.trim().length > 0)
              .map((m) => ({ role: m.role, content: m.content }));

      const userMsg: ChatMessage = { id: nextId(), role: "user", content: q, done: true };
      const assistantMsg: ChatMessage = { id: nextId(), role: "assistant", content: "", done: false };
      activeId.current = assistantMsg.id;
      fullRef.current = "";
      shownRef.current = 0;
      streamDoneRef.current = false;

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
        let first = true;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;
          fullRef.current += chunk;
          if (first) {
            first = false;
            setStatus("streaming");
            runTyper();
          }
        }
        fullRef.current += decoder.decode();
        if (first) {
          // streamed nothing — fall back gracefully
          fullRef.current = localAnswer(q);
          setStatus("streaming");
          runTyper();
        }
        streamDoneRef.current = true;
      } catch {
        if (!fullRef.current) fullRef.current = localAnswer(q);
        streamDoneRef.current = true;
        setStatus("streaming");
        runTyper();
      }
    },
    [busy, messages, runTyper],
  );

  const submit = useCallback(() => void send(input), [send, input]);
  const ask = useCallback((q: string) => void send(q), [send]);

  return { messages, input, setInput, submit, ask, status, busy };
}
