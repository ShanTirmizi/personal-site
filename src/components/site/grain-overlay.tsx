// Fixed full-screen paper grain — subtle fractal-noise texture (handoff: opacity .05,
// multiply blend, pointer-events none). Gives the warm paper its tactile depth.
const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] opacity-[0.05] mix-blend-multiply"
      style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "120px" }}
    />
  );
}
