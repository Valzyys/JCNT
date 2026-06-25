"use client";

import React, { useEffect, useRef } from "react";

const FONT: Record<string, number[][]> = {
  " ": [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
  ".": [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0]],
  "-": [[0,0,0],[0,0,0],[1,1,1],[0,0,0],[0,0,0]],
  "·": [[0,0,0],[0,0,0],[0,1,0],[0,0,0],[0,0,0]],
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
  "N": [[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],
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

// ── EDIT TEXT DI SINI ───────────────────────────────────────────────────────
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
// ────────────────────────────────────────────────────────────────────────────

const DOT_SIZE = 4;
const DOT_GAP  = 2;
const STEP     = DOT_SIZE + DOT_GAP;
const CHAR_W   = 3;
const CHAR_H   = 5;

// Warna dot — edit di sini juga kalau mau
const COLOR_ON_LIGHT  = "#1a1a1a";
const COLOR_OFF_LIGHT = "rgba(0,0,0,0.10)";
const COLOR_ON_DARK   = "#e8e8e6";
const COLOR_OFF_DARK  = "rgba(255,255,255,0.10)";

function buildStrip(text: string): boolean[][] {
  const cols: boolean[][] = [];
  for (let i = 0; i < text.length; i++) {
    const glyph = FONT[text[i].toUpperCase()] ?? FONT[" "];
    for (let c = 0; c < CHAR_W; c++) {
      cols.push(Array.from({ length: CHAR_H }, (_, r) => !!glyph[r][c]));
      if (c < CHAR_W - 1) cols.push(new Array(CHAR_H).fill(false));
    }
    if (i < text.length - 1) {
      cols.push(new Array(CHAR_H).fill(false));
      cols.push(new Array(CHAR_H).fill(false));
    }
  }
  return cols;
}

interface LibrariesProps {
  className?: string;
  speed?: number; // px per frame, default 0.8
}

export const Libraries: React.FC<LibrariesProps> = ({
  className,
  speed = 0.8,
}) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const offsetRef  = useRef(0);
  const rafRef     = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fullText   = MARQUEE_ITEMS.join(SEPARATOR) + SEPARATOR;
    const strip      = buildStrip(fullText);
    // total dot-column count for one full loop
    const loopLen    = strip.length;
    // doubled strip so we can always read [i % loopLen*2] without branch
    const doubleStrip = [...strip, ...strip];

    canvas.height = CHAR_H * STEP;

    const isDark = () =>
      document.documentElement.getAttribute("data-mode") === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const draw = () => {
      const W   = canvas.width;
      const H   = canvas.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // --- draw static dot grid (all dots, dim) ---
      const totalDotsX = Math.ceil(W / STEP) + 1;
      const dark        = isDark();
      const colorOn     = dark ? COLOR_ON_DARK  : COLOR_ON_LIGHT;
      const colorOff    = dark ? COLOR_OFF_DARK : COLOR_OFF_LIGHT;

      ctx.clearRect(0, 0, W, H);

      // The "text" window slides over the static grid.
      // offset = how many px the text has scrolled from left.
      // For dot column `d` (0-based screen dot col), the corresponding
      // strip column is: floor((offset + d*STEP) / STEP) % loopLen
      const startDotCol = Math.floor(offsetRef.current / STEP);
      const subPx       = offsetRef.current % STEP; // sub-step pixel offset

      for (let d = 0; d < totalDotsX; d++) {
        const x      = d * STEP - subPx;
        const stripI = (startDotCol + d) % loopLen;
        const col    = doubleStrip[stripI]; // boolean[5]

        for (let r = 0; r < CHAR_H; r++) {
          ctx.fillStyle = col[r] ? colorOn : colorOff;
          ctx.beginPath();
          ctx.arc(x + DOT_SIZE / 2, r * STEP + DOT_SIZE / 2, DOT_SIZE / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      offsetRef.current += speed;
      if (offsetRef.current >= loopLen * STEP) {
        offsetRef.current -= loopLen * STEP;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [speed]);

  return (
    <div
      id="librariesRow"
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
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--text-muted, #999)",
        }}
      >
        Built using awesome libraries and stacks
      </span>

      <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        {/* fade left */}
        <div style={{
          position: "absolute", left: 0, top: 0,
          height: "100%", width: 64, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(to right, var(--surface-2, #fff), transparent)",
        }} />
        {/* fade right */}
        <div style={{
          position: "absolute", right: 0, top: 0,
          height: "100%", width: 64, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(to left, var(--surface-2, #fff), transparent)",
        }} />

        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>
    </div>
  );
};

export default Libraries;
