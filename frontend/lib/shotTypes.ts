import { Sport, ShotTypeDefinition, ShotTypeCategory } from "./types";

export const SHOT_TYPES: ShotTypeDefinition[] = [
  // ── Tennis ──────────────────────────────────────────────
  {
    id: "forehand",
    label: "Forehand",
    sport: "tennis",
    variants: [
      { id: "topspin", label: "Topspin" },
      { id: "flat", label: "Flat" },
      { id: "slice", label: "Slice" },
    ],
    dimensions: ["grip_and_ready_position", "unit_turn", "contact_point", "follow_through", "footwork"],
    keyConcepts: "semi-western vs eastern grip, early shoulder rotation, racket lag, windshield-wiper finish, open vs closed stance weight transfer",
  },
  {
    id: "backhand",
    label: "Backhand",
    sport: "tennis",
    variants: [
      { id: "one_handed", label: "One-handed" },
      { id: "two_handed", label: "Two-handed" },
      { id: "slice", label: "Slice" },
    ],
    dimensions: ["grip_and_ready_position", "backswing_and_turn", "contact_point", "follow_through", "balance"],
    keyConcepts: "non-dominant hand placement, shoulder alignment at take-back, hitting through the ball, extension toward target, hip rotation timing",
  },
  {
    id: "serve",
    label: "Serve",
    sport: "tennis",
    variants: [
      { id: "flat", label: "Flat" },
      { id: "kick", label: "Kick" },
      { id: "slice", label: "Slice" },
    ],
    dimensions: ["ball_toss", "trophy_position", "pronation", "follow_through", "leg_drive"],
    keyConcepts: "toss placement for each serve type, knee bend and upward explosion, continental grip, shoulder-over-shoulder rotation, wrist snap and pronation at contact",
  },
  {
    id: "volley",
    label: "Volley",
    sport: "tennis",
    dimensions: ["split_step_timing", "racket_preparation", "contact_out_front", "punch_through", "recovery"],
    keyConcepts: "continental grip, short backswing, firm wrist, stepping into the ball, angling the racket face, quick split step on opponent contact",
  },
  {
    id: "return",
    label: "Return of Serve",
    sport: "tennis",
    dimensions: ["ready_position", "split_step_timing", "compact_backswing", "weight_transfer", "depth_and_placement"],
    keyConcepts: "split step as server strikes, shortened take-back, early ball recognition, blocking vs swinging return, positioning inside baseline",
  },

  // ── Figure Skating ─────────────────────────────────────
  {
    id: "jumps",
    label: "Jumps",
    sport: "figure_skating",
    variants: [
      { id: "axel", label: "Axel" },
      { id: "lutz", label: "Lutz" },
      { id: "flip", label: "Flip" },
      { id: "loop", label: "Loop" },
      { id: "salchow", label: "Salchow" },
      { id: "toe_loop", label: "Toe Loop" },
    ],
    dimensions: ["entry_edge", "takeoff_position", "air_position", "rotation_speed", "landing"],
    keyConcepts: "back outside vs inside edge entry, toe pick assist vs edge launch, tight air position with arms pulled in, checking rotation on landing, free leg extension, knee bend on landing",
  },
  {
    id: "spins",
    label: "Spins",
    sport: "figure_skating",
    variants: [
      { id: "camel", label: "Camel" },
      { id: "sit", label: "Sit" },
      { id: "upright", label: "Upright" },
      { id: "combination", label: "Combination" },
    ],
    dimensions: ["centering", "speed_consistency", "body_position", "entry", "exit"],
    keyConcepts: "spin centering on one spot, maintaining speed through position changes, free leg and arm positions, wind-up entry, controlled exit on one foot",
  },
  {
    id: "footwork_sequence",
    label: "Footwork Sequence",
    sport: "figure_skating",
    dimensions: ["edge_variety", "turn_quality", "upper_body_movement", "ice_coverage", "musicality"],
    keyConcepts: "variety of turns (three-turns, brackets, rockers, counters), deep edges, upper body involvement, covering the full ice surface, matching musical phrasing",
  },
  {
    id: "spiral_sequence",
    label: "Spiral Sequence",
    sport: "figure_skating",
    dimensions: ["leg_height", "edge_quality", "body_line", "speed_maintenance", "transitions"],
    keyConcepts: "sustained free leg above hip height, deep clean edges, extended body line, maintaining speed throughout, smooth transitions between positions",
  },

  // ── Dance ──────────────────────────────────────────────
  {
    id: "turns",
    label: "Turns",
    sport: "dance",
    variants: [
      { id: "fouette", label: "Fouette" },
      { id: "pirouette", label: "Pirouette" },
      { id: "chaine", label: "Chaine" },
    ],
    dimensions: ["spotting", "preparation", "balance_on_axis", "arm_coordination", "landing_control"],
    keyConcepts: "sharp head spotting, solid releve or plie preparation, tight center axis, arms opening and closing for momentum, controlled finish in position",
  },
  {
    id: "leaps",
    label: "Leaps",
    sport: "dance",
    variants: [
      { id: "grand_jete", label: "Grand Jete" },
      { id: "assemble", label: "Assemble" },
    ],
    dimensions: ["height_and_elevation", "split_angle", "takeoff_power", "arm_placement", "landing_control"],
    keyConcepts: "plie-driven takeoff, full split at peak height, leading with the front leg, coordinated arm lines in the air, soft controlled landing through plie",
  },
  {
    id: "extensions",
    label: "Extensions",
    sport: "dance",
    variants: [
      { id: "arabesque", label: "Arabesque" },
      { id: "developpe", label: "Developpe" },
    ],
    dimensions: ["leg_height", "hip_alignment", "supporting_leg", "upper_body_line", "control_and_hold"],
    keyConcepts: "turned-out working leg, square vs open hips depending on style, straight supporting leg, elongated spine and arm line, sustained hold without wobble",
  },
  {
    id: "floor_work",
    label: "Floor Work",
    sport: "dance",
    dimensions: ["transitions_to_floor", "weight_distribution", "fluidity", "core_engagement", "recovery_to_standing"],
    keyConcepts: "controlled descent using core, smooth weight shifts, seamless movement on the floor, articulated spine rolls, efficient recovery to standing",
  },
  {
    id: "partnering",
    label: "Partnering",
    sport: "dance",
    dimensions: ["timing_with_partner", "weight_sharing", "lift_mechanics", "spatial_awareness", "musicality"],
    keyConcepts: "synchronized timing, proper hand/grip placement, core engagement for lifts, maintaining spatial relationship, shared musical interpretation",
  },
];

export function getShotTypesForSport(sport: Sport): ShotTypeDefinition[] {
  return SHOT_TYPES.filter((st) => st.sport === sport);
}

export function getShotTypeById(id: string): ShotTypeDefinition | undefined {
  return SHOT_TYPES.find((st) => st.id === id);
}

/**
 * Group shot types by category for display.
 * Shot types with variants get a header row; those without are standalone.
 */
export function getShotTypeCategoriesForSport(sport: Sport): ShotTypeCategory[] {
  return getShotTypesForSport(sport).map((st) => ({
    id: st.id,
    label: st.label,
    variants: st.variants,
  }));
}
