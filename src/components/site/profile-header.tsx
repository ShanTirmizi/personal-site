import { Mail, Download } from "lucide-react";
import { identity, contact } from "@/lib/site-data";
import { Avatar } from "./avatar";
import { PillButton } from "./pill-button";
import { GithubIcon, LinkedinIcon } from "./brand-icons";

export function ProfileHeader() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-7 sm:px-7 sm:pt-[30px]">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-5 border-b border-line-strong pb-6">
        <div className="flex items-center gap-4">
          {/* Drop /public/headshot.jpg and add src="/headshot.jpg" for a real photo */}
          <Avatar />
          <div>
            <h1 className="font-display text-[20px] font-bold tracking-[-0.01em] text-ink">
              {identity.name}
            </h1>
            <p className="mt-1 font-mono text-[10.5px] tracking-[0.07em] text-muted-2">
              {identity.profileSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-[9px]">
          <span className="mr-1 flex items-center gap-[7px] font-mono text-[10.5px] font-medium text-ink">
            <span className="pulse-dot h-[7px] w-[7px] rounded-full bg-brand shadow-[0_0_0_3px_rgba(217,60,27,0.16)]" />
            OPEN TO WORK
          </span>
          <PillButton href={contact.mailto} variant="accent">
            <Mail aria-hidden />
            Email
          </PillButton>
          <PillButton href={contact.linkedin} external variant="outline">
            <LinkedinIcon />
            LinkedIn
          </PillButton>
          <PillButton href={contact.github} external variant="outline">
            <GithubIcon />
            GitHub
          </PillButton>
          <PillButton
            href={contact.cv}
            variant="outline"
            {...(contact.cvIsExternal ? { external: true } : { download: "Shan-Tirmizi-CV.pdf" })}
          >
            <Download aria-hidden />
            Download CV
          </PillButton>
        </div>
      </div>
    </section>
  );
}
