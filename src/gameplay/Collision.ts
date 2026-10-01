export function inZone(
  bikeLane: number,
  bikeDist: number,
  targetLane: number,
  targetDist: number,
  rLane = 0.5,
  rDist = 5,
): boolean {
  return (
    Math.abs(bikeLane - targetLane) <= rLane &&
    Math.abs(bikeDist - targetDist) < rDist
  );
}
