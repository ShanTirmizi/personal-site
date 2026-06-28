import { cn } from "@/lib/utils";

// Ink bezel holding a 132×280 portrait screen slot (handoff spec). Children fill it.
export function PhoneMockup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex-none rounded-[24px] bg-ink p-[7px] shadow-[0_24px_48px_-26px_rgba(26,23,20,0.6)]",
        className,
      )}
    >
      <div className="relative h-[280px] w-[132px] overflow-hidden rounded-[18px] bg-paper-card">
        {children}
      </div>
    </div>
  );
}
