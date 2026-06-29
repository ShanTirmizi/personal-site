import { Mail, Download } from "lucide-react";
import { identity, contact } from "@/lib/site-data";
import { PillButton } from "./pill-button";
import { GithubIcon, LinkedinIcon } from "./brand-icons";

// Square ~36px icon button: reuses the outline pill (border, hover, focus ring,
// press) but overrides padding/size so it's icon-only.
const iconButton = "h-9 w-9 min-h-0 justify-center p-0";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-[12px] supports-[backdrop-filter]:bg-paper/70">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-5 gap-y-3 px-5 py-3 sm:px-7">
        {/* identity */}
        <div className="flex shrink-0 items-center gap-[11px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-[15px] font-bold tracking-[-0.02em] text-paper-on-dark">
            {identity.monogram}
          </div>
          <div>
            <h1 className="font-display text-[16px] font-bold leading-[1.1] tracking-[-0.01em] text-ink">
              {identity.name}
            </h1>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-2">
              {identity.headerEyebrow}
            </p>
          </div>
        </div>

        {/* actions — wraps gracefully on narrow screens */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className="mr-0.5 flex items-center gap-[7px] font-mono text-[11px] font-medium text-ink">
            <span className="pulse-dot h-[7px] w-[7px] rounded-full bg-brand shadow-[0_0_0_3px_rgba(217,60,27,0.16)]" />
            Open to work
          </span>
          <PillButton
            href={contact.github}
            external
            variant="outline"
            className={iconButton}
            aria-label="Shan Tirmizi on GitHub"
            title="GitHub"
          >
            <GithubIcon size={17} />
          </PillButton>
          <PillButton
            href={contact.linkedin}
            external
            variant="outline"
            className={iconButton}
            aria-label="Shan Tirmizi on LinkedIn"
            title="LinkedIn"
          >
            <LinkedinIcon size={17} />
          </PillButton>
          <PillButton
            href={contact.cv}
            variant="outline"
            {...(contact.cvIsExternal ? { external: true } : { download: "Shan-Tirmizi-CV.pdf" })}
          >
            <Download aria-hidden />
            Download CV
          </PillButton>
          <PillButton href={contact.mailto} variant="accent">
            <Mail aria-hidden />
            Email
          </PillButton>
        </div>
      </div>
    </header>
  );
}
