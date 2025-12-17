import { computeStandings } from "./standings";

/**
 * Mappt teams[] -> { [teamId]: team }
 */
export function makeTeamsById(teams) {
  const map = {};
  for (const t of teams || []) map[t.id] = t;
  return map;
}

/**
 * Ableitung aus setup (clamped) + groupCount
 */
export function deriveSetup(setup, clampInt) {
  const teamCount = clampInt(setup?.teamCount ?? 8, 2, 64);
  const groupSize = clampInt(setup?.groupSize ?? 4, 2, 16);
  const groupCount = Math.ceil(teamCount / groupSize);
  const hasRemainder = teamCount % groupSize !== 0;
  return { teamCount, groupSize, groupCount, hasRemainder };
}

/**
 * Berechnet pro Gruppe die Tabelle aus den aktuellen Matches
 * returns: Array<standings[]>, gleiche Reihenfolge wie groups
 */
export function computeStandingsByGroup(groups, matchesByGroup) {
  return (groups || []).map((g) =>
    computeStandings(g.teamIds || [], (matchesByGroup && matchesByGroup[g.id]) || [])
  );
}

/**
 * Wie viele Gruppenspiele sind noch offen?
 */
export function countOpenGroupMatches(groups, matchesByGroup) {
  let open = 0;
  for (const g of groups || []) {
    const ms = (matchesByGroup && matchesByGroup[g.id]) || [];
    open += ms.filter((m) => m.pointsA == null || m.pointsB == null).length;
  }
  return open;
}

/**
 * Wie viele Platzierungsspiele sind noch offen?
 */
export function countOpenPlacementMatches(placement) {
  if (!placement?.pools?.length) return 0;
  let open = 0;
  for (const p of placement.pools) {
    const ms = p.matches || [];
    open += ms.filter((m) => m.pointsA == null || m.pointsB == null).length;
  }
  return open;
}

/**
 * Flags
 */
export function isGroupPhaseComplete(groups, openGroupMatches) {
  return (groups || []).length > 0 && openGroupMatches === 0;
}

export function isPlacementComplete(placement, openPlacementMatches) {
  return Boolean(placement?.pools?.length) && openPlacementMatches === 0;
}
