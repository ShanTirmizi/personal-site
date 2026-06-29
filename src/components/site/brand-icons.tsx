import type { SVGProps } from "react";

// Lucide dropped brand glyphs in v1, so we ship crisp inline marks for GitHub
// and LinkedIn. fill: currentColor, so they inherit the button's text colour.
type IconProps = { size?: number } & Omit<SVGProps<SVGSVGElement>, "width" | "height">;

export function GithubIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M12 .5C5.37.5 0 5.84 0 12.42c0 5.26 3.44 9.72 8.21 11.3.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.25 1.84 1.25 1.07 1.85 2.81 1.32 3.5 1.01.11-.78.42-1.32.76-1.62-2.67-.31-5.47-1.35-5.47-5.99 0-1.32.47-2.4 1.24-3.25-.12-.31-.54-1.55.12-3.22 0 0 1.01-.33 3.3 1.24a11.4 11.4 0 0 1 3-.41c1.02 0 2.05.14 3 .41 2.29-1.57 3.3-1.24 3.3-1.24.66 1.67.24 2.91.12 3.22.77.85 1.24 1.93 1.24 3.25 0 4.65-2.81 5.67-5.49 5.97.43.38.82 1.12.82 2.26 0 1.63-.02 2.95-.02 3.35 0 .32.22.7.83.58A12.04 12.04 0 0 0 24 12.42C24 5.84 18.63.5 12 .5z" />
    </svg>
  );
}

export function LinkedinIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
