"use client";

import { useEffect, useCallback, useState } from "react";
import { PoseFramePair } from "@/lib/types";

interface FramePlayerProps {
  frames: PoseFramePair[];
}

export default function FramePlayer({ frames }: FramePlayerProps) {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<"side-by-side" | "ghost">("side-by-side");
  const [playing, setPlaying] = useState(false);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(frames.length - 1, i + 1));
  }, [frames.length]);

  // Arrow key navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") { goPrev(); setPlaying(false); }
      if (e.key === "ArrowRight") { goNext(); setPlaying(false); }
      if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goPrev, goNext]);

  // Auto-play
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setIndex((i) => {
        if (i >= frames.length - 1) { setPlaying(false); return i; }
        return i + 1;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [playing, frames.length]);

  if (frames.length === 0) return null;

  const frame = frames[index];
  const imgSrc =
    mode === "side-by-side"
      ? `data:image/jpeg;base64,${frame.side_by_side_b64}`
      : `data:image/jpeg;base64,${frame.ghost_overlay_b64}`;

  return (
    <div>
      {/* Header row: title + mode toggle */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Frame-by-Frame</h3>
        <div className="flex overflow-hidden rounded-lg border border-white/10">
          <button
            onClick={() => setMode("side-by-side")}
            className={`px-3 py-1 text-xs font-medium transition-colors duration-[120ms] ${
              mode === "side-by-side"
                ? "bg-accent/15 text-accent"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setMode("ghost")}
            className={`px-3 py-1 text-xs font-medium transition-colors duration-[120ms] ${
              mode === "ghost"
                ? "bg-accent/15 text-accent"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            Ghost Overlay
          </button>
        </div>
      </div>

      {/* Main image */}
      <div className="relative overflow-hidden rounded-lg border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgSrc} alt={`Frame ${index + 1}`} className="w-full" />
        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 font-mono text-xs text-white/80">
          You {frame.user_timestamp.toFixed(1)}s &middot; Pro{" "}
          {frame.pro_timestamp.toFixed(1)}s
        </div>
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => { goPrev(); setPlaying(false); }}
          disabled={index === 0}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &larr;
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/10"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <span className="font-mono text-sm text-white/50 tabular-nums">
            {index + 1} / {frames.length}
          </span>
        </div>

        <button
          onClick={() => { goNext(); setPlaying(false); }}
          disabled={index === frames.length - 1}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &rarr;
        </button>
      </div>

      {/* Filmstrip */}
      {frames.length > 1 && (
        <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
          {frames.map((f, i) => (
            <button
              key={f.index}
              onClick={() => { setIndex(i); setPlaying(false); }}
              className={`flex-shrink-0 overflow-hidden rounded border-2 transition-all duration-[120ms] ${
                i === index
                  ? "border-accent"
                  : "border-transparent opacity-40 hover:opacity-70"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/jpeg;base64,${f.ghost_overlay_b64}`}
                alt={`Thumb ${i + 1}`}
                className="h-12 w-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
