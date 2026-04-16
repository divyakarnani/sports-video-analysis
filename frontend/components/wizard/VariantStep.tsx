"use client";

import { Sport, ShotTypeId, ShotTypeVariant } from "@/lib/types";
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
  onSelect: (variantId: string) => void;
  onContinue: () => void;
  onBack: () => void;
  direction: "left" | "right";
}

export default function VariantStep({
  sport,
  categoryId,
  selected,
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
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelect(v.id)}
            className={`card text-center ${
              selected === v.id ? "card-selected" : ""
            }`}
          >
            <div className="font-display text-lg font-bold">{v.label}</div>
          </button>
        ))}
      </div>
    </StepLayout>
  );
}
