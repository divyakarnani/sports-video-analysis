"use client";

import { Sport, ShotTypeId, ShotTypeCategory } from "@/lib/types";
import { getShotTypeCategoriesForSport } from "@/lib/shotTypes";
import StepLayout from "./StepLayout";

const SPORT_LABELS: Record<Sport, string> = {
  tennis: "Tennis",
  figure_skating: "Figure Skating",
  dance: "Dance",
};

interface CategoryStepProps {
  sport: Sport;
  selected: ShotTypeId | null;
  onSelect: (id: ShotTypeId) => void;
  onContinue: () => void;
  onBack: () => void;
  direction: "left" | "right";
}

export default function CategoryStep({
  sport,
  selected,
  onSelect,
  onContinue,
  onBack,
  direction,
}: CategoryStepProps) {
  const categories = getShotTypeCategoriesForSport(sport);

  return (
    <StepLayout
      breadcrumbs={[SPORT_LABELS[sport]]}
      eyebrow={SPORT_LABELS[sport]}
      headline="Choose a category"
      subline="What would you like to work on?"
      ctaLabel="Continue →"
      ctaDisabled={!selected}
      onCta={onContinue}
      onBack={onBack}
      direction={direction}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`card text-left ${
              selected === cat.id ? "card-selected" : ""
            }`}
          >
            <div className="font-display text-lg font-bold">{cat.label}</div>
            {cat.variants && (
              <p className="mt-1 text-xs text-white/40">
                {cat.variants.map((v) => v.label).join(", ")}
              </p>
            )}
          </button>
        ))}
      </div>
    </StepLayout>
  );
}
