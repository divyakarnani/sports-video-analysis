import { CameraAngle, Sport } from "./types";

const CAMERA_ANGLES: CameraAngle[] = [
  // Tennis
  {
    id: "side_on",
    label: "Side On",
    description: "Camera positioned perpendicular to the baseline, capturing the full swing arc.",
    bestFor: ["Swing arc", "Stance", "Weight transfer"],
    sport: "tennis",
  },
  {
    id: "behind",
    label: "Behind",
    description: "Camera behind the player, looking toward the net.",
    bestFor: ["Contact point", "Follow-through", "Footwork"],
    sport: "tennis",
  },

  // Figure Skating
  {
    id: "side_on",
    label: "Side On",
    description: "Camera at ice level from the side of the rink.",
    bestFor: ["Jump height", "Air position", "Landing"],
    sport: "figure_skating",
  },
  {
    id: "elevated",
    label: "Elevated",
    description: "Camera from an elevated angle overlooking the rink.",
    bestFor: ["Spin centering", "Footwork pattern", "Ice coverage"],
    sport: "figure_skating",
  },

  // Dance
  {
    id: "front",
    label: "Front",
    description: "Camera facing the dancer straight on.",
    bestFor: ["Arm placement", "Body line", "Spotting"],
    sport: "dance",
  },
  {
    id: "side_on",
    label: "Side On",
    description: "Camera positioned to the side of the dancer.",
    bestFor: ["Extension height", "Turnout", "Elevation"],
    sport: "dance",
  },
];

export function getCameraAnglesForSport(sport: Sport): CameraAngle[] {
  return CAMERA_ANGLES.filter((a) => a.sport === sport);
}
