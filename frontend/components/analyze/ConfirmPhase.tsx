"use client";

import Breadcrumb from "@/components/wizard/Breadcrumb";
import SideBySidePlayer from "@/components/SideBySidePlayer";

interface ConfirmPhaseProps {
  breadcrumbs: string[];
  selections: { label: string; value: string }[];
  videoFile: File;
  referenceVideoUrl: string | null;
  proName: string | null;
  onAnalyze: () => void;
  onBack: () => void;
}

export default function ConfirmPhase({
  breadcrumbs,
  selections,
  videoFile,
  referenceVideoUrl,
  proName,
  onAnalyze,
  onBack,
}: ConfirmPhaseProps) {
  return (
    <div className="step-viewport">
      <div className="mx-auto w-full max-w-5xl animate-slide-left">
        <button
          onClick={onBack}
          className="mb-4 text-sm text-white/40 hover:text-white transition-colors"
        >
          &larr; Back
        </button>
        <Breadcrumb segments={breadcrumbs} />

        <div className="mb-8">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-white/40">
            Confirm
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold">
            Ready to analyze
          </h1>
        </div>

        {/* Selection summary */}
        <div className="mb-6 rounded-xl border border-white/10 bg-surface p-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {selections.map((s) => (
              <div key={s.label}>
                <div className="text-xs font-mono uppercase text-white/40">
                  {s.label}
                </div>
                <div className="mt-0.5 text-sm font-semibold">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Side by side preview */}
        {referenceVideoUrl && proName && (
          <SideBySidePlayer
            videoFile={videoFile}
            referenceVideoUrl={referenceVideoUrl}
            proName={proName}
          />
        )}

        {/* Analyze CTA */}
        <div className="mt-8">
          <button
            onClick={onAnalyze}
            className="w-full rounded-xl bg-accent py-3 text-center font-semibold text-black transition-all hover:brightness-110"
          >
            Run analysis
          </button>
        </div>
      </div>
    </div>
  );
}
