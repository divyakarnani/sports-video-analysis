"use client";

import { Sport, ShotTypeId, CameraAngleId, CameraAngle } from "@/lib/types";
import { getCameraAnglesForSport } from "@/lib/cameraAngles";
import { getShotTypeById } from "@/lib/shotTypes";
import StepLayout from "./StepLayout";

const SPORT_LABELS: Record<Sport, string> = {
  tennis: "Tennis",
  figure_skating: "Figure Skating",
  dance: "Dance",
};

interface CameraAngleStepProps {
  sport: Sport;
  categoryId: ShotTypeId;
  variantLabel: string | null;
  selected: CameraAngleId | null;
  onSelect: (id: CameraAngleId) => void;
  onContinue: () => void;
  onBack: () => void;
  direction: "left" | "right";
}

export default function CameraAngleStep({
  sport,
  categoryId,
  variantLabel,
  selected,
  onSelect,
  onContinue,
  onBack,
  direction,
}: CameraAngleStepProps) {
  const angles = getCameraAnglesForSport(sport);
  const categoryLabel = getShotTypeById(categoryId)?.label ?? categoryId;
  const crumbs = [SPORT_LABELS[sport], categoryLabel];
  if (variantLabel) crumbs.push(variantLabel);

  const eyebrow = crumbs.join(" · ");

  return (
    <StepLayout
      breadcrumbs={crumbs}
      eyebrow={eyebrow}
      headline="Camera angle"
      subline="How are you filming? This helps us give better feedback."
      ctaLabel="Continue →"
      ctaDisabled={!selected}
      onCta={onContinue}
      onBack={onBack}
      direction={direction}
    >
      <div className="grid grid-cols-2 gap-4">
        {angles.map((angle) => (
          <button
            key={angle.id}
            onClick={() => onSelect(angle.id)}
            className={`card text-left ${
              selected === angle.id ? "card-selected" : ""
            }`}
          >
            <div className="font-display text-lg font-bold">{angle.label}</div>
            <p className="mt-1 text-sm text-white/50">{angle.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {angle.bestFor.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-dim px-2.5 py-0.5 text-xs font-medium text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </StepLayout>
  );
}
