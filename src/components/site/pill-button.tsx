import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Brand button recipes layered on the shadcn/Base-UI Button primitive (keeps its
// focus ring + active press). Renders as <a> when `href` is provided.
const pill = cva(
  "h-auto min-h-11 rounded-[9px] font-semibold tracking-[-0.005em] font-sans transition-colors sm:min-h-0",
  {
    variants: {
      variant: {
        accent: "border-transparent bg-brand text-paper-on-dark hover:bg-brand-hover",
        outline:
          "border border-[rgba(26,23,20,0.2)] bg-transparent text-ink hover:bg-[rgba(26,23,20,0.05)]",
        darkSoft:
          "border border-white/[0.12] bg-white/[0.08] text-paper-on-dark hover:bg-white/[0.14]",
      },
      size: {
        sm: "gap-1.5 px-[15px] py-[9px] text-[13px]",
        lg: "gap-2 rounded-xl px-[26px] py-[15px] text-[15px]",
      },
    },
    defaultVariants: { variant: "accent", size: "sm" },
  },
);

type PillButtonProps = VariantProps<typeof pill> & {
  children: React.ReactNode;
  className?: string;
  href?: string;
  external?: boolean;
  download?: boolean | string;
  onClick?: () => void;
  type?: "button" | "submit";
  "aria-label"?: string;
  title?: string;
};

export function PillButton({
  children,
  className,
  variant,
  size,
  href,
  external,
  download,
  onClick,
  type,
  ...rest
}: PillButtonProps) {
  const classes = cn(pill({ variant, size }), className);

  if (href) {
    return (
      <Button
        className={classes}
        nativeButton={false}
        render={
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            {...(download ? { download: typeof download === "string" ? download : "" } : {})}
          />
        }
        {...rest}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button className={classes} onClick={onClick} type={type} {...rest}>
      {children}
    </Button>
  );
}
