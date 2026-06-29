import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { App, StoreLink } from "@/lib/site-data";

// Custom-styled store buttons (deliberately NOT Apple/Google badge artwork, which avoids
// trademark issues). Renders a real link when live; a clear "coming soon" otherwise.
function StoreButton({
  kind,
  link,
}: {
  kind: "appstore" | "googleplay";
  link: StoreLink;
}) {
  const label =
    kind === "appstore"
      ? { top: "DOWNLOAD ON", main: "App Store" }
      : { top: "GET IT ON", main: "Google Play" };
  const filled = kind === "appstore";

  const className = cn(
    "inline-flex items-center gap-[9px] rounded-[11px] px-[15px] py-[9px] transition-colors",
    filled
      ? "bg-ink text-paper-on-dark"
      : "border border-[rgba(26,23,20,0.2)] text-ink",
    link.comingSoon
      ? "cursor-default opacity-90"
      : filled
        ? "hover:bg-black"
        : "hover:bg-[rgba(26,23,20,0.05)]",
  );

  const inner = (
    <>
      <Download size={16} aria-hidden className="shrink-0" />
      <span className="text-left leading-[1.15]">
        <span className="block font-mono text-[8px] tracking-[0.08em] opacity-65">
          {label.top}
        </span>
        <span className="block text-[13px] font-semibold">{label.main}</span>
      </span>
    </>
  );

  if (link.comingSoon) {
    return (
      <span
        className={className}
        role="link"
        aria-disabled="true"
        title="Coming soon"
      >
        {inner}
      </span>
    );
  }

  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  );
}

export function StoreButtons({ store }: { store: App["store"] }) {
  return (
    <div className="flex flex-wrap gap-[9px] border-t border-line pt-4">
      <StoreButton kind="appstore" link={store.appStore} />
      <StoreButton kind="googleplay" link={store.googlePlay} />
    </div>
  );
}
