import { uid } from "./utils";

/**
 * Round Robin (Circle method)
 */
export function roundRobinMatches(teamIds, labelPrefix = "Runde") {
  const ids = [...teamIds];
  if (ids.length % 2 === 1) ids.push("BYE");

  const n = ids.length;
  const rounds = n - 1;
  const half = n / 2;

  let arr = [...ids];
  const out = [];

  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < half; i++) {
      const a = arr[i];
      const b = arr[n - 1 - i];
      if (a !== "BYE" && b !== "BYE") {
        out.push({
          id: uid(),
          round: r + 1,
          a,
          b,
          pointsA: null,
          pointsB: null,
          label: `${labelPrefix} ${r + 1}`,
        });
      }
    }
    const fixed = arr[0];
    const rest = arr.slice(1);
    rest.unshift(rest.pop());
    arr = [fixed, ...rest];
  }

  return out;
}
