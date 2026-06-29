import { identity, contact } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-[12px] supports-[backdrop-filter]:bg-paper/70">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-5 gap-y-2.5 px-5 py-3 sm:px-7">
        <div className="flex shrink-0 items-center gap-[11px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-[15px] font-bold tracking-[-0.02em] text-paper-on-dark font-display">
            {identity.monogram}
          </div>
          <div className="leading-[1.05]">
            <div className="font-display text-[16px] font-bold tracking-[-0.01em] text-ink">
              {identity.name}
            </div>
            <div className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-3">
              {identity.headerEyebrow}
            </div>
          </div>
        </div>

        <nav className="flex shrink-0 flex-wrap items-center gap-x-[15px] gap-y-1.5 font-mono text-[11px]">
          <span className="flex items-center gap-[7px] font-medium text-ink">
            <span className="pulse-dot h-[7px] w-[7px] rounded-full bg-brand shadow-[0_0_0_3px_rgba(217,60,27,0.16)]" />
            Open to work
          </span>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1 text-muted-2 transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1 text-muted-2 transition-colors hover:text-ink"
          >
            LinkedIn
          </a>
        </nav>
      </div>
    </header>
  );
}
