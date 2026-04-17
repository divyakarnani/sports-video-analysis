"use client";

import { Sport, VideoAvailability } from "@/lib/types";
import { isSportAvailable } from "@/lib/availability";
import StepLayout from "./StepLayout";

const SPORTS: { id: Sport; label: string; description: string }[] = [
  { id: "tennis", label: "Tennis", description: "Groundstrokes, serves, volleys & returns" },
  { id: "figure_skating", label: "Figure Skating", description: "Jumps, spins, footwork & spirals" },
  { id: "dance", label: "Dance", description: "Turns, leaps, extensions & partnering" },
];

interface SportStepProps {
  selected: Sport | null;
  availability: VideoAvailability | null;
  onSelect: (sport: Sport) => void;
  onContinue: () => void;
  direction: "left" | "right";
}

export default function SportStep({
  selected,
  availability,
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
        {SPORTS.map((sport) => {
          const available = isSportAvailable(availability, sport.id);
          return (
            <button
              key={sport.id}
              onClick={() => available && onSelect(sport.id)}
              className={`card text-left ${
                selected === sport.id ? "card-selected" : ""
              } ${!available ? "card-disabled" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold">{sport.label}</span>
                {!available && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/40">
                    Coming soon
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-white/50">{sport.description}</p>
            </button>
          );
        })}
      </div>
    </StepLayout>
  );
}
