import { VideoAvailability } from "./types";

type A = VideoAvailability | null;

export function isSportAvailable(a: A, sport: string): boolean {
  if (!a) return true;
  return sport in a;
}

export function isShotTypeAvailable(a: A, sport: string, shotType: string): boolean {
  if (!a) return true;
  return !!a[sport]?.[shotType];
}

export function isAngleAvailable(a: A, sport: string, shotType: string, angle: string): boolean {
  if (!a) return true;
  const videos = a[sport]?.[shotType]?.[angle];
  return !!videos && videos.length > 0;
}

export function isProAvailable(
  a: A,
  sport: string,
  shotType: string,
  angle: string | null,
  proId: string,
): boolean {
  if (!a) return true;
  const shotData = a[sport]?.[shotType];
  if (!shotData) return false;
  if (angle) {
    return shotData[angle]?.includes(proId) ?? false;
  }
  return Object.values(shotData).some((ids) => ids.includes(proId));
}

export function isVariantAvailable(
  a: A,
  sport: string,
  shotType: string,
): boolean {
  if (!a) return true;
  return !!a[sport]?.[shotType];
}
