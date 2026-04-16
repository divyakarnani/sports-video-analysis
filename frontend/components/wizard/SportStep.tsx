"use client";

import { Sport } from "@/lib/types";
import StepLayout from "./StepLayout";

const SPORTS: { id: Sport; label: string; description: string }[] = [
  { id: "tennis", label: "Tennis", description: "Groundstrokes, serves, volleys & returns" },
  { id: "figure_skating", label: "Figure Skating", description: "Jumps, spins, footwork & spirals" },
  { id: "dance", label: "Dance", description: "Turns, leaps, extensions & partnering" },
];

interface SportStepProps {
  selected: Sport | null;
  onSelect: (sport: Sport) => void;
  onContinue: () => void;
  direction: "left" | "right";
}

export default function SportStep({
  selected,
  onSelect,
  onContinue,
  direction,
}: SportStepProps) {
  return (
    <StepLayout
      headline="FormCheck"
      subline="Upload your form. Compare against the pros. Get feedback in seconds."
      ctaLabel="Continue →"
      ctaDisabled={!selected}
      onCta={onContinue}
      direction={direction}
    >
      <div className="grid grid-cols-3 gap-4">
        {SPORTS.map((sport) => (
          <button
            key={sport.id}
            onClick={() => onSelect(sport.id)}
            className={`card text-left ${
              selected === sport.id ? "card-selected" : ""
            }`}
          >
            <div className="font-display text-lg font-bold">{sport.label}</div>
            <p className="mt-1 text-sm text-white/50">{sport.description}</p>
          </button>
        ))}
      </div>
    </StepLayout>
  );
}
