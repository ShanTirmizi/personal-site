// ============================================================
// Single source of truth for page copy. Written to read like a human
// wrote it: no em dashes, plain confident sentences. CV facts/metrics
// live in cv-data.ts.
// ============================================================

export const identity = {
  name: "Shan Tirmizi",
  monogram: "ST",
  headerEyebrow: "Full-stack · AI engineer",
  profileSubtitle: "AI ENGINEER · FULL-STACK · LONDON",
  location: "London, UK",
} as const;

// CV link is configurable: set NEXT_PUBLIC_CV_URL to a hosted PDF (Google Drive,
// Vercel Blob, Dropbox, etc.) so the CV can be updated without a code change.
// Falls back to the bundled PDF in /public.
const cvUrl = process.env.NEXT_PUBLIC_CV_URL?.trim() || "/Shan-Tirmizi-CV.pdf";

export const contact = {
  email: "tirmizishahnawaz@gmail.com",
  mailto: `mailto:tirmizishahnawaz@gmail.com?subject=${encodeURIComponent(
    "Let’s talk about a role",
  )}`,
  github: "https://github.com/ShanTirmizi",
  linkedin: "https://www.linkedin.com/in/shan-tirmizi-7b3114159/",
  cv: cvUrl,
  cvIsExternal: /^https?:\/\//i.test(cvUrl),
} as const;

export const hero = {
  kicker: "Open to senior AI & full-stack roles",
  headlineTop: "Don’t read my CV.",
  headlineAccent: "Talk to it.",
  sub: "I’m an AI engineer who ships: streaming LLM apps, agentic workflows and low-latency backends, all in production. Don’t take my word for it. Ask the assistant, or skim the proof below.",
  proofLine: "5+ years shipping production AI · plus a long tail of side projects",
} as const;

export const shippedAt = [
  "PolyAI",
  "QuantSpark",
  "Global Water Intelligence",
  "InvestCloud",
] as const;

export type StoreLink = { href: string; comingSoon: boolean };
export type App = {
  id: "visa-atlas" | "habitquest";
  name: string;
  kind: string;
  period: string;
  tag: string;
  blurb: string;
  image?: string;
  imageAlt?: string;
  screen?: "habitquest";
  highlights: string[];
  stack: string[];
  store: { appStore: StoreLink; googlePlay: StoreLink };
};

const comingSoon: StoreLink = { href: "#", comingSoon: true };

export const apps: App[] = [
  {
    id: "visa-atlas",
    name: "Visa Atlas",
    kind: "Cross-platform travel app · iOS & Android",
    period: "Mar 2026 – Present",
    tag: "Personal product",
    blurb:
      "An AI travel companion: plan trips, route your day, and get passport-aware visa answers, grounded and streaming.",
    image: "/apps/visa-atlas.png",
    imageAlt: "Visa Atlas, the AI trip planner screen",
    highlights: [
      "AI itinerary generator producing complete, structured trip plans (flights, lodging, dining, activities) with streaming Claude responses.",
      "Agentic, web-grounded day-planner that turns a start point, transport mode and vibe into a geocoded, routed itinerary.",
      "Claude-powered visa assistant: grounded, passport-aware answers backed by a structured visa-rules dataset.",
      "Serverless Convex backend (29 modules) with a self-hosted streaming Anthropic proxy and per-user rate limiting.",
      "Interactive MapLibre world map and real-time, multi-user trip collaboration.",
    ],
    stack: ["Expo", "React Native", "TypeScript", "Convex"],
    store: { appStore: comingSoon, googlePlay: comingSoon },
  },
  {
    id: "habitquest",
    name: "HabitQuest",
    kind: "Gamified habit-tracking app",
    period: "Feb 2026 – Apr 2026",
    tag: "Personal product",
    blurb:
      "A habit tracker with an RPG soul and a Claude coach that actually remembers you.",
    screen: "habitquest",
    highlights: [
      "“Dr. Sage”, a Claude-powered AI coach that reads habits, journal entries and streaks for personalised, conversational guidance.",
      "AI memory system that extracts and stores preferences, blockers and strategies over time, so coaching improves with use.",
      "AI-generated daily challenges and an AI goal-planning assistant, all powered by Claude.",
      "A full RPG layer (XP, evolving companions, weekly bosses) layered over the habit tracker to make consistency stick.",
      "Serverless Convex backend (19 tables, 25 modules) handling state, streaks and the AI features.",
    ],
    stack: ["Expo", "React Native", "TypeScript", "Convex"],
    store: { appStore: comingSoon, googlePlay: comingSoon },
  },
];

export const appsNote = "Launching on the App Store & Google Play soon.";

export const featured = {
  kicker: "Featured · Built solo",
  heading: "Two AI apps you can actually download.",
} as const;

export type HireCard = {
  idx: string;
  title: string;
  body: string;
  inverted?: boolean;
};

export const whyHire = {
  kicker: "The case",
  heading: "What you’re getting.",
  cards: [
    {
      idx: "01",
      inverted: true,
      title: "I ship AI, not demos",
      body: "Production LLM features at PolyAI, plus two AI apps of my own: streaming Claude, RAG, agentic workflows and a self-hosted Anthropic proxy. Real users, real uptime.",
    },
    {
      idx: "02",
      title: "I move the metrics that matter",
      body: "p95 latency −30%, onboarding −81%, performance +50%, runtime errors −40%. Every number comes from work I actually shipped.",
    },
    {
      idx: "03",
      title: "I deliver under pressure",
      body: "Client-facing for years: I led a £9.4M project, delivered two weeks early, and fixed 95% of critical bugs in three months. I communicate clearly with non-technical stakeholders.",
    },
    {
      idx: "04",
      title: "I make the whole team faster",
      body: "I built the first docs system, made code reviews mandatory, and mentor as I go. Onboarding fell from 1.5 weeks to 2 days. Le Wagon ’21 hackathon winner (beat 92).",
    },
  ] as HireCard[],
} as const;

export const personal = {
  kicker: "Off the clock",
  line: "I build to think. When something bugs me, I ship a small app to fix it, so there’s a long tail of projects behind the two I show off here. Otherwise: geography nerd, serial traveller (it’s why Visa Atlas exists), and someone who likes building Lego. Same instinct every time: turn a messy pile of parts into something that clicks.",
} as const;

export const closing = {
  kicker: "// the easy yes",
  headlineTop: "Hiring an AI engineer?",
  headlineBottom: "This one’s a no-brainer.",
  sub: "Open to senior full-stack & AI engineering roles, in London or remote. Tell me what you’re building and I’ll reply fast.",
} as const;

export const footer = {
  left: "© 2026 Shan Tirmizi · London, UK",
  center: "Built as a live, Claude-powered demo. The kind of thing I ship.",
} as const;
