"use client";

import { Sport, ShotTypeId, CameraAngleId, Pro, VideoAvailability } from "@/lib/types";
import { isProAvailable } from "@/lib/availability";
import { getProsForShotType } from "@/lib/pros";
import { getShotTypeById } from "@/lib/shotTypes";
import StepLayout from "./StepLayout";

const SPORT_LABELS: Record<Sport, string> = {
  tennis: "Tennis",
  figure_skating: "Figure Skating",
  dance: "Dance",
};

interface ProStepProps {
  sport: Sport;
  categoryId: ShotTypeId;
  variantId: string | null;
  variantLabel: string | null;
  cameraAngleId: CameraAngleId | null;
  cameraLabel: string | null;
  selected: Pro | null;
  availability: VideoAvailability | null;
  onSelect: (pro: Pro) => void;
  onContinue: () => void;
  onBack: () => void;
  direction: "left" | "right";
}

export default function ProStep({
  sport,
  categoryId,
  variantId,
  variantLabel,
  cameraAngleId,
  cameraLabel,
  selected,
  availability,
  onSelect,
  onContinue,
  onBack,
  direction,
}: ProStepProps) {
  const pros = getProsForShotType(sport, categoryId, variantId ?? undefined, cameraAngleId ?? undefined);
  const categoryLabel = getShotTypeById(categoryId)?.label ?? categoryId;
  const crumbs = [SPORT_LABELS[sport], categoryLabel];
  if (variantLabel) crumbs.push(variantLabel);
  if (cameraLabel) crumbs.push(cameraLabel);

  const eyebrow = [SPORT_LABELS[sport], categoryLabel, variantLabel]
    .filter(Boolean)
    .join(" · ");

  return (
    <StepLayout
      breadcrumbs={crumbs}
      eyebrow={eyebrow}
      headline="Choose a pro"
      subline="Compare your form against a world-class reference."
      ctaLabel={selected ? `Continue with ${selected.name} →` : "Continue →"}
      ctaDisabled={!selected}
      onCta={onContinue}
      onBack={onBack}
      direction={direction}
    >
      {pros.length === 0 ? (
        <div className="card text-center text-white/40">
          No pros available for this combination yet.
        </div>
      ) : (
        <div className="space-y-3">
          {pros.map((pro) => {
            const available = isProAvailable(availability, sport, categoryId, cameraAngleId, pro.id);
            return (
              <button
                key={pro.id}
                onClick={() => available && onSelect(pro)}
                className={`card flex w-full items-center gap-4 text-left ${
                  selected?.id === pro.id ? "card-selected" : ""
                } ${!available ? "card-disabled" : ""}`}
              >
                {/* Avatar */}
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black"
                  style={{ backgroundColor: pro.avatarColor ?? "#888" }}
                >
                  {pro.initials}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base font-bold">
                      {pro.name}
                    </span>
                    {!available && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/40">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-white/50">{pro.subtitle}</div>
                  {pro.bestFor && (
                    <div className="mt-0.5 text-xs text-accent">{pro.bestFor}</div>
                  )}
                </div>

                {/* Footage indicator */}
                {available && (
                  <div className="flex shrink-0 items-center gap-1.5 text-xs text-white/40">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                    Footage
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </StepLayout>
  );
}
