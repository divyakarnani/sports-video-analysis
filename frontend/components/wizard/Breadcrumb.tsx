"use client";

export default function Breadcrumb({ segments }: { segments: string[] }) {
  if (segments.length === 0) return null;

  return (
    <div className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="inline-block h-1 w-1 rounded-full bg-accent" />}
          <span className={i === segments.length - 1 ? "text-white" : ""}>
            {seg}
          </span>
        </span>
      ))}
    </div>
  );
}
