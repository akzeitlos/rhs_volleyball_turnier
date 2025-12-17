import { clampInt } from "./utils";

export function distributeSnake(teamIds, groupCount) {
  const buckets = Array.from({ length: groupCount }, () => []);
  let dir = 1;
  let g = 0;
  for (const id of teamIds) {
    buckets[g].push(id);
    if (dir === 1) {
      if (g === groupCount - 1) dir = -1;
      else g++;
    } else {
      if (g === 0) dir = 1;
      else g--;
    }
  }
  return buckets;
}

export function createGroups({ teams, groupSize }) {
  const teamIds = teams.map((t) => t.id);
  const size = clampInt(groupSize, 2, 16);
  const groupCount = Math.ceil(teamIds.length / size);
  const distributed = distributeSnake(teamIds, groupCount);

  return distributed.map((teamIdsInGroup, idx) => ({
    id: `group_${idx}`,
    name: String.fromCharCode(65 + idx),
    teamIds: teamIdsInGroup,
  }));
}
