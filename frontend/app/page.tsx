"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sport, ShotTypeId, CameraAngleId, Pro, WizardStep, WizardSelections, VideoAvailability } from "@/lib/types";
import { fetchAvailability } from "@/lib/api";
import { getShotTypeById } from "@/lib/shotTypes";
import { getCameraAnglesForSport } from "@/lib/cameraAngles";
import SportStep from "@/components/wizard/SportStep";
import CategoryStep from "@/components/wizard/CategoryStep";
import VariantStep from "@/components/wizard/VariantStep";
import CameraAngleStep from "@/components/wizard/CameraAngleStep";
import ProStep from "@/components/wizard/ProStep";

/** Only tennis gets the camera angle + pro steps */
const PRO_SPORTS: Sport[] = ["tennis"];

export default function Home() {
  const router = useRouter();

  const [selections, setSelections] = useState<WizardSelections>({
    sport: null,
    category: null,
    variant: null,
    cameraAngle: null,
    pro: null,
  });

  const [currentStep, setCurrentStep] = useState<WizardStep>("sport");
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [availability, setAvailability] = useState<VideoAvailability | null>(null);

  useEffect(() => {
    fetchAvailability().then(setAvailability);
  }, []);

  const hasPro = selections.sport ? PRO_SPORTS.includes(selections.sport) : false;

  // Compute the step sequence based on sport + category
  const stepSequence = useMemo<WizardStep[]>(() => {
    const base: WizardStep[] = ["sport", "category"];
    if (selections.category) {
      const shotType = getShotTypeById(selections.category);
      if (shotType?.variants && shotType.variants.length > 0) {
        base.push("variant");
      }
    }
    if (selections.sport && PRO_SPORTS.includes(selections.sport)) {
      base.push("camera", "pro");
    }
    return base;
  }, [selections.category, selections.sport]);

  function goForward() {
    const idx = stepSequence.indexOf(currentStep);
    if (idx < stepSequence.length - 1) {
      setDirection("left");
      setCurrentStep(stepSequence[idx + 1]);
    }
  }

  function goBack() {
    const idx = stepSequence.indexOf(currentStep);
    if (idx > 0) {
      setDirection("right");
      setCurrentStep(stepSequence[idx - 1]);
    }
  }

  // Helper to get labels for breadcrumbs
  const shotType = selections.category ? getShotTypeById(selections.category) : null;
  const variantLabel = selections.variant
    ? shotType?.variants?.find((v) => v.id === selections.variant)?.label ?? null
    : null;
  const cameraLabel = selections.cameraAngle
    ? getCameraAnglesForSport(selections.sport!).find((a) => a.id === selections.cameraAngle)?.label ?? null
    : null;

  /** Navigate to /analyze — works with or without pro */
  function navigateToAnalyze() {
    if (!selections.sport || !selections.category) return;
    const params = new URLSearchParams({
      sport: selections.sport,
      shot_type: selections.category,
    });
    if (selections.pro) params.set("pro", selections.pro.id);
    if (selections.variant) params.set("variant", selections.variant);
    if (selections.cameraAngle) params.set("camera", selections.cameraAngle);
    router.push(`/analyze?${params.toString()}`);
  }

  /** Final CTA for the last step in the sequence */
  function handleLastStepContinue() {
    navigateToAnalyze();
  }

  switch (currentStep) {
    case "sport":
      return (
        <SportStep
          selected={selections.sport}
          availability={availability}
          onSelect={(sport) =>
            setSelections((s) => ({
              ...s,
              sport,
              category: null,
              variant: null,
              cameraAngle: null,
              pro: null,
            }))
          }
          onContinue={goForward}
          direction={direction}
        />
      );

    case "category": {
      // For non-pro sports, this or the variant step is the last step
      const isLastStep = !hasPro && (!shotType?.variants || shotType.variants.length === 0);
      return (
        <CategoryStep
          sport={selections.sport!}
          selected={selections.category}
          availability={availability}
          onSelect={(id) =>
            setSelections((s) => ({
              ...s,
              category: id,
              variant: null,
              cameraAngle: null,
              pro: null,
            }))
          }
          onContinue={isLastStep ? handleLastStepContinue : goForward}
          onBack={goBack}
          direction={direction}
        />
      );
    }

    case "variant": {
      const isLastStep = !hasPro;
      return (
        <VariantStep
          sport={selections.sport!}
          categoryId={selections.category!}
          selected={selections.variant}
          availability={availability}
          onSelect={(variantId) =>
            setSelections((s) => ({
              ...s,
              variant: variantId,
              cameraAngle: null,
              pro: null,
            }))
          }
          onContinue={isLastStep ? handleLastStepContinue : goForward}
          onBack={goBack}
          direction={direction}
        />
      );
    }

    case "camera":
      return (
        <CameraAngleStep
          sport={selections.sport!}
          categoryId={selections.category!}
          variantLabel={variantLabel}
          selected={selections.cameraAngle}
          availability={availability}
          onSelect={(id) =>
            setSelections((s) => ({
              ...s,
              cameraAngle: id,
              pro: null,
            }))
          }
          onContinue={goForward}
          onBack={goBack}
          direction={direction}
        />
      );

    case "pro":
      return (
        <ProStep
          sport={selections.sport!}
          categoryId={selections.category!}
          variantId={selections.variant}
          variantLabel={variantLabel}
          cameraAngleId={selections.cameraAngle}
          cameraLabel={cameraLabel}
          selected={selections.pro}
          availability={availability}
          onSelect={(pro) => setSelections((s) => ({ ...s, pro }))}
          onContinue={handleLastStepContinue}
          onBack={goBack}
          direction={direction}
        />
      );
  }
}
