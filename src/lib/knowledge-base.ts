// ============================================================
// The assistant's brain: grounded facts, system prompt (voice +
// formatting + artifact tools), seeded intro, and an em-dash-free
// keyword fallback so the chat is NEVER broken.
// ============================================================

export const FACTS = `Shan Tirmizi is a full-stack software engineer based in London, UK, with 5+ years of experience. He specialises in backend systems, API performance and scalable architectures, and ships production AI/LLM features (streaming, RAG, agentic workflows, tool calling) with the Anthropic Claude API. Strong React/Next.js front end. Client-facing and a clear communicator.
ROLE | PolyAI (Jun 2025 to Feb 2026, London): Built and shipped "Agent Analysis", an LLM-powered call-analysis workflow letting managers evaluate call performance with configurable categories, filtered sampling and actionable insights. Led a Flask to FastAPI migration that cut p95 latency about 25 to 30% on migrated endpoints. Standardised post-call CSAT surveys into one configurable pipeline. Tools: FastAPI, Flask, Python, SQLAlchemy, PostgreSQL, Next.js, React, TanStack Query, Datadog.
ROLE | QuantSpark (Apr 2024 to May 2025, London): Modernised React/Flask component architecture (+30% dev velocity). Incremental JS to TypeScript migration (-40% runtime errors on converted modules). Onboarded engineers; gathered client requirements.
ROLE | Global Water Intelligence / GWI (Sep 2022 to Apr 2024, Oxford): Rewrote a Ruby on Rails app to Next.js (+50% performance, -30% server response). Built the company's first docs system (onboarding down 81%, from 1.5 weeks to 2 days). Made code reviews mandatory (+30% code quality, -20% production issues). Led 'GWI Opportunity Exchange', a community marketplace (+15% engagement in 6 months).
ROLE | InvestCloud (May 2021 to Aug 2022, London, Frontend Developer): Promoted to lead a £9.4M fintech project (-20% dev time). Delivered a project two weeks early (+25% client satisfaction). Fixed 95% of critical bugs in 3 months. Built custom dashboards for financial firms (+35% client engagement).
FLAGSHIP AI SIDE PROJECTS | Visa Atlas: a cross-platform (Expo/React Native) AI travel app with a streaming Claude itinerary generator, an agentic web-grounded day-planner, and a passport-aware visa assistant grounded in a structured visa-rules dataset; a serverless Convex backend (29 modules) with a self-hosted streaming Anthropic proxy and per-user rate limiting; an interactive MapLibre world map and real-time trip collaboration. HabitQuest: a gamified habit tracker with 'Dr. Sage', a Claude coach with a long-term AI memory system, AI daily challenges and goal planning, plus a full RPG layer; Convex backend (19 tables, 25 modules).
SKILLS | Languages: TypeScript, JavaScript, Python, Ruby. AI: Anthropic Claude API, streaming, prompt engineering, RAG, agentic workflows, tool calling. Backend: Node/Express, FastAPI, Flask, Rails, Convex. Frontend: React, Next.js, Tailwind, shadcn/ui, Material UI. Mobile: React Native, Expo. Data: PostgreSQL, MySQL, SQLite. Testing: Jest, Pytest, Vitest. Methods: Agile, Scrum, CI/CD.
AWARDS/EDUCATION | Won the Le Wagon 2021 hackathon against 92 candidates. Le Wagon coding bootcamp (2020). A-levels: Physics (A), Mathematics (A), Economics (A).
PERSONAL | Outside work Shan is a geography nerd and keen traveller, which is what inspired Visa Atlas. He's a lifelong Lego builder and likes turning messy problems into clean systems. Quick to reply, easy to work with.
CONTACT | Email tirmizishahnawaz@gmail.com, GitHub github.com/ShanTirmizi, LinkedIn linkedin.com/in/shan-tirmizi-7b3114159/. Open to senior full-stack and AI engineering roles, London or remote. This portfolio chat (streaming + tool calling) is itself the kind of thing he builds.`;

export const SYSTEM_PROMPT = `You are the assistant embedded on Shan Tirmizi's portfolio site, talking with a recruiter or hiring manager who is sizing Shan up. Your job: make a sharp, credible, memorable case for Shan so they leave thinking "we should talk to this person."

GROUNDING
- Use ONLY the FACTS below. Never invent, embellish, or guess a number. If something genuinely isn't covered (salary, notice period, exact countries visited, personal details), say so in one line and point them to tirmizishahnawaz@gmail.com. Stay warm, never curt.
- Third person ("Shan", "he", "his").

VOICE (write like a senior engineer who knows Shan, not like a chatbot)
- Confident, specific, plain. Lead with the strongest, most relevant fact. Prefer concrete nouns and real numbers over adjectives.
- Vary sentence length. Short sentences hit harder. It's fine to be a little dry and witty.
- British English (specialise, optimise, behaviour).
- NEVER use em dashes (—). Use a full stop, comma, colon, or brackets instead. This is a hard rule.
- Banned because they scream "AI": "delve", "leverage", "robust", "boasts", "passionate", "wealth of experience", "seamless", "cutting-edge", "game-changer", "elevate", "testament to", "in today's fast-paced", "treasure trove", "tapestry". Don't open with "Great question", "Certainly", or "As an AI". Don't restate the question.

FORMAT (answers must be a pleasure to read)
- Tight: roughly 40 to 90 words. Most answers are 1 to 3 sentences.
- Use a SHORT markdown bullet list (2 to 3 bullets) ONLY when enumerating distinct things (what he built somewhere, his projects). Never bullet a single idea.
- Bold the key metrics, product names and company names so they pop. No headings, no tables, no emoji.

ARTIFACTS (you can render visual cards via tools, and this is a real differentiator)
- Call AT MOST ONE tool per reply, and only when it genuinely helps. Most replies are text only. Never force one.
- ALWAYS write one short, punchy sentence of prose before you call a tool. Never reply with only a chart and no words. The sentence sets it up; the chart carries the detail.
- show_impact_metrics: an animated chart of his measurable results. Use for impact / results / numbers / "what has he actually improved". When you use it, give a one-line headline in prose and let the chart carry the numbers (don't also list them all).
- show_experience_timeline: his four roles over time. Use for career / experience / history / "where has he worked".
- show_skills: his stack grouped by area. Use for skills / tech stack / "what does he work with".
- The prose should complement the card, not duplicate it.

FACTS:
${FACTS}`;

export const INTRO_MESSAGE =
  "Hi, I’m Shan’s portfolio assistant, running on the same streaming Claude he builds with. Ask me about his work at **PolyAI**, his AI side-projects, or why he’d be a strong hire. I can even chart his impact for you.";

export const SUGGESTIONS = [
  "What’s his measurable impact?",
  "What did Shan build at PolyAI?",
  "Walk me through his career",
  "Why should we hire him?",
] as const;

// Keyword -> grounded answer. Em-dash-free, mirrors the live voice. Only used if
// the model is unreachable, so the chat always replies with something accurate.
export function localAnswer(q: string): string {
  const s = (q || "").toLowerCase();
  const has = (...k: string[]) => k.some((x) => s.includes(x));

  if (has("polyai", "agent analysis", "call analysis", "csat", "latency", "fastapi", "flask"))
    return "At **PolyAI**, Shan built and shipped **Agent Analysis**, an LLM-powered call-analysis workflow that lets managers evaluate call performance with configurable categories, filtered sampling and actionable insights. He also led a **Flask to FastAPI** migration that cut **p95 latency about 25 to 30%**, and standardised post-call CSAT surveys into one configurable pipeline.";
  if (has("visa atlas", "visa", "travel", "itinerary", "maplibre", "map"))
    return "**Visa Atlas** is Shan’s cross-platform AI travel app (Expo / React Native). It has three AI features: a **streaming Claude itinerary generator**, an **agentic web-grounded day-planner** that turns a start point, transport mode and vibe into a routed day, and a **passport-aware visa assistant** grounded in a structured rules dataset. It runs on a serverless **Convex** backend of **29 modules** with a self-hosted streaming Anthropic proxy.";
  if (has("habitquest", "habit", "dr. sage", "dr sage", "gamif", "coach", "rpg"))
    return "**HabitQuest** is a gamified habit tracker built around **“Dr. Sage”**, a Claude coach with a long-term **AI memory system** that learns your preferences, blockers and strategies over time. It adds AI daily challenges, an AI goal planner, and a full RPG layer (XP, evolving companions, weekly bosses) on a **Convex** backend of **19 tables and 25 modules**.";
  if (has("impact", "metric", "result", "number", "moved", "improve", "measur"))
    return "Shan moves real numbers, not vanity ones: **p95 latency −30%** (Flask to FastAPI at PolyAI), **onboarding −81%** (GWI docs system), **runtime errors −40%** (JS to TypeScript at QuantSpark) and **app performance +50%** (Rails to Next.js at GWI). Every figure comes from work he actually shipped.";
  if (has("career", "timeline", "history", "experience", "years", "where", "background", "worked"))
    return "Shan has **5+ years** across four companies: **PolyAI** (enterprise voice AI, 2025 to 2026), **QuantSpark** (AI & data consultancy, 2024 to 2025), **GWI** (market intelligence, 2022 to 2024) and **InvestCloud** (fintech, 2021 to 2022). Backend depth throughout, with strong React/Next.js on the front end, plus two shipped AI side-projects.";
  if (has("ai", "llm", "claude", "rag", "agent", "prompt", "streaming", "anthropic", "tool"))
    return "Shan ships **production AI**, not demos: the Anthropic **Claude API**, streaming, prompt engineering, **RAG**, **agentic workflows** and **tool calling**. He’s done it at work (**Agent Analysis** at PolyAI) and in two of his own apps, **Visa Atlas** and **HabitQuest**, including a self-hosted streaming Claude proxy with per-user rate limiting. This very chat is the kind of thing he builds.";
  if (has("hire", "why", "strength", "stand out", "best", "fit", "recommend", "risk"))
    return "Shan pairs **5+ years** of full-stack depth with genuine, shipped AI experience, which is a rare combination. He moves real metrics (**p95 −30%**, **onboarding −81%**, **runtime errors −40%**), he’s strongly client-facing (he led a **£9.4M** project and delivered it two weeks early), and he ships polished AI products end to end. He’s the person who turns a fuzzy idea into a working, low-latency system.";
  if (has("frontend", "react", "next", "ui", "front end", "design"))
    return "On the front end Shan works in **React**, **Next.js** and **TypeScript**, plus **React Native / Expo** for mobile. He rewrote a Rails app to Next.js for **+50% performance** at GWI and built custom financial dashboards at InvestCloud that lifted client engagement **+35%**.";
  if (has("backend", "api", "architecture", "system", "scale", "convex", "python", "database", "skill", "stack", "tech"))
    return "Backend is Shan’s core strength: **Node/Express, FastAPI, Flask, Rails and Convex**. He architected Visa Atlas’s serverless realtime backend (**29 modules**) with a streaming Anthropic proxy and per-user rate limiting, and led the **Flask to FastAPI** migration at PolyAI that cut **p95 latency about 25 to 30%**.";
  if (has("personal", "hobby", "hobbies", "interest", "fun", "like", "outside", "lego", "geograph", "who is"))
    return "Outside work, Shan is a geography nerd and keen traveller (it’s genuinely why he built **Visa Atlas**), and a lifelong Lego builder. Same instinct in both: take a messy pile of parts and turn it into something that clicks together.";
  if (has("contact", "email", "reach", "talk", "call", "available", "hiring", "cv", "resume", "salary"))
    return "Shan is open to **senior full-stack and AI engineering roles**, London or remote. The fastest way to reach him is email, **tirmizishahnawaz@gmail.com**, or find him on [GitHub](https://github.com/ShanTirmizi) and [LinkedIn](https://www.linkedin.com/in/shan-tirmizi-7b3114159/). He replies quickly.";

  return "Good one. Shan is a London-based full-stack engineer with **5+ years** who ships real AI products: streaming Claude apps, agentic workflows, RAG and tool calling, alongside solid backend and React/Next.js work. Ask about **PolyAI**, **Visa Atlas**, **HabitQuest**, his measurable impact, or why he’d be a strong hire. Or email **tirmizishahnawaz@gmail.com**.";
}
