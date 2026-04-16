"use client";

import { useState } from "react";
import { FeedbackItem, PoseFramePair } from "@/lib/types";

interface TimelineProps {
  good: FeedbackItem[];
  needsWork: FeedbackItem[];
  poseFrames?: PoseFramePair[];
}

function parseTimestamp(ts?: string): number | null {
  if (!ts) return null;
  const parts = ts.replace("s", "").split(":");
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseFloat(parts[1]);
  }
  return parseFloat(parts[0]);
}

function assignFrames(
  items: { timestamp?: string }[],
  poseFrames: PoseFramePair[]
): (PoseFramePair | null)[] {
  if (!poseFrames || poseFrames.length === 0) {
    return items.map(() => null);
  }

  const parsed: { idx: number; seconds: number }[] = [];
  for (let i = 0; i < items.length; i++) {
    const s = parseTimestamp(items[i].timestamp);
    if (s !== null) parsed.push({ idx: i, seconds: s });
  }
  parsed.sort((a, b) => a.seconds - b.seconds);

  const sortedFrames = [...poseFrames].sort(
    (a, b) => a.user_timestamp - b.user_timestamp
  );

  const result: (PoseFramePair | null)[] = items.map(() => null);
  const usedFrames = new Set<number>();

  for (const { idx, seconds } of parsed) {
    let bestFrame: PoseFramePair | null = null;
    let bestDist = Infinity;
    let bestFrameIdx = -1;

    for (let fi = 0; fi < sortedFrames.length; fi++) {
      if (usedFrames.has(fi)) continue;
      const dist = Math.abs(sortedFrames[fi].user_timestamp - seconds);
      if (dist < bestDist) {
        bestDist = dist;
        bestFrame = sortedFrames[fi];
        bestFrameIdx = fi;
      }
    }

    if (bestFrame && bestFrameIdx >= 0) {
      result[idx] = bestFrame;
      usedFrames.add(bestFrameIdx);
    }
  }

  return result;
}

function TimelineItem({
  item,
  type,
  showLine,
  frame,
}: {
  item: FeedbackItem;
  type: "good" | "needs_work";
  showLine: boolean;
  frame: PoseFramePair | null;
}) {
  const [mode, setMode] = useState<"side-by-side" | "ghost">("side-by-side");

  return (
    <div className="flex gap-4">
      {/* Dot + line */}
      <div className="flex flex-col items-center">
        <div
          className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
            type === "good" ? "bg-accent" : "bg-orange-400"
          }`}
        />
        {showLine && <div className="w-px flex-1 bg-white/10" />}
      </div>

      {/* Content */}
      <div className="pb-6 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-white/40">
            {item.timestamp}
          </span>
          <span className="text-sm font-medium">{item.label}</span>
        </div>
        <p className="mt-0.5 text-sm text-white/50">{item.description}</p>

        {/* Inline pose frame */}
        {frame && (
          <div className="mt-3">
            <div className="flex items-center gap-1 mb-1.5">
              <button
                onClick={() => setMode("side-by-side")}
                className={`rounded px-2 py-0.5 text-[11px] transition-colors duration-[120ms] ${
                  mode === "side-by-side"
                    ? "bg-accent/15 text-accent"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setMode("ghost")}
                className={`rounded px-2 py-0.5 text-[11px] transition-colors duration-[120ms] ${
                  mode === "ghost"
                    ? "bg-accent/15 text-accent"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                Overlay
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/jpeg;base64,${
                mode === "side-by-side"
                  ? frame.side_by_side_b64
                  : frame.ghost_overlay_b64
              }`}
              alt={`Pose at ${item.timestamp}`}
              className="w-full rounded-lg border border-white/10"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Timeline({
  good,
  needsWork,
  poseFrames,
}: TimelineProps) {
  const allItems = [
    ...good.map((item) => ({ ...item, type: "good" as const })),
    ...needsWork.map((item) => ({ ...item, type: "needs_work" as const })),
  ]
    .filter((item) => item.timestamp)
    .sort((a, b) => {
      const ta = parseTimestamp(a.timestamp);
      const tb = parseTimestamp(b.timestamp);
      if (ta === null || tb === null) return 0;
      return ta - tb;
    });

  if (allItems.length === 0) return null;

  const frameAssignments = assignFrames(allItems, poseFrames ?? []);

  return (
    <div className="space-y-0">
      {allItems.map((item, i) => (
        <TimelineItem
          key={i}
          item={item}
          type={item.type}
          showLine={i < allItems.length - 1}
          frame={frameAssignments[i]}
        />
      ))}
    </div>
  );
}
