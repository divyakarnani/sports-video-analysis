"use client";

import { AnalysisResult, PoseFramePair } from "@/lib/types";
import Breadcrumb from "@/components/wizard/Breadcrumb";
import AnalysisResults from "@/components/AnalysisResults";

interface ResultsPhaseProps {
  breadcrumbs: string[];
  result: AnalysisResult;
  poseFrames: PoseFramePair[];
  onStartOver: () => void;
}

export default function ResultsPhase({
  breadcrumbs,
  result,
  poseFrames,
  onStartOver,
}: ResultsPhaseProps) {
  return (
    <div className="step-viewport">
      <div className="mx-auto w-full max-w-5xl">
        <Breadcrumb segments={[...breadcrumbs, "Results"]} />

        <div className="mb-8">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-white/40">
            Analysis
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold">
            Your results
          </h1>
        </div>

        <AnalysisResults result={result} poseFrames={poseFrames} />

        <div className="mt-10 pb-8">
          <button
            onClick={onStartOver}
            className="w-full rounded-xl border-2 border-accent py-3 text-center font-semibold text-accent transition-all hover:bg-accent hover:text-black"
          >
            Analyze another video
          </button>
        </div>
      </div>
    </div>
  );
}
