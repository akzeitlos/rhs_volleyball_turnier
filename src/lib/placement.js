import { roundRobinMatches } from "./schedule";
import { computeStandings } from "./standings";
import { ordinal } from "./utils";

export function placementPreview(groups) {
  if (!groups.length) return [];

  const maxRank = Math.max(...groups.map((g) => g.teamIds.length));
  const pools = [];
  let placeStart = 1;

  for (let r = 1; r <= maxRank; r++) {
    const slots = groups
      .filter((g) => (g.teamIds?.length || 0) >= r)
      .map((g) => ({ key: `${g.id}_${r}`, label: `${ordinal(r)} Gruppe ${g.name}` }));

    if (!slots.length) continue;

    const placeEnd = placeStart + slots.length - 1;
    const label =
      slots.length === 1
        ? `Platz ${placeStart}`
        : `Plätze ${placeStart}–${placeEnd} (alle ${ordinal(r)} der Gruppen)`;

    const pseudoIds = slots.map((s) => s.key);
    const baseMatches = pseudoIds.length >= 2 ? roundRobinMatches(pseudoIds, label) : [];

    const matches = baseMatches.map((m) => {
      const aSlot = slots.find((s) => s.key === m.a);
      const bSlot = slots.find((s) => s.key === m.b);
      return {
        ...m,
        a: null,
        b: null,
        aLabel: aSlot?.label ?? m.a,
        bLabel: bSlot?.label ?? m.b,
      };
    });

    pools.push({ id: `preview_${r}`, label, placeStart, placeEnd, slots, matches });
    placeStart = placeEnd + 1;
  }

  return pools;
}

export function buildPlacementPools(groups, matchesByGroup) {
  const standingsByGroup = groups.map((g) => computeStandings(g.teamIds, matchesByGroup[g.id] || []));
  const maxRank = Math.max(0, ...standingsByGroup.map((st) => st.length));

  const pools = [];
  let placeStart = 1;

  for (let r = 1; r <= maxRank; r++) {
    const participants = [];
    for (let gi = 0; gi < standingsByGroup.length; gi++) {
      const st = standingsByGroup[gi];
      const row = st.find((x) => x.rank === r);
      if (row) participants.push(row.teamId);
    }
    if (participants.length === 0) continue;

    const placeEnd = placeStart + participants.length - 1;
    const label =
      participants.length === 1
        ? `Platz ${placeStart}`
        : `Plätze ${placeStart}–${placeEnd} (alle ${ordinal(r)} der Gruppen)`;

    const matches = participants.length >= 2 ? roundRobinMatches(participants, label) : [];

    pools.push({
      id: `pool_${r}`,
      rankFromGroups: r,
      placeStart,
      placeEnd,
      label,
      teamIds: participants,
      matches,
    });

    placeStart = placeEnd + 1;
  }

  return {
    pools,
    note: "Alle Plätze werden ausgespielt: pro Gruppenrang ein Platzierungs-Pool (Round-Robin).",
  };
}

export function computeFinalTableFromPools(placement) {
  if (!placement?.pools?.length) return [];
  const rows = [];

  for (const pool of placement.pools) {
    if (pool.teamIds.length === 1) {
      rows.push({ place: pool.placeStart, teamId: pool.teamIds[0], info: pool.label });
      continue;
    }
    const st = computeStandings(pool.teamIds, pool.matches || []);
    st.forEach((s, idx) => rows.push({ place: pool.placeStart + idx, teamId: s.teamId, info: pool.label }));
  }

  rows.sort((a, b) => a.place - b.place);
  return rows;
}
