"use client";

import { Suspense, useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sport, ShotTypeId, AnalysisResult, PoseFramePair } from "@/lib/types";
import { PROS } from "@/lib/pros";
import { analyzeVideo } from "@/lib/api";
import { getShotTypeById } from "@/lib/shotTypes";
import { getCameraAnglesForSport } from "@/lib/cameraAngles";
import UploadPhase from "@/components/analyze/UploadPhase";
import ConfirmPhase from "@/components/analyze/ConfirmPhase";
import AnalyzingPhase from "@/components/analyze/AnalyzingPhase";
import ResultsPhase from "@/components/analyze/ResultsPhase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SPORT_LABELS: Record<Sport, string> = {
  tennis: "Tennis",
  figure_skating: "Figure Skating",
  dance: "Dance",
};

type Phase = "upload" | "confirm" | "analyzing" | "results";

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sport = searchParams.get("sport") as Sport | null;
  const shotTypeId = searchParams.get("shot_type") as ShotTypeId | null;
  const proId = searchParams.get("pro"); // null for dance/skating
  const variantId = searchParams.get("variant");
  const cameraAngleId = searchParams.get("camera");

  const pro = proId ? PROS.find((p) => p.id === proId) ?? null : null;
  const shotType = shotTypeId ? getShotTypeById(shotTypeId) : null;
  const variantLabel = variantId
    ? shotType?.variants?.find((v) => v.id === variantId)?.label ?? null
    : null;
  const cameraLabel = cameraAngleId && sport
    ? getCameraAnglesForSport(sport).find((a) => a.id === cameraAngleId)?.label ?? null
    : null;

  const hasPro = !!pro;

  // For tennis: /reference-video/{sport}/{shot_type}/{angle}/{pro_id}
  // For dance/skating: /reference-video/{sport}/{shot_type}/front/{variant_or_shot_type}
  const referenceVideoId = hasPro
    ? proId
    : variantId ?? shotTypeId;
  const referenceAngle = hasPro
    ? (cameraAngleId ?? "side_on")
    : "front";
  const referenceVideoUrl =
    sport && shotTypeId && referenceVideoId
      ? `${API_URL}/reference-video/${sport}/${shotTypeId}/${referenceAngle}/${referenceVideoId}`
      : null;

  // Label for the reference panel in side-by-side
  const referenceLabel = hasPro
    ? pro!.name
    : variantLabel ?? shotType?.label ?? "Reference";

  // Build breadcrumbs
  const breadcrumbs: string[] = [];
  if (sport) breadcrumbs.push(SPORT_LABELS[sport]);
  if (shotType) breadcrumbs.push(shotType.label);
  if (variantLabel) breadcrumbs.push(variantLabel);
  if (cameraLabel) breadcrumbs.push(cameraLabel);
  if (pro) breadcrumbs.push(pro.name);

  // Build selection summary for confirm phase
  const selectionSummary: { label: string; value: string }[] = [];
  if (sport) selectionSummary.push({ label: "Sport", value: SPORT_LABELS[sport] });
  if (shotType) selectionSummary.push({ label: "Category", value: shotType.label });
  if (variantLabel) selectionSummary.push({ label: "Variant", value: variantLabel });
  if (cameraLabel) selectionSummary.push({ label: "Camera", value: cameraLabel });
  if (pro) selectionSummary.push({ label: "Pro", value: pro.name });

  const [phase, setPhase] = useState<Phase>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("reading_video");
  const [frameCount, setFrameCount] = useState<number | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [poseFrames, setPoseFrames] = useState<PoseFramePair[]>([]);

  const handleAnalyze = useCallback(async () => {
    if (!file || !sport || !shotTypeId) return;
    setPhase("analyzing");
    setResult(null);
    setError(null);
    setPoseFrames([]);
    setStatus("reading_video");
    setFrameCount(null);

    await analyzeVideo(
      file,
      sport,
      shotTypeId,
      proId ?? "",
      (s, detail) => {
        setStatus(s);
        if (detail?.count) setFrameCount(detail.count as number);
        if (detail?.frame_count) setFrameCount(detail.frame_count as number);
      },
      (r) => {
        setResult(r);
        setPhase("results");
      },
      (err) => {
        setError(err);
        setPhase("upload");
      },
      (pair) => {
        setPoseFrames((prev) => [...prev, pair]);
      },
      cameraAngleId ?? (sport === "tennis" ? undefined : "front"),
      variantId ?? undefined,
    );
  }, [file, sport, shotTypeId, proId, cameraAngleId, variantId]);

  if (!sport || !shotTypeId) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-white/50">Missing sport or shot type selection.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 text-sm underline text-white/40 hover:text-white"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  switch (phase) {
    case "upload":
      return (
        <>
          <UploadPhase
            breadcrumbs={breadcrumbs}
            sport={sport}
            shotTypeId={shotTypeId}
            variantId={variantId}
            cameraAngleId={cameraAngleId}
            file={file}
            onFileSelect={setFile}
            onContinue={() => setPhase("confirm")}
          />
          {error && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </>
      );

    case "confirm":
      return (
        <ConfirmPhase
          breadcrumbs={breadcrumbs}
          selections={selectionSummary}
          videoFile={file!}
          referenceVideoUrl={referenceVideoUrl}
          proName={referenceLabel}
          onAnalyze={handleAnalyze}
          onBack={() => setPhase("upload")}
        />
      );

    case "analyzing":
      return (
        <AnalyzingPhase
          status={status}
          frameCount={frameCount}
        />
      );

    case "results":
      return (
        <ResultsPhase
          breadcrumbs={breadcrumbs}
          result={result!}
          poseFrames={poseFrames}
          onStartOver={() => router.push("/")}
        />
      );
  }
}

export default function AnalyzePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <div className="font-mono text-sm text-accent animate-pulse">
            Loading...
          </div>
        </main>
      }
    >
      <AnalyzeContent />
    </Suspense>
  );
}
