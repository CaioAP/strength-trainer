export function formatMMSS(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatDuration(start: string, end: string | null): string {
  if (!end) return "--:--";
  const diffMs = Math.abs(new Date(end).getTime() - new Date(start).getTime());
  return formatMMSS(Math.floor(diffMs / 1000));
}
