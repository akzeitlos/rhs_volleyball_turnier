export function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function clampInt(n, min, max) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, Math.trunc(x)));
}

export function ordinal(n) {
  return `${n}.`;
}