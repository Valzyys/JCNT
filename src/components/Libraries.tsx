"use client";

import React, { useEffect, useRef } from "react";
import { Flex, Text, Fade } from "@once-ui-system/core";
import { spojtConfig } from "@/resources/spojt.config";

// ── EDIT TEKS DI SINI ───────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "Never Miss a Show, Live, or JKT48 Update",
];
const SEPARATOR = "    ·    ";
// ────────────────────────────────────────────────────────────────────────────

// 5×5 dot-matrix font — jauh lebih readable dari 5×3
const FONT: Record<string, string[]> = {
  " ": ["00000","00000","00000","00000","00000"],
  "·": ["00000","00000","00110","00110","00000"],
  ".": ["00000","00000","00000","00110","00110"],
  "-": ["00000","00000","11111","00000","00000"],
  "/": ["00001","00010","00100","01000","10000"],
  "A": ["01110","10001","11111","10001","10001"],
  "B": ["11110","10001","11110","10001","11110"],
  "C": ["01111","10000","10000","10000","01111"],
  "D": ["11110","10001","10001","10001","11110"],
  "E": ["11111","10000","11110","10000","11111"],
  "F": ["11111","10000","11110","10000","10000"],
  "G": ["01111","10000","10011","10001","01111"],
  "H": ["10001","10001","11111","10001","10001"],
  "I": ["11111","00100","00100","00100","11111"],
  "J": ["00111","00010","00010","10010","01100"],
  "K": ["10001","10010","11100","10010","10001"],
  "L": ["10000","10000","10000","10000","11111"],
  "M": ["10001","11011","10101","10001","10001"],
  "N": ["10001","11001","10101","10011","10001"],
  "O": ["01110","10001","10001","10001","01110"],
  "P": ["11110","10001","11110","10000","10000"],
  "Q": ["01110","10001","10001","10011","01111"],
  "R": ["11110","10001","11110","10010","10001"],
  "S": ["01111","10000","01110","00001","11110"],
  "T": ["11111","00100","00100","00100","00100"],
  "U": ["10001","10001","10001","10001","01110"],
  "V": ["10001","10001","10001","01010","00100"],
  "W": ["10001","10001","10101","11011","10001"],
  "X": ["10001","01010","00100","01010","10001"],
  "Y": ["10001","01010","00100","00100","00100"],
  "Z": ["11111","00010","00100","01000","11111"],
  "0": ["01110","10011","10101","11001","01110"],
  "1": ["00100","01100","00100","00100","01110"],
  "2": ["01110","10001","00110","01000","11111"],
  "3": ["11110","00001","00110","00001","11110"],
  "4": ["00010","00110","01010","11111","00010"],
  "5": ["11111","10000","11110","00001","11110"],
  "6": ["00111","01000","11110","10001","01110"],
  "7": ["11111","00001","00010","00100","01000"],
  "8": ["01110","10001","01110","10001","01110"],
  "9": ["01110","10001","01111","00001","01110"],
};

const ROWS     = 5;
const COLS     = 5;
const DS       = 3;          // dot diameter px
const DG       = 1;          // dot gap px
const STEP     = DS + DG;    // 4px per slot
const COL_GAP  = 2;          // blank dot-cols between chars

function buildStrip(text: string): boolean[][] {
  const strip: boolean[][] = [];
  for (let i = 0; i < text.length; i++) {
    const glyph = FONT[text[i].toUpperCase()] ?? FONT[" "];
    for (let c = 0; c < COLS; c++) {
      strip.push(Array.from({ length: ROWS }, (_, r) => glyph[r][c] === "1"));
    }
    if (i < text.length - 1) {
      for (let g = 0; g < COL_GAP; g++) {
        strip.push(new Array(ROWS).fill(false));
      }
    }
  }
  return strip;
}

interface LibrariesProps {
  className?: string;
}

export const Libraries: React.FC<LibrariesProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number>(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d")!;

    const fullText = MARQUEE_ITEMS.join(SEPARATOR) + SEPARATOR;
    const strip    = buildStrip(fullText);
    const TOTAL    = strip.length;

    const speed = spojtConfig.utilities.autoScroll ? 0.07 : 0.04;

    canvas.height = ROWS * STEP;

    // Baca CSS variable dari root untuk warna on/off — ikut theme Once UI
    const getColors = () => {
      const style = getComputedStyle(document.documentElement);
      const onColor  = style.getPropertyValue("--neutral-on-background-strong").trim()
        || style.getPropertyValue("--text-primary").trim()
        || "rgba(230,230,228,1)";
      const offColor = style.getPropertyValue("--neutral-alpha-weak").trim()
        || "rgba(255,255,255,0.10)";
      return { onColor, offColor };
    };

    const draw = () => {
      const W = canvas.width;
      ctx.clearRect(0, 0, W, canvas.height);

      const { onColor, offColor } = getColors();
      const visibleCols = Math.ceil(W / STEP) + 1;

      for (let d = 0; d < visibleCols; d++) {
        const si  = Math.floor(offsetRef.current + d) % TOTAL;
        const col = strip[si];
        const x   = d * STEP;

        for (let r = 0; r < ROWS; r++) {
          ctx.fillStyle = col[r] ? onColor : offColor;
          ctx.beginPath();
          ctx.arc(x + DS / 2, r * STEP + DS / 2, DS / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      offsetRef.current += speed;
      if (offsetRef.current >= TOTAL) offsetRef.current -= TOTAL;
      rafRef.current = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => {
      canvas.width = wrap.offsetWidth;
    });
    ro.observe(wrap);
    canvas.width = wrap.offsetWidth;

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <Flex
      direction="row"
      fillWidth
      center
      paddingX="l"
      paddingY="m"
      id="librariesRow"
      className={className}
    >
      <Flex center maxWidth={8} id="librariesTextLeft">
        <Text variant="label-default-xs" onBackground="neutral-weak">
          Built using awesome libraries and stacks:
        </Text>
      </Flex>

      <div
        ref={wrapRef}
        style={{ position: "relative", flex: 1, overflow: "hidden" }}
      >
        {/* fade edges — pakai Fade dari Once UI supaya ikut theme */}
        <Fade
          zIndex="1"
          to="right"
          fillHeight
          width="64"
          position="absolute"
          left="0"
          base="transparent"
          top="0"
        />
        <Fade
          zIndex="1"
          to="left"
          fillHeight
          width="64"
          position="absolute"
          right="0"
          top="0"
          base="transparent"
        />

        <canvas
          ref={canvasRef}
          style={{ display: "block", margin: "auto 0" }}
        />
      </div>
    </Flex>
  );
};

export default Libraries;
