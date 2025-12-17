import { RULES } from "./constants";

/**
 * Standings:
 * - points (win/draw/loss)
 * - tie: points, pointDiff, pointsFor
 * - optional small h2h swap for adjacent tied teams
 */
export function computeStandings(teamIds, matches) {
  const base = {};
  for (const id of teamIds) {
    base[id] = {
      teamId: id,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
      pointsFor: 0,
      pointsAgainst: 0,
    };
  }

  const h2h = new Map();

  for (const m of matches) {
    if (m.pointsA == null || m.pointsB == null) continue;
    const A = base[m.a];
    const B = base[m.b];
    if (!A || !B) continue;

    const pa = Number(m.pointsA);
    const pb = Number(m.pointsB);
    if (!Number.isFinite(pa) || !Number.isFinite(pb)) continue;

    A.played += 1;
    B.played += 1;

    A.pointsFor += pa;
    A.pointsAgainst += pb;
    B.pointsFor += pb;
    B.pointsAgainst += pa;

    let aMatchPts = 0;
    let bMatchPts = 0;

    if (pa > pb) {
      A.wins += 1;
      B.losses += 1;
      aMatchPts = RULES.points.win;
      bMatchPts = RULES.points.loss;
    } else if (pa < pb) {
      B.wins += 1;
      A.losses += 1;
      aMatchPts = RULES.points.loss;
      bMatchPts = RULES.points.win;
    } else {
      A.draws += 1;
      B.draws += 1;
      aMatchPts = RULES.points.draw;
      bMatchPts = RULES.points.draw;
    }

    A.points += aMatchPts;
    B.points += bMatchPts;

    const key = [m.a, m.b].sort().join("|");
    const entry = h2h.get(key) || {};
    entry[m.a] = (entry[m.a] || 0) + aMatchPts;
    entry[m.b] = (entry[m.b] || 0) + bMatchPts;
    h2h.set(key, entry);
  }

  const keyOf = (s) => {
    const diff = s.pointsFor - s.pointsAgainst;
    return [s.points, diff, s.pointsFor];
  };

  const list = Object.values(base).sort((x, y) => {
    const a = keyOf(x);
    const b = keyOf(y);
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return b[i] - a[i];
    }
    return 0;
  });

  // small adjacent head-to-head swap
  for (let i = 0; i < list.length - 1; i++) {
    const cur = list[i];
    const nxt = list[i + 1];
    const a = keyOf(cur);
    const b = keyOf(nxt);
    const tied = a.every((v, idx) => v === b[idx]);
    if (!tied) continue;

    const key = [cur.teamId, nxt.teamId].sort().join("|");
    const entry = h2h.get(key);
    if (!entry) continue;

    const curPts = entry[cur.teamId] || 0;
    const nxtPts = entry[nxt.teamId] || 0;
    if (nxtPts > curPts) {
      list[i] = nxt;
      list[i + 1] = cur;
    }
  }

  return list.map((s, idx) => ({
    ...s,
    rank: idx + 1,
    pointDiff: s.pointsFor - s.pointsAgainst,
  }));
}
