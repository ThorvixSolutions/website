"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/text";

type Props = {
  src: string;
  alt?: string;
  /** bump to replay the effect (e.g. on hover) */
  play: number;
  /** block sizes per step, coarse → fine → coarse */
  seq?: number[];
  stepMs?: number;
  /** base class; gets `is-px` while the canvas is showing */
  base: string;
  className?: string;
  eager?: boolean;
};

const SEQ = [4, 8, 16, 26, 16, 8, 4];

/** Image that briefly breaks into pixel blocks and resolves back each time `play` changes. */
export function PixelImage({ src, alt = "", play, seq = SEQ, stepMs = 48, base, className, eager = false }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pixel, setPixel] = useState(false);

  useEffect(() => {
    if (!play) return;
    const host = ref.current;
    const cv = canvasRef.current;
    const img = host?.querySelector("img");
    if (!host || !cv || !img || !img.complete || !img.naturalWidth) return;
    const r = host.getBoundingClientRect();
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const W = Math.max(1, Math.round(r.width * dpr));
    const H = Math.max(1, Math.round(r.height * dpr));
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    // cover-fit
    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const iw = img.naturalWidth * scale;
    const ih = img.naturalHeight * scale;
    const ox = (W - iw) / 2;
    const oy = (H - ih) / 2;
    const small = document.createElement("canvas");
    const draw = (px: number) => {
      const sw = Math.max(1, Math.ceil(W / (px * dpr)));
      const sh = Math.max(1, Math.ceil(H / (px * dpr)));
      small.width = sw;
      small.height = sh;
      const sctx = small.getContext("2d")!;
      sctx.imageSmoothingEnabled = true;
      sctx.drawImage(img, (ox * sw) / W, (oy * sh) / H, (iw * sw) / W, (ih * sh) / H);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(small, 0, 0, sw, sh, 0, 0, sw * px * dpr, sh * px * dpr);
    };
    let raf = 0;
    let step = -1;
    let start = 0;
    const frame = (now: number) => {
      if (!start) {
        start = now;
        draw(seq[0]);
        setPixel(true);
      }
      const k = Math.floor((now - start) / stepMs);
      if (k >= seq.length) {
        setPixel(false);
        return;
      }
      if (k !== step) {
        step = k;
        draw(seq[k]);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [play, seq, stepMs]);

  return (
    <span ref={ref} className={cx(base, pixel && "is-px", className)}>
      <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} />
      <canvas ref={canvasRef} aria-hidden />
    </span>
  );
}
