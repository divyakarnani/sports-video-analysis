export type Sport = "tennis" | "figure_skating" | "dance";

export type ShotTypeId =
  // Tennis
  | "forehand"
  | "backhand"
  | "serve"
  | "volley"
  | "return"
  // Figure skating
  | "jumps"
  | "spins"
  | "footwork_sequence"
  | "spiral_sequence"
  // Dance
  | "turns"
  | "leaps"
  | "extensions"
  | "floor_work"
  | "partnering";

export interface ShotTypeVariant {
  id: string;
  label: string;
}

export interface ShotTypeCategory {
  id: ShotTypeId;
  label: string;
  variants?: ShotTypeVariant[];
}

export interface ShotTypeDefinition {
  id: ShotTypeId;
  label: string;
  sport: Sport;
  category?: string;
  variants?: ShotTypeVariant[];
  dimensions: string[];
  keyConcepts: string;
}

export interface Pro {
  id: string;
  name: string;
  sport: Sport;
  subtitle: string;
  initials: string;
  shotTypes: string[];
  avatarColor?: string;
  bestFor?: string;
  variantAvailability?: Record<string, string[]>;
  /** Which angles each shot type has footage for: { forehand: ["side_on", "behind"] } */
  angleAvailability?: Record<string, string[]>;
  hasFootage?: boolean;
}

export interface FeedbackItem {
  label: string;
  description: string;
  timestamp?: string;
}

export interface AnalysisResult {
  scores: Record<string, number>;
  good: FeedbackItem[];
  needs_work: FeedbackItem[];
  drills: FeedbackItem[];
  summary: string;
}

export interface PoseFramePair {
  index: number;
  user_timestamp: number;
  pro_timestamp: number;
  side_by_side_b64: string;
  ghost_overlay_b64: string;
}

// --- Wizard types ---

export type CameraAngleId = "side_on" | "behind" | "front" | "elevated";

export interface CameraAngle {
  id: CameraAngleId;
  label: string;
  description: string;
  bestFor: string[];
  sport: Sport;
}

/** sport → shot_type → angle → video_id[] */
export type VideoAvailability = Record<string, Record<string, Record<string, string[]>>>;

export type WizardStep = "sport" | "category" | "variant" | "camera" | "pro";

export interface WizardSelections {
  sport: Sport | null;
  category: ShotTypeId | null;
  variant: string | null;
  cameraAngle: CameraAngleId | null;
  pro: Pro | null;
}
