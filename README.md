# Shan Tirmizi — Personal Site (“The Pitch”)

A portfolio that leads with a **live, streaming Claude assistant** a recruiter can actually talk to — proving the exact skill it’s selling — then makes a tight, evidence-backed case for the hire.

> **Don’t read my CV — talk to it.**

**Live:** _deployed on Vercel_ · **Built by** [Shan Tirmizi](https://github.com/ShanTirmizi) — AI & full-stack engineer, London.

---

## What makes it interesting

- **A working AI assistant, not a gimmick.** The hero is a real chat that streams answers from the Anthropic Claude API, grounded in a hand-written knowledge base about Shan’s work. It renders Markdown live with a typewriter reveal and a blinking caret.
- **It can never look broken.** If the API key is missing, the model errors, or the network drops, the same endpoint (and the client) fall back to a grounded keyword-matched answer. The chat always replies with something accurate.
- **Editorial, high-craft UI.** Warm-paper / ink / vermillion palette, Bricolage Grotesque + Hanken Grotesk + IBM Plex Mono, a fractal-noise grain overlay, count-up metrics, scroll-reveals and hover micro-interactions — all responsive down to 375px.

## Tech stack

| Area | Choice |
|---|---|
| Framework | **Next.js 15** (App Router, RSC) + **TypeScript** |
| Styling | **Tailwind CSS v4** + **shadcn/ui** (Base UI) |
| AI | **Vercel AI SDK** (`ai`) + **`@ai-sdk/anthropic`**, streaming **Claude Haiku 4.5** |
| Markdown | `react-markdown` + `remark-gfm` |
| Motion | `motion` (Framer Motion) |
| Hosting | **Vercel** |

## How the assistant works

```
Browser (useAssistant hook)
   │  POST /api/chat  { messages: [{ role, content }] }
   ▼
Route Handler  (src/app/api/chat/route.ts)
   │  • per-IP rate limit (src/lib/rate-limit.ts)
   │  • system prompt + grounded facts (src/lib/knowledge-base.ts)
   │  • streamText → Anthropic, streamed back as plain text
   │  • if the model yields nothing → grounded localAnswer() fallback
   ▼
Browser streams the text in with a smoothing typewriter + caret,
rendering Markdown (bold metrics, tight lists) as it arrives.
```

The `ANTHROPIC_API_KEY` lives **only** on the server. The system prompt forbids inventing facts and is tuned for sharp, scannable, recruiter-facing answers.

## Project structure

```
src/
  app/
    layout.tsx            fonts, metadata, grain overlay
    page.tsx              section assembly
    globals.css           design tokens + animations + chat prose styles
    api/chat/route.ts     streaming Anthropic endpoint + fallback
  components/
    site/                 header, hero, assistant-card, featured apps, etc.
    motion/reveal.tsx     scroll-reveal wrapper
    ui/                   shadcn primitives
  hooks/
    use-assistant.ts      streaming chat state machine
    use-count-up.ts       in-view count-up
  lib/
    site-data.ts          all page copy (single source of truth)
    knowledge-base.ts     facts, system prompt, fallback answers
    rate-limit.ts         in-memory per-IP limiter
public/
  Shan-Tirmizi-CV.pdf     wired to every “Download CV” button
  apps/                   app screenshots
```

## Local development

Requires **Node 22**.

```bash
npm install                      # uses .npmrc (legacy-peer-deps for React 19)
cp .env.example .env.local       # then add your ANTHROPIC_API_KEY
npm run dev                      # http://localhost:3000
```

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Server-side key for the streaming assistant |
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical URL for metadata / OpenGraph |

## Adding a headshot

The profile avatar shows an “ST” monogram by default. To use a real photo, drop a square image at `public/headshot.jpg` and pass `src="/headshot.jpg"` to `<Avatar />` in `src/components/site/profile-header.tsx`.

## Deploy

Deployed on Vercel. Set `ANTHROPIC_API_KEY` in the project’s Environment Variables, then `vercel --prod` (or push to the connected branch).

---

_Built as a live, Claude-powered demo — the kind of thing I ship._
