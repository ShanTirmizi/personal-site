import Image from "next/image";
import { cn } from "@/lib/utils";
import { identity } from "@/lib/site-data";

// Profile avatar. Shows the "ST" monogram by default; to use a real photo, drop
// it at /public/headshot.jpg and pass src="/headshot.jpg" from ProfileHeader.
export function Avatar({
  src,
  size = 72,
  className,
}: {
  src?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full shadow-[0_12px_30px_-18px_rgba(26,23,20,0.55)] ring-2 ring-brand/15",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={identity.name}
          fill
          sizes={`${size}px`}
          className="rounded-full object-cover"
          priority
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center rounded-full bg-ink font-bold tracking-[-0.02em] text-paper-on-dark font-display"
          style={{ fontSize: Math.round(size * 0.36) }}
          aria-label={identity.name}
        >
          {identity.monogram}
        </div>
      )}
    </div>
  );
}
