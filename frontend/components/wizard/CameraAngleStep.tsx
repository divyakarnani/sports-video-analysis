"use client";

import { Sport, ShotTypeId, CameraAngleId, CameraAngle, VideoAvailability } from "@/lib/types";
import { isAngleAvailable } from "@/lib/availability";
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
  availability: VideoAvailability | null;
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
  availability,
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
        {angles.map((angle) => {
          const available = isAngleAvailable(availability, sport, categoryId, angle.id);
          return (
            <button
              key={angle.id}
              onClick={() => available && onSelect(angle.id)}
              className={`card text-left ${
                selected === angle.id ? "card-selected" : ""
              } ${!available ? "card-disabled" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold">{angle.label}</span>
                {!available && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/40">
                    Coming soon
                  </span>
                )}
              </div>
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
          );
        })}
      </div>
    </StepLayout>
  );
}
