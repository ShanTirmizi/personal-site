import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { SYSTEM_PROMPT, localAnswer } from "@/lib/knowledge-base";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

// Fast, cheap, sharp — and the quick first token is part of the "wow".
const MODEL = "claude-haiku-4-5-20251001";

const MAX_MESSAGES = 24;
const MAX_CHARS = 4000;

type ChatMessage = { role: "user" | "assistant"; content: string };

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "anon";
}

function textResponse(stream: ReadableStream<Uint8Array>) {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

function once(text: string) {
  const encoder = new TextEncoder();
  return textResponse(
    new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text));
        controller.close();
      },
    }),
  );
}

export async function POST(req: Request) {
  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  // sanitise + bound
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

  // light per-IP rate limit
  const limit = rateLimit(clientIp(req));
  if (!limit.ok) {
    return once(
      "You're asking a lot of great questions — give me a few seconds and try again, or just email Shan directly at **tirmizishahnawaz@gmail.com**.",
    );
  }

  // No key? Still answer (grounded fallback) so the chat is never broken.
  if (!process.env.ANTHROPIC_API_KEY) {
    return once(localAnswer(lastUser.content));
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let emitted = false;
      try {
        const result = streamText({
          model: anthropic(MODEL),
          system: SYSTEM_PROMPT,
          messages,
          maxOutputTokens: 600,
          temperature: 0.4,
          abortSignal: req.signal,
        });
        for await (const chunk of result.textStream) {
          if (chunk) {
            emitted = true;
            controller.enqueue(encoder.encode(chunk));
          }
        }
      } catch {
        // swallow — fall through to grounded fallback below
      }
      // If the model produced nothing (bad key, outage, refusal), serve the
      // grounded keyword answer so the visitor always gets a real reply.
      if (!emitted) controller.enqueue(encoder.encode(localAnswer(lastUser.content)));
      controller.close();
    },
  });

  return textResponse(stream);
}
