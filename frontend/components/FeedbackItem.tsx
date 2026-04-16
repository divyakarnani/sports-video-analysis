"use client";

import { FeedbackItem as FeedbackItemType } from "@/lib/types";

export default function FeedbackItem({
  item,
  variant,
}: {
  item: FeedbackItemType;
  variant: "good" | "needs_work" | "drill";
}) {
  const colors = {
    good: "border-accent/30 bg-accent-dim",
    needs_work: "border-orange-500/30 bg-orange-500/5",
    drill: "border-blue-500/30 bg-blue-500/5",
  };

  const icons = {
    good: "\u2713",
    needs_work: "!",
    drill: "\u25B6",
  };

  const iconColors = {
    good: "bg-accent/20 text-accent",
    needs_work: "bg-orange-500/20 text-orange-400",
    drill: "bg-blue-500/20 text-blue-400",
  };

  return (
    <div className={`rounded-lg border p-4 ${colors[variant]}`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${iconColors[variant]}`}
        >
          {icons[variant]}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{item.label}</span>
            {item.timestamp && (
              <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white/50">
                {item.timestamp}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-white/60">{item.description}</p>
        </div>
      </div>
    </div>
  );
}
