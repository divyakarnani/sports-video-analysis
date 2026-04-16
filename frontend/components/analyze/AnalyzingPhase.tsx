"use client";

const STATUS_MESSAGES: Record<string, string> = {
  reading_video: "Reading video",
  extracting_frames: "Extracting your frames",
  user_frames_extracted: "Your frames extracted",
  extracting_pro_frames: "Extracting reference frames",
  pro_frames_extracted: "Reference frames extracted",
  estimating_poses: "Estimating body poses",
  poses_complete: "Pose estimation complete",
  analyzing: "Analyzing your form",
};

interface AnalyzingPhaseProps {
  status: string;
  frameCount: number | null;
}

export default function AnalyzingPhase({
  status,
  frameCount,
}: AnalyzingPhaseProps) {
  return (
    <div className="step-viewport items-center justify-center">
      <div className="mx-auto w-full max-w-2xl text-center">
        {/* Scan-line containers */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-surface border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-sm text-white/20 uppercase tracking-wider">
                Your video
              </span>
            </div>
            <div className="scan-line" />
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl bg-surface border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-sm text-white/20 uppercase tracking-wider">
                Reference
              </span>
            </div>
            <div className="scan-line" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>

        {/* Status text */}
        <div className="font-mono text-sm text-accent">
          {STATUS_MESSAGES[status] || status}
          <span className="animate-pulse">...</span>
        </div>
        {frameCount && (
          <div className="mt-1 font-mono text-xs text-white/40">
            {frameCount} frames extracted
          </div>
        )}
      </div>
    </div>
  );
}
