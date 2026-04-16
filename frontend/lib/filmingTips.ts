import { CameraAngleId, Sport } from "./types";

interface FilmingTipEntry {
  tips: string[];
}

// Key format: sport|shotTypeId|variantId|cameraAngleId
// Use "*" as wildcard for variant
const TIPS_MAP: Record<string, FilmingTipEntry> = {
  // ── Tennis: Forehand ──
  "tennis|forehand|topspin|side_on": {
    tips: [
      "Position camera at waist height, 3-4 meters from the baseline",
      "Capture the full swing from take-back to follow-through",
      "Ensure your feet and racket are both visible in the frame",
      "Film 3-5 consecutive forehands for the best comparison",
    ],
  },
  "tennis|forehand|topspin|behind": {
    tips: [
      "Stand 3-4 meters behind the player, centered on them",
      "Camera at shoulder height to capture the racket path",
      "Ensure the contact point and net are both visible",
      "Try to capture the full follow-through over the shoulder",
    ],
  },
  "tennis|forehand|flat|side_on": {
    tips: [
      "Camera at waist height to capture the flat swing plane",
      "Stand perpendicular to the baseline for the best angle",
      "Make sure full body and racket are in frame throughout",
      "Film in good lighting — shadows can obscure the racket face",
    ],
  },
  "tennis|forehand|slice|side_on": {
    tips: [
      "Position camera slightly lower to capture the open racket face",
      "Ensure the high-to-low swing path is clearly visible",
      "Stand far enough back to see the full body and footwork",
      "Film from the dominant-arm side for the best view",
    ],
  },

  // ── Tennis: Backhand ──
  "tennis|backhand|*|side_on": {
    tips: [
      "Film from the backhand side to capture the full swing",
      "Camera at waist height, perpendicular to baseline",
      "Ensure both hands and the racket are clearly visible",
      "Capture 3-5 backhands in a row for best AI analysis",
    ],
  },
  "tennis|backhand|*|behind": {
    tips: [
      "Stand behind the player, slightly to the backhand side",
      "Focus on capturing shoulder turn and hip rotation",
      "Make sure the contact point ahead of the body is visible",
      "Camera at shoulder height for the best overhead view",
    ],
  },

  // ── Tennis: Serve ──
  "tennis|serve|*|side_on": {
    tips: [
      "Stand to the side, 4-5 meters away from the server",
      "Camera at ground level to capture the full trophy position and leg drive",
      "Ensure the toss, contact point, and landing are all in frame",
      "Film at least 3 serves for the most accurate comparison",
    ],
  },
  "tennis|serve|*|behind": {
    tips: [
      "Position camera directly behind the server, centered",
      "Capture the toss placement relative to the body",
      "Ensure the pronation at contact is visible",
      "Stand far enough back to see the full service motion",
    ],
  },

  // ── Tennis: Volley ──
  "tennis|volley|*|side_on": {
    tips: [
      "Camera at net height, perpendicular to the player",
      "Capture the split step and forward movement",
      "Ensure the short backswing and punch are visible",
      "Film from close enough to see wrist and racket face angle",
    ],
  },

  // ── Tennis: Return ──
  "tennis|return|*|behind": {
    tips: [
      "Stand behind the returner for the best view of reaction",
      "Capture the split step timing as the serve is hit",
      "Ensure the compact backswing is visible",
      "Film from far enough to see the full body position",
    ],
  },

  // ── Figure Skating: Jumps ──
  "figure_skating|jumps|axel|side_on": {
    tips: [
      "Position at ice level, 5-6 meters from the jump path",
      "Capture the forward entry edge and takeoff",
      "Ensure the full air rotation and landing are in frame",
      "Film in slow-motion (120fps+) if your phone supports it",
    ],
  },
  "figure_skating|jumps|*|side_on": {
    tips: [
      "Camera at ice level to capture jump height and air position",
      "Stand perpendicular to the jump trajectory",
      "Make sure entry edge, takeoff, rotation, and landing are all visible",
      "Slow-motion recording helps the AI analyze rotation speed",
    ],
  },
  "figure_skating|jumps|*|elevated": {
    tips: [
      "Film from the stands or an elevated platform",
      "Capture the full approach pattern and landing curve",
      "Ensure the skater stays in frame through the entire jump",
      "Elevated angle is best for seeing takeoff edge quality",
    ],
  },

  // ── Figure Skating: Spins ──
  "figure_skating|spins|*|side_on": {
    tips: [
      "Position at ice level, 3-4 meters from the spin location",
      "Capture the full wind-up entry through the exit",
      "Hold the camera steady — spinning motions amplify shake",
      "Ensure you can see the free leg and arm positions clearly",
    ],
  },
  "figure_skating|spins|*|elevated": {
    tips: [
      "Elevated angle is ideal for judging spin centering",
      "Film from above to see if the skater drifts on the ice",
      "Capture the full spin from entry to exit",
      "Make sure body position changes are visible from above",
    ],
  },

  // ── Figure Skating: Footwork ──
  "figure_skating|footwork_sequence|*|side_on": {
    tips: [
      "Follow the skater along the boards if possible",
      "Capture edge quality and turn variety",
      "Keep the camera smooth — use both hands to stabilize",
      "Ensure upper body and footwork are both visible",
    ],
  },
  "figure_skating|footwork_sequence|*|elevated": {
    tips: [
      "Elevated angle shows ice coverage and pattern quality",
      "Film from the stands to capture the full sequence path",
      "Keep the skater centered in frame throughout",
      "Best for seeing the overall flow and musicality",
    ],
  },

  // ── Figure Skating: Spirals ──
  "figure_skating|spiral_sequence|*|side_on": {
    tips: [
      "Side angle captures leg height and body line best",
      "Position camera at ice level for maximum impact",
      "Follow the skater smoothly along their path",
      "Ensure speed and edge quality are visible",
    ],
  },

  // ── Dance: Turns ──
  "dance|turns|fouette|front": {
    tips: [
      "Position camera directly in front, at hip height",
      "Ensure you can see the working leg whip and spot",
      "Film at least 4 consecutive fouettes for best analysis",
      "Make sure the supporting leg and foot are visible",
    ],
  },
  "dance|turns|pirouette|front": {
    tips: [
      "Film from straight on to capture alignment and spotting",
      "Camera at hip height for the best view of position",
      "Ensure arms and working leg are clearly visible",
      "Film 2-3 pirouettes for the most accurate comparison",
    ],
  },
  "dance|turns|*|front": {
    tips: [
      "Film from the front to capture spotting and arm coordination",
      "Camera at hip height or slightly lower",
      "Ensure the full body from head to toe is in frame",
      "Stable camera is essential — use a tripod if possible",
    ],
  },
  "dance|turns|*|side_on": {
    tips: [
      "Side angle reveals balance on axis and posture",
      "Position camera at hip height, 3 meters away",
      "Ensure you can see the preparation and finish positions",
      "Film against a plain background for clarity",
    ],
  },

  // ── Dance: Leaps ──
  "dance|leaps|grand_jete|front": {
    tips: [
      "Film from the front to capture split angle and arm lines",
      "Camera at waist height, far enough to see the full leap",
      "Ensure takeoff and landing are both in frame",
      "Film against a contrasting background for best results",
    ],
  },
  "dance|leaps|*|side_on": {
    tips: [
      "Side angle is ideal for measuring height and split",
      "Position far enough away to capture the full trajectory",
      "Camera at waist height to capture peak elevation",
      "Film 2-3 leaps across the floor for best comparison",
    ],
  },

  // ── Dance: Extensions ──
  "dance|extensions|*|front": {
    tips: [
      "Front angle shows hip alignment and body line",
      "Camera at hip height, 3-4 meters away",
      "Ensure the full body and extended leg are in frame",
      "Hold the extension for 2-3 seconds for best AI analysis",
    ],
  },
  "dance|extensions|*|side_on": {
    tips: [
      "Side view captures extension height and back alignment",
      "Position camera perpendicular to the dancer",
      "Ensure supporting leg and working leg are both visible",
      "Film the full developpe or arabesque from start to hold",
    ],
  },

  // ── Dance: Floor Work ──
  "dance|floor_work|*|front": {
    tips: [
      "Film from the front at a low angle to capture transitions",
      "Ensure the full body is in frame, even on the floor",
      "Smooth camera movement helps the AI track your body",
      "Capture the descent, floor work, and recovery to standing",
    ],
  },

  // ── Dance: Partnering ──
  "dance|partnering|*|front": {
    tips: [
      "Film from the front to capture spatial relationship",
      "Stand far enough to keep both dancers in frame",
      "Ensure hand grips and lifts are clearly visible",
      "Camera at chest height for the best perspective",
    ],
  },
  "dance|partnering|*|side_on": {
    tips: [
      "Side angle shows timing and weight sharing",
      "Stand far enough back for both dancers to be in frame",
      "Capture the full lift mechanics from preparation to landing",
      "Ensure you can see both dancers' feet for timing analysis",
    ],
  },
};

// Generic fallbacks by sport + angle
const GENERIC_TIPS: Record<string, FilmingTipEntry> = {
  "tennis|side_on": {
    tips: [
      "Camera at waist height, 3-4 meters from the baseline",
      "Capture the full motion from preparation to follow-through",
      "Ensure feet and racket are both visible",
      "Film 3-5 repetitions for the best AI comparison",
    ],
  },
  "tennis|behind": {
    tips: [
      "Stand 3-4 meters behind the player, centered",
      "Camera at shoulder height to see the swing path",
      "Ensure the net and contact point are visible",
      "Film multiple shots for the best analysis",
    ],
  },
  "figure_skating|side_on": {
    tips: [
      "Position camera at ice level, 4-5 meters away",
      "Capture the full element from entry to exit",
      "Use slow motion if available for jumps and spins",
      "Keep the camera as steady as possible",
    ],
  },
  "figure_skating|elevated": {
    tips: [
      "Film from the stands or an elevated platform",
      "Capture the full pattern and ice coverage",
      "Keep the skater centered in the frame",
      "Elevated angle is best for seeing overall flow",
    ],
  },
  "dance|front": {
    tips: [
      "Camera at hip height, directly facing the dancer",
      "Ensure full body from head to toe is in frame",
      "Film against a plain background for best results",
      "Use a tripod or stable surface for steady footage",
    ],
  },
  "dance|side_on": {
    tips: [
      "Side angle captures height, extension, and alignment",
      "Position camera at hip height, 3-4 meters away",
      "Ensure the full body and movement range are visible",
      "Film 2-3 repetitions for the best comparison",
    ],
  },
};

/**
 * Get contextual filming tips for a given combination.
 * Falls back to generic sport+angle tips if no exact match.
 */
export function getFilmingTips(
  sport: Sport,
  shotTypeId: string,
  variantId: string | null,
  cameraAngleId: string
): string[] {
  // Try exact match first
  const exactKey = `${sport}|${shotTypeId}|${variantId ?? "*"}|${cameraAngleId}`;
  if (TIPS_MAP[exactKey]) return TIPS_MAP[exactKey].tips;

  // Try wildcard variant
  const wildcardKey = `${sport}|${shotTypeId}|*|${cameraAngleId}`;
  if (TIPS_MAP[wildcardKey]) return TIPS_MAP[wildcardKey].tips;

  // Fall back to generic sport+angle
  const genericKey = `${sport}|${cameraAngleId}`;
  if (GENERIC_TIPS[genericKey]) return GENERIC_TIPS[genericKey].tips;

  // Ultimate fallback
  return [
    "Film in good lighting with a stable camera",
    "Ensure your full body is visible in the frame",
    "Record 3-5 repetitions for the best comparison",
    "Trim your video to 10-20 seconds for fastest results",
  ];
}
