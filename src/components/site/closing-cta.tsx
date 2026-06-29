import { Mail, Download } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { closing, contact } from "@/lib/site-data";
import { PillButton } from "./pill-button";
import { GithubIcon, LinkedinIcon } from "./brand-icons";

export function ClosingCta() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-[50px] pb-[70px] sm:px-7">
      <Reveal className="rounded-[22px] bg-ink px-6 py-12 text-center sm:px-10 sm:py-[56px]">
        <p className="mb-4 font-mono text-[11px] tracking-[0.12em] text-brand-bright">
          {closing.kicker}
        </p>
        <h2 className="font-display text-[clamp(30px,4.4vw,52px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-paper-on-dark">
          {closing.headlineTop}
          <br />
          {closing.headlineBottom}
        </h2>
        <p className="mx-auto mt-[18px] max-w-[500px] text-[16px] leading-[1.55] text-muted-on-dark sm:text-[17px]">
          {closing.sub}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <PillButton href={contact.mailto} variant="accent" size="lg" className="max-sm:w-full">
            <Mail aria-hidden />
            {contact.email}
          </PillButton>
          <PillButton href={contact.linkedin} external variant="darkSoft" size="lg">
            <LinkedinIcon />
            LinkedIn
          </PillButton>
          <PillButton href={contact.github} external variant="darkSoft" size="lg">
            <GithubIcon />
            GitHub
          </PillButton>
          <PillButton
            href={contact.cv}
            download="Shan-Tirmizi-CV.pdf"
            variant="darkSoft"
            size="lg"
          >
            <Download aria-hidden />
            Download CV
          </PillButton>
        </div>
      </Reveal>
    </section>
  );
}
