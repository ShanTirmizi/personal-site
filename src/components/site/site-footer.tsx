import { contact, footer } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-[rgba(26,23,20,0.015)]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-5 py-[22px] font-mono text-[11px] text-muted-3 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <span>{footer.left}</span>
        <span className="text-faint text-balance sm:text-center">{footer.center}</span>
        <a
          href={contact.mailto}
          className="text-muted-2 transition-colors hover:text-ink"
        >
          {contact.email}
        </a>
      </div>
    </footer>
  );
}
