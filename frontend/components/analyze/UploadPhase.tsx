"use client";

import { Sport, CameraAngleId } from "@/lib/types";
import { getFilmingTips } from "@/lib/filmingTips";
import Breadcrumb from "@/components/wizard/Breadcrumb";
import VideoUpload from "@/components/VideoUpload";

interface UploadPhaseProps {
  breadcrumbs: string[];
  sport: Sport;
  shotTypeId: string;
  variantId: string | null;
  cameraAngleId: string | null;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onContinue: () => void;
}

export default function UploadPhase({
  breadcrumbs,
  sport,
  shotTypeId,
  variantId,
  cameraAngleId,
  file,
  onFileSelect,
  onContinue,
}: UploadPhaseProps) {
  const defaultAngle = sport === "tennis" ? "side_on" : "front";
  const tips = getFilmingTips(
    sport,
    shotTypeId,
    variantId,
    cameraAngleId ?? defaultAngle
  );

  return (
    <div className="step-viewport">
      <div className="mx-auto w-full max-w-3xl animate-slide-left">
        <Breadcrumb segments={breadcrumbs} />

        <div className="mb-8">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-white/40">
            Upload
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold">
            Upload your video
          </h1>
          <p className="mt-2 text-white/50">
            Record yourself performing the move, then drop the file below.
          </p>
        </div>

        {/* Filming tips */}
        <div className="mb-6 rounded-xl border border-white/10 bg-surface p-5">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-accent">
            Filming tips
          </h3>
          <ul className="mt-3 space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Upload component */}
        <VideoUpload file={file} onFileSelect={onFileSelect} />

        {/* Continue */}
        <div className="mt-8">
          <button
            onClick={onContinue}
            disabled={!file}
            className={`w-full rounded-xl py-3 text-center font-semibold transition-all duration-[120ms] ${
              !file
                ? "cursor-not-allowed bg-white/10 text-white/30"
                : "bg-accent text-black hover:brightness-110"
            }`}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
