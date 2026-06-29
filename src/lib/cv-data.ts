// ============================================================
// Canonical, factual CV data: the single source of truth for the
// proof-strip metrics AND the assistant's chart artifacts. Numbers
// here are the only numbers the charts ever render, so they're always
// accurate regardless of what the model says.
// ============================================================

export type ImpactMetric = {
  label: string;
  value: number;
  prefix: "−" | "+";
  suffix: string;
  context: string;
  company: string;
};

// Ordered loosely by magnitude so the chart reads well top-to-bottom.
export const impactMetrics: ImpactMetric[] = [
  { label: "Onboarding time", value: 81, prefix: "−", suffix: "%", context: "1.5 weeks to 2 days", company: "GWI" },
  { label: "App performance", value: 50, prefix: "+", suffix: "%", context: "Rails to Next.js rewrite", company: "GWI" },
  { label: "Runtime errors", value: 40, prefix: "−", suffix: "%", context: "JS to TypeScript migration", company: "QuantSpark" },
  { label: "Client engagement", value: 35, prefix: "+", suffix: "%", context: "Custom finance dashboards", company: "InvestCloud" },
  { label: "Dev velocity", value: 30, prefix: "+", suffix: "%", context: "Architecture modernisation", company: "QuantSpark" },
  { label: "p95 latency", value: 30, prefix: "−", suffix: "%", context: "Flask to FastAPI migration", company: "PolyAI" },
];

// The four shown in the page's proof strip (kept in the design's order).
export const proofMetrics: ImpactMetric[] = [
  impactMetrics.find((m) => m.label === "p95 latency")!,
  impactMetrics.find((m) => m.label === "Onboarding time")!,
  impactMetrics.find((m) => m.label === "Runtime errors")!,
  impactMetrics.find((m) => m.label === "App performance")!,
];

export type Role = {
  company: string;
  role: string;
  location: string;
  period: string;
  note: string;
  win: string;
};

export const experience: Role[] = [
  {
    company: "PolyAI",
    role: "Full-Stack Software Engineer",
    location: "London",
    period: "Jun 2025 – Feb 2026",
    note: "Enterprise voice AI",
    win: "Shipped Agent Analysis (LLM call-analysis); cut p95 latency ~25–30% with a Flask to FastAPI migration.",
  },
  {
    company: "QuantSpark",
    role: "Full-Stack Software Engineer",
    location: "London",
    period: "Apr 2024 – May 2025",
    note: "AI & data consultancy",
    win: "Modernised the React/Flask architecture (+30% velocity) and led a JS to TypeScript migration (−40% runtime errors).",
  },
  {
    company: "Global Water Intelligence",
    role: "Full-Stack Software Engineer",
    location: "Oxford",
    period: "Sep 2022 – Apr 2024",
    note: "Market intelligence",
    win: "Rewrote a Rails app to Next.js (+50% performance) and built the first docs system, cutting onboarding 81%.",
  },
  {
    company: "InvestCloud",
    role: "Frontend Developer",
    location: "London",
    period: "May 2021 – Aug 2022",
    note: "Fintech platforms",
    win: "Promoted to lead a £9.4M project, delivered two weeks early, and fixed 95% of critical bugs in three months.",
  },
];

export type SkillGroup = { group: string; items: string[] };

export const skills: SkillGroup[] = [
  { group: "AI / LLM", items: ["Claude API", "Streaming", "Prompt engineering", "RAG", "Agentic workflows", "Tool calling"] },
  { group: "Backend", items: ["Node.js", "Express", "FastAPI", "Flask", "Rails", "Convex"] },
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind", "shadcn/ui"] },
  { group: "Mobile", items: ["React Native", "Expo", "Reanimated"] },
  { group: "Data", items: ["PostgreSQL", "MySQL", "SQLite", "SQLAlchemy"] },
  { group: "Quality", items: ["Jest", "Pytest", "Vitest", "CI/CD", "Agile"] },
];

// Rich, reverse-chronological data for the expanding career-timeline section.
export type TimelineRole = {
  company: string;
  shortName: string;
  year: string;
  period: string;
  role: string;
  location: string;
  current?: boolean;
  hero: string;
  heroLabel: string;
  secondary: string;
  bullets: string[];
  stack: string[];
};

export const timeline: TimelineRole[] = [
  {
    company: "PolyAI",
    shortName: "PolyAI",
    year: "2025",
    period: "Jun 2025 – Feb 2026",
    role: "Full-Stack SWE",
    location: "London",
    current: true,
    hero: "−30%",
    heroLabel: "p95 latency",
    secondary: "Shipped Agent Analysis (LLM workflow)",
    bullets: [
      "Built & shipped Agent Analysis, an LLM-powered call-analysis workflow.",
      "Led a Flask → FastAPI migration: p95 latency down ~25–30%.",
      "Standardised post-call CSAT surveys into one configurable pipeline.",
    ],
    stack: ["FastAPI", "Python", "Next.js"],
  },
  {
    company: "QuantSpark",
    shortName: "QuantSpark",
    year: "2024",
    period: "Apr 2024 – May 2025",
    role: "Full-Stack SWE",
    location: "London",
    hero: "−40%",
    heroLabel: "runtime errors",
    secondary: "+30% team dev velocity",
    bullets: [
      "Modernised a React/Flask component architecture (+30% velocity).",
      "Drove a JS → TypeScript migration (−40% runtime errors).",
      "Onboarded engineers and gathered requirements directly with clients.",
    ],
    stack: ["React", "TypeScript", "Flask"],
  },
  {
    company: "Global Water Intelligence",
    shortName: "GWI",
    year: "2022",
    period: "Sep 2022 – Apr 2024",
    role: "Full-Stack SWE",
    location: "Oxford",
    hero: "−81%",
    heroLabel: "onboarding time",
    secondary: "+50% app performance",
    bullets: [
      "Rewrote the core app from Rails to Next.js (+50% performance, −30% server response).",
      "Built the company’s first documentation system (onboarding −81%).",
      "Made code reviews mandatory (+30% quality, −20% production issues).",
      "Led ‘GWI Opportunity Exchange’, a community marketplace (+15% engagement).",
    ],
    stack: ["Next.js", "React", "Rails"],
  },
  {
    company: "InvestCloud",
    shortName: "InvestCloud",
    year: "2021",
    period: "May 2021 – Aug 2022",
    role: "Frontend Developer",
    location: "London",
    hero: "£9.4M",
    heroLabel: "project led",
    secondary: "Fixed 95% of critical bugs in 3 months",
    bullets: [
      "Promoted to lead a £9.4M fintech project (−20% dev time).",
      "Delivered a major project two weeks early (+25% client satisfaction).",
      "Fixed 95% of critical bugs within three months (−25% support tickets).",
      "Built custom dashboards for financial firms (+35% client engagement).",
    ],
    stack: ["React", "JavaScript", "TypeScript"],
  },
];
