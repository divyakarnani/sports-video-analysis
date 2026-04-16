import { Pro } from "./types";

export const PROS: Pro[] = [
  // Tennis
  {
    id: "swiatek",
    name: "Iga Swiatek",
    sport: "tennis",
    subtitle: "World No. 1 · Baseline power",
    initials: "IS",
    shotTypes: ["forehand", "backhand", "return"],
    avatarColor: "#E57373",
    bestFor: "Heavy topspin, consistency",
    variantAvailability: {
      forehand: ["topspin", "flat"],
      backhand: ["two_handed"],
    },
    angleAvailability: {
      forehand: ["side_on", "behind"],
      backhand: ["side_on", "behind"],
      return: ["behind"],
    },
    hasFootage: true,
  },
  {
    id: "alcaraz",
    name: "Carlos Alcaraz",
    sport: "tennis",
    subtitle: "All-court · Topspin master",
    initials: "CA",
    shotTypes: ["forehand", "backhand", "volley"],
    avatarColor: "#64B5F6",
    bestFor: "All-court versatility, drop shots",
    variantAvailability: {
      forehand: ["topspin", "flat", "slice"],
      backhand: ["one_handed", "slice"],
    },
    angleAvailability: {
      forehand: ["side_on", "behind"],
      backhand: ["side_on"],
      volley: ["side_on"],
    },
    hasFootage: true,
  },
  {
    id: "djokovic",
    name: "Novak Djokovic",
    sport: "tennis",
    subtitle: "Return specialist · Footwork",
    initials: "ND",
    shotTypes: ["return", "backhand", "serve"],
    avatarColor: "#81C784",
    bestFor: "Return of serve, defensive play",
    variantAvailability: {
      backhand: ["two_handed"],
      serve: ["flat", "kick", "slice"],
    },
    angleAvailability: {
      return: ["behind"],
      backhand: ["side_on", "behind"],
      serve: ["side_on", "behind"],
    },
    hasFootage: true,
  },
  {
    id: "gauff",
    name: "Coco Gauff",
    sport: "tennis",
    subtitle: "Aggressive baseline · Serve",
    initials: "CG",
    shotTypes: ["serve", "forehand"],
    avatarColor: "#FFB74D",
    bestFor: "Powerful serve, aggressive baseline",
    variantAvailability: {
      serve: ["flat", "kick"],
      forehand: ["topspin"],
    },
    angleAvailability: {
      serve: ["side_on", "behind"],
      forehand: ["side_on"],
    },
    hasFootage: true,
  },

  // Figure skating
  {
    id: "chen",
    name: "Nathan Chen",
    sport: "figure_skating",
    subtitle: "Quad jumps · Artistry",
    initials: "NC",
    shotTypes: ["jumps", "spins", "footwork_sequence"],
    avatarColor: "#7986CB",
    bestFor: "Quad jumps, artistic expression",
    variantAvailability: {
      jumps: ["axel", "lutz", "flip", "toe_loop"],
      spins: ["camel", "combination"],
    },
    angleAvailability: {
      jumps: ["side_on", "elevated"],
      spins: ["side_on", "elevated"],
      footwork_sequence: ["elevated"],
    },
    hasFootage: true,
  },
  {
    id: "hanyu",
    name: "Yuzuru Hanyu",
    sport: "figure_skating",
    subtitle: "Footwork · Spins",
    initials: "YH",
    shotTypes: ["footwork_sequence", "spins", "jumps"],
    avatarColor: "#4FC3F7",
    bestFor: "Elegant footwork, transitions",
    variantAvailability: {
      jumps: ["axel", "salchow", "loop"],
      spins: ["sit", "upright", "combination"],
    },
    angleAvailability: {
      footwork_sequence: ["side_on", "elevated"],
      spins: ["side_on", "elevated"],
      jumps: ["side_on"],
    },
    hasFootage: true,
  },
  {
    id: "zagitova",
    name: "Alina Zagitova",
    sport: "figure_skating",
    subtitle: "Back-loaded jumps · Edges",
    initials: "AZ",
    shotTypes: ["jumps", "spiral_sequence", "spins"],
    avatarColor: "#F48FB1",
    bestFor: "Back-loaded programs, edge quality",
    variantAvailability: {
      jumps: ["lutz", "flip", "loop"],
      spins: ["camel", "sit"],
    },
    angleAvailability: {
      jumps: ["side_on"],
      spiral_sequence: ["side_on"],
      spins: ["elevated"],
    },
    hasFootage: true,
  },

  // Dance
  {
    id: "copeland",
    name: "Misty Copeland",
    sport: "dance",
    subtitle: "Ballet · Line and extension",
    initials: "MC",
    shotTypes: ["turns", "leaps", "extensions"],
    avatarColor: "#CE93D8",
    bestFor: "Line, extension, classical technique",
    variantAvailability: {
      turns: ["pirouette", "fouette"],
      leaps: ["grand_jete"],
      extensions: ["arabesque", "developpe"],
    },
    angleAvailability: {
      turns: ["front", "side_on"],
      leaps: ["side_on", "front"],
      extensions: ["side_on", "front"],
    },
    hasFootage: true,
  },
  {
    id: "les_twins",
    name: "Les Twins",
    sport: "dance",
    subtitle: "Hip-hop · Isolation mastery",
    initials: "LT",
    shotTypes: ["floor_work", "turns"],
    avatarColor: "#A1887F",
    bestFor: "Isolation, musicality, freestyle",
    variantAvailability: {
      turns: ["chaine"],
    },
    angleAvailability: {
      floor_work: ["front"],
      turns: ["front"],
    },
    hasFootage: true,
  },
  {
    id: "kovalev",
    name: "Pasha Kovalev",
    sport: "dance",
    subtitle: "Latin ballroom · Timing",
    initials: "PK",
    shotTypes: ["partnering", "turns"],
    avatarColor: "#FFD54F",
    bestFor: "Timing, partnering, Latin technique",
    variantAvailability: {
      turns: ["chaine"],
    },
    angleAvailability: {
      partnering: ["front", "side_on"],
      turns: ["front"],
    },
    hasFootage: true,
  },
];

/**
 * Get pros that have a reference for the given shot type.
 * Optionally filter by variant and/or camera angle availability.
 */
export function getProsForShotType(
  sport: string,
  shotTypeId: string,
  variantId?: string,
  cameraAngleId?: string,
): Pro[] {
  return PROS.filter((p) => {
    if (p.sport !== sport || !p.shotTypes.includes(shotTypeId)) return false;
    if (variantId && p.variantAvailability) {
      const available = p.variantAvailability[shotTypeId];
      if (available && !available.includes(variantId)) return false;
    }
    if (cameraAngleId && p.angleAvailability) {
      const angles = p.angleAvailability[shotTypeId];
      if (!angles || !angles.includes(cameraAngleId)) return false;
    }
    return true;
  });
}
