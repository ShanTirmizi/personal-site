import { anthropic } from "@ai-sdk/anthropic";
import { streamText, tool } from "ai";
import { z } from "zod";
import {
  SYSTEM_PROMPT,
  localAnswer,
  tailorSystemPrompt,
  localRoleAnswer,
} from "@/lib/knowledge-base";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

// Sonnet for the sharpest writing and most reliable instruction-following; the
// volume on a portfolio is tiny, so the extra cost is negligible.
const MODEL = "claude-sonnet-4-6";
const MAX_MESSAGES = 24;
const MAX_CHARS = 4000;
const MAX_JD_CHARS = 6000;

type ChatMessage = { role: "user" | "assistant"; content: string };

// Client-rendered "artifact" tools. No execute: the model just signals which
// card to render; the client draws it from canonical CV data, so it's always
// accurate. One generation can produce prose AND one of these.
const tools = {
  show_impact_metrics: tool({
    description:
      "Render an animated bar chart of Shan's measurable, shipped results (p95 latency, onboarding time, runtime errors, app performance, dev velocity, client engagement). Use when the recruiter asks about impact, results, the numbers, or what he has actually improved.",
    inputSchema: z.object({
      highlight: z
        .string()
        .optional()
        .describe("Optional exact metric label to emphasise, e.g. 'p95 latency'"),
    }),
  }),
  show_experience_timeline: tool({
    description:
      "Render a visual timeline of Shan's four roles (PolyAI, QuantSpark, GWI, InvestCloud) with dates and the headline win at each. Use when asked about his career, experience, work history, or where he has worked.",
    inputSchema: z.object({}),
  }),
  show_skills: tool({
    description:
      "Render a categorised breakdown of Shan's technical skills (AI/LLM, backend, frontend, mobile, data, quality). Use when asked about his tech stack, skills, or what technologies he works with.",
    inputSchema: z.object({}),
  }),
};

// Belt-and-braces house style: the system prompt forbids em dashes, but models
// occasionally slip one in. Normalise any that reach the stream to a comma.
// Only the em dash (U+2014) is touched, never the minus sign in metrics (−30%).
const sanitize = (s: string) => s.replace(/\s*—\s*/g, ", ");

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "anon";
}

function ndjson(stream: ReadableStream<Uint8Array>) {
  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

// Single-event NDJSON response (rate limit / no key / hard errors).
function onceText(text: string) {
  const enc = new TextEncoder();
  return ndjson(
    new ReadableStream({
      start(controller) {
        controller.enqueue(enc.encode(JSON.stringify({ t: "d", v: text }) + "\n"));
        controller.close();
      },
    }),
  );
}

export async function POST(req: Request) {
  let messages: ChatMessage[] = [];
  // Optional role-match context: a pasted JD (or an archetype's brief) plus an
  // optional archetype key used only to pick the right local fallback.
  let jobDescription = "";
  let roleKey: string | undefined;
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
    if (typeof body?.jobDescription === "string")
      jobDescription = body.jobDescription.slice(0, MAX_JD_CHARS).trim();
    if (typeof body?.roleKey === "string") roleKey = body.roleKey;
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  messages = messages
    .filter(
      (m): m is ChatMessage =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return new Response("No question", { status: 400 });

  const limit = rateLimit(clientIp(req));
  if (!limit.ok) {
    return onceText(
      "You’re asking a lot of great questions. Give me a few seconds and try again, or just email Shan directly at **tirmizishahnawaz@gmail.com**.",
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return onceText(
      jobDescription ? localRoleAnswer(roleKey) : localAnswer(lastUser.content),
    );
  }

  const enc = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(enc.encode(JSON.stringify(obj) + "\n"));
      let emittedText = false;
      let toolCount = 0;

      try {
        const result = streamText({
          model: anthropic(MODEL),
          system: jobDescription ? tailorSystemPrompt(jobDescription) : SYSTEM_PROMPT,
          messages,
          tools,
          maxOutputTokens: 700,
          temperature: 0.5,
          abortSignal: req.signal,
        });

        for await (const delta of result.textStream) {
          if (delta) {
            emittedText = true;
            send({ t: "d", v: sanitize(delta) });
          }
        }

        const calls = await result.toolCalls;
        for (const call of calls ?? []) {
          if (toolCount >= 1) break; // at most one artifact per reply
          toolCount += 1;
          send({ t: "a", name: call.toolName, args: call.input ?? {} });
        }
      } catch {
        // fall through to fallback
      }

      if (!emittedText && toolCount === 0) {
        send({
          t: "d",
          v: jobDescription ? localRoleAnswer(roleKey) : localAnswer(lastUser.content),
        });
      }
      controller.close();
    },
  });

  return ndjson(stream);
}
