export function calculateRemainingTime(
  serverCreatedAt: string,
  durationSeconds: number = 30
): number {
  const now = Date.now();
  const elapsed = (now - new Date(serverCreatedAt).getTime()) / 1000;
  return Math.max(0, durationSeconds - elapsed);
}
