"use client";

import React, { useEffect, useRef } from "react";

// ── EDIT TEKS DI SINI ───────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "Next.js",
  "React",
  "TypeScript",
  "Cloudflare Workers",
  "Hono",
  "CockroachDB",
  "Node.js",
  "Python",
  "Cloudflare R2",
  "Cloudflare KV",
  "HLS.js",
  "Tailwind CSS",
  "twikit",
];
const SEPARATOR = "   ·   ";
const SPEED = 0.05; // dot-columns per frame, lebih besar = lebih cepat
// ────────────────────────────────────────────────────────────────────────────

const FONT: Record<string, number[][]> = {
  " ": [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
  "·": [[0,0,0],[0,0,0],[0,1,0],[0,0,0],[0,0,0]],
  ".": [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0]],
  "-": [[0,0,0],[0,0,0],[1,1,1],[0,0,0],[0,0,0]],
  "/": [[0,0,1],[0,0,1],[0,1,0],[1,0,0],[1,0,0]],
  "A": [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  "B": [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
  "C": [[0,1,1],[1,0,0],[1,0,0],[1,0,0],[0,1,1]],
  "D": [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
  "E": [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],
  "F": [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,0,0]],
  "G": [[0,1,1],[1,0,0],[1,0,1],[1,0,1],[0,1,1]],
  "H": [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  "I": [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
  "J": [[0,0,1],[0,0,1],[0,0,1],[1,0,1],[0,1,0]],
  "K": [[1,0,1],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  "L": [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
  "M": [[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],
  "N": [[1,0,1],[1,1,0],[1,0,1],[1,0,1],[1,0,1]],
  "O": [[0,1,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  "P": [[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
  "Q": [[0,1,0],[1,0,1],[1,0,1],[1,1,1],[0,1,1]],
  "R": [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  "S": [[0,1,1],[1,0,0],[0,1,0],[0,0,1],[1,1,0]],
  "T": [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
  "U": [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  "V": [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  "W": [[1,0,1],[1,0,1],[1,1,1],[1,1,1],[1,0,1]],
  "X": [[1,0,1],[1,0,1],[0,1,0],[1,0,1],[1,0,1]],
  "Y": [[1,0,1],[1,0,1],[0,1,0],[0,1,0],[0,1,0]],
  "Z": [[1,1,1],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
  "0": [[0,1,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  "1": [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
  "2": [[1,1,0],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
  "3": [[1,1,0],[0,0,1],[0,1,0],[0,0,1],[1,1,0]],
  "4": [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
  "5": [[1,1,1],[1,0,0],[1,1,0],[0,0,1],[1,1,0]],
  "6": [[0,1,1],[1,0,0],[1,1,0],[1,0,1],[0,1,0]],
  "7": [[1,1,1],[0,0,1],[0,1,0],[0,1,0],[0,1,0]],
  "8": [[0,1,0],[1,0,1],[0,1,0],[1,0,1],[0,1,0]],
  "9": [[0,1,0],[1,0,1],[0,1,1],[0,0,1],[1,1,0]],
};

const DS = 4;           // dot size px
const DG = 2;           // dot gap px
const STEP = DS + DG;   // 6px per dot-column
const CW = 3;           // char width in dots
const CH = 5;           // char height in dots

function buildStrip(text: string): boolean[][] {
  const cols: boolean[][] = [];
  for (let i = 0; i < text.length; i++) {
    const g = FONT[text[i].toUpperCase()] ?? FONT[" "];
    for (let c = 0; c < CW; c++) {
      cols.push([0, 1, 2, 3, 4].map((r) => !!g[r][c]));
      if (c < CW - 1) cols.push(new Array(CH).fill(false));
    }
    if (i < text.length - 1) {
      cols.push(new Array(CH).fill(false));
      cols.push(new Array(CH).fill(false));
    }
  }
  return cols;
}

interface LibrariesProps {
  className?: string;
}

export const Libraries: React.FC<LibrariesProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number>(0);
  const offsetRef = useRef(0); // fractional dot-column offset

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const fullText  = MARQUEE_ITEMS.join(SEPARATOR) + SEPARATOR;
    const strip     = buildStrip(fullText);
    const TOTAL     = strip.length; // dot-columns for one full loop

    canvas.height = CH * STEP;

    const isDark = () =>
      document.documentElement.getAttribute("data-mode") === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const draw = () => {
      const dark = isDark();
      const W = canvas.width;
      ctx.clearRect(0, 0, W, canvas.height);

      // number of full dot-columns that fit on screen
      const visibleCols = Math.floor(W / STEP);

      for (let d = 0; d < visibleCols; d++) {
        // Key fix: screen column d maps to strip column (offset + d) % TOTAL
        // offset advances each frame — dots stay fixed, only on/off changes
        const si  = Math.floor(offsetRef.current + d) % TOTAL;
        const col = strip[si];
        const x   = d * STEP;

        for (let r = 0; r < CH; r++) {
          ctx.fillStyle = col[r]
            ? dark ? "rgba(232,232,230,1)"   : "rgba(26,26,26,1)"
            : dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.09)";
          ctx.beginPath();
          ctx.arc(x + DS / 2, r * STEP + DS / 2, DS / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      offsetRef.current += SPEED;
      if (offsetRef.current >= TOTAL) offsetRef.current -= TOTAL;

      rafRef.current = requestAnimationFrame(draw);
    };

    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = wrap.offsetWidth;
    };

    resize();
    new ResizeObserver(resize).observe(wrap);
    rafRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "12px 32px",
        gap: 10,
      }}
    >
      <span style={{
        fontSize: 11,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--text-muted, #999)",
      }}>
        Built using awesome libraries and stacks
      </span>

      <div ref={wrapRef} style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        {/* fade left */}
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%", width: 64,
          background: "linear-gradient(to right, var(--surface-2,#fff), transparent)",
          zIndex: 1, pointerEvents: "none",
        }} />
        {/* fade right */}
        <div style={{
          position: "absolute", right: 0, top: 0, height: "100%", width: 64,
          background: "linear-gradient(to left, var(--surface-2,#fff), transparent)",
          zIndex: 1, pointerEvents: "none",
        }} />

        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>
    </div>
  );
};

export default Libraries;
