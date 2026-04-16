"use client";

function formatLabel(key: string): string {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-accent";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

function barColor(score: number): string {
  if (score >= 80) return "bg-accent";
  if (score >= 60) return "bg-yellow-400";
  return "bg-red-400";
}

export default function ScoreCard({ scores }: { scores: Record<string, number> }) {
  return (
    <div className="space-y-3">
      {Object.entries(scores).map(([key, value]) => (
        <div key={key}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">{formatLabel(key)}</span>
            <span className={`font-mono font-bold ${scoreColor(value)}`}>{value}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all ${barColor(value)}`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
