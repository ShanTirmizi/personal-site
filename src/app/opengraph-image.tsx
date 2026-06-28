import { ImageResponse } from "next/og";

export const alt = "Shan Tirmizi · AI & Full-Stack Engineer. Don’t read my CV. Talk to it.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fetch a TTF subset from Google Fonts (Node fetch gets truetype, which Satori needs).
async function loadFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\(/);
  if (!match) throw new Error("font css parse failed");
  const res = await fetch(match[1]);
  if (!res.ok) throw new Error("font fetch failed");
  return res.arrayBuffer();
}

export default async function OpengraphImage() {
  const display = "Don’t read my CV. Talk to it.ST";
  const body = "Shan Tirmizi AI ENGINEER · FULL-STACK · LONDON Live Claude assistant on the site";

  const [bricolage, hanken] = await Promise.all([
    loadFont("Bricolage+Grotesque", 800, display),
    loadFont("Hanken+Grotesk", 600, body),
  ]);

  const PAPER = "#F2EEE5";
  const INK = "#1A1714";
  const ACCENT = "#D93C1B";
  const MUTED = "#6B6456";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: PAPER,
          color: INK,
          fontFamily: "Hanken",
        }}
      >
        {/* kicker */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 3, background: ACCENT }} />
          <div
            style={{
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            AI Engineer · Full-Stack · London
          </div>
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Bricolage",
            fontSize: 104,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: -4,
          }}
        >
          <div style={{ display: "flex" }}>Don’t read my CV.</div>
          <div style={{ display: "flex", color: ACCENT }}>Talk to it.</div>
        </div>

        {/* footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 56,
                background: INK,
                color: PAPER,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Bricolage",
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              ST
            </div>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 600 }}>
              Shan Tirmizi
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 20px",
              borderRadius: 999,
              border: "1px solid rgba(26,23,20,0.18)",
              background: "rgba(26,23,20,0.04)",
              fontSize: 22,
              color: INK,
            }}
          >
            <div style={{ width: 11, height: 11, borderRadius: 11, background: ACCENT }} />
            Live Claude assistant on the site
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: bricolage, weight: 800, style: "normal" },
        { name: "Hanken", data: hanken, weight: 600, style: "normal" },
      ],
    },
  );
}
