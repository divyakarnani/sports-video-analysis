"use client";

import { Sport, ShotTypeId, ShotTypeVariant, VideoAvailability } from "@/lib/types";
import { isVariantAvailable } from "@/lib/availability";
import { getShotTypeById } from "@/lib/shotTypes";
import StepLayout from "./StepLayout";

const SPORT_LABELS: Record<Sport, string> = {
  tennis: "Tennis",
  figure_skating: "Figure Skating",
  dance: "Dance",
};

interface VariantStepProps {
  sport: Sport;
  categoryId: ShotTypeId;
  selected: string | null;
  availability: VideoAvailability | null;
  onSelect: (variantId: string) => void;
  onContinue: () => void;
  onBack: () => void;
  direction: "left" | "right";
}

export default function VariantStep({
  sport,
  categoryId,
  selected,
  availability,
  onSelect,
  onContinue,
  onBack,
  direction,
}: VariantStepProps) {
  const shotType = getShotTypeById(categoryId);
  const variants: ShotTypeVariant[] = shotType?.variants ?? [];
  const categoryLabel = shotType?.label ?? categoryId;

  return (
    <StepLayout
      breadcrumbs={[SPORT_LABELS[sport], categoryLabel]}
      eyebrow={`${SPORT_LABELS[sport]} · ${categoryLabel}`}
      headline="Pick a variant"
      subline="Which specific technique are you practicing?"
      ctaLabel="Continue →"
      ctaDisabled={!selected}
      onCta={onContinue}
      onBack={onBack}
      direction={direction}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {variants.map((v) => {
          const available = isVariantAvailable(availability, sport, categoryId);
          return (
            <button
              key={v.id}
              onClick={() => available && onSelect(v.id)}
              className={`card text-center ${
                selected === v.id ? "card-selected" : ""
              } ${!available ? "card-disabled" : ""}`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="font-display text-lg font-bold">{v.label}</span>
                {!available && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/40">
                    Coming soon
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </StepLayout>
  );
}
