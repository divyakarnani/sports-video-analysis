"use client";

import Breadcrumb from "./Breadcrumb";

interface StepLayoutProps {
  breadcrumbs?: string[];
  eyebrow?: string;
  headline: string;
  subline?: string;
  ctaLabel?: string;
  ctaDisabled?: boolean;
  onCta?: () => void;
  onBack?: () => void;
  direction?: "left" | "right";
  children: React.ReactNode;
}

export default function StepLayout({
  breadcrumbs,
  eyebrow,
  headline,
  subline,
  ctaLabel,
  ctaDisabled,
  onCta,
  onBack,
  direction = "left",
  children,
}: StepLayoutProps) {
  return (
    <div className="step-viewport">
      {/* Top row: back + breadcrumb */}
      <div className="mx-auto w-full max-w-3xl">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 text-sm text-white/40 hover:text-white transition-colors"
          >
            &larr; Back
          </button>
        )}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb segments={breadcrumbs} />
        )}
      </div>

      {/* Content area with slide animation */}
      <div
        className={`mx-auto flex w-full max-w-3xl flex-1 flex-col ${
          direction === "left" ? "animate-slide-left" : "animate-slide-right"
        }`}
      >
        {/* Header */}
        <div className="mb-8">
          {eyebrow && (
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-white/40">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-1 font-display text-4xl font-bold">{headline}</h1>
          {subline && (
            <p className="mt-2 text-white/50">{subline}</p>
          )}
        </div>

        {/* Card area */}
        <div className="flex-1">{children}</div>

        {/* CTA */}
        {ctaLabel && onCta && (
          <div className="mt-8 pb-4">
            <button
              onClick={onCta}
              disabled={ctaDisabled}
              className={`w-full rounded-xl py-3 text-center font-semibold transition-all duration-[120ms] ${
                ctaDisabled
                  ? "cursor-not-allowed bg-white/10 text-white/30"
                  : "bg-accent text-black hover:brightness-110"
              }`}
            >
              {ctaLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
