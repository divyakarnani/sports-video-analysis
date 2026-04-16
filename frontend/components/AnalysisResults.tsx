"use client";

import { AnalysisResult, PoseFramePair } from "@/lib/types";
import FeedbackItem from "./FeedbackItem";
import FramePlayer from "./FramePlayer";
import ScoreCard from "./ScoreCard";
import Timeline from "./Timeline";

export default function AnalysisResults({
  result,
  poseFrames,
}: {
  result: AnalysisResult;
  poseFrames?: PoseFramePair[];
}) {
  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="rounded-xl border border-white/10 bg-surface p-6">
        <h3 className="mb-2 font-display text-lg font-semibold">Summary</h3>
        <p className="text-sm leading-relaxed text-white/70">{result.summary}</p>
      </div>

      {/* Scores */}
      <div className="rounded-xl border border-white/10 bg-surface p-6">
        <h3 className="mb-4 font-display text-lg font-semibold">Scores</h3>
        <ScoreCard scores={result.scores} />
      </div>

      {/* Frame-by-Frame Player */}
      {poseFrames && poseFrames.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-surface p-6">
          <FramePlayer frames={poseFrames} />
        </div>
      )}

      {/* Timeline */}
      <div className="rounded-xl border border-white/10 bg-surface p-6">
        <h3 className="mb-4 font-display text-lg font-semibold">Timeline</h3>
        <Timeline
          good={result.good}
          needsWork={result.needs_work}
          poseFrames={poseFrames}
        />
      </div>

      {/* Strengths */}
      <div>
        <h3 className="mb-3 font-display text-lg font-semibold text-accent">
          What you&apos;re doing well
        </h3>
        <div className="space-y-3">
          {result.good.map((item, i) => (
            <FeedbackItem key={i} item={item} variant="good" />
          ))}
        </div>
      </div>

      {/* Needs Work */}
      <div>
        <h3 className="mb-3 font-display text-lg font-semibold text-orange-400">
          Needs improvement
        </h3>
        <div className="space-y-3">
          {result.needs_work.map((item, i) => (
            <FeedbackItem key={i} item={item} variant="needs_work" />
          ))}
        </div>
      </div>

      {/* Drills */}
      <div>
        <h3 className="mb-3 font-display text-lg font-semibold text-blue-400">
          Recommended drills
        </h3>
        <div className="space-y-3">
          {result.drills.map((item, i) => (
            <FeedbackItem key={i} item={item} variant="drill" />
          ))}
        </div>
      </div>
    </div>
  );
}
