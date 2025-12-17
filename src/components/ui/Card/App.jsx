import React, { useEffect, useMemo, useState } from "react";
import CardHeader from "./components/ui/CardHeader/CardHeader";

/**
 * Volleyball Turnier Tool – Frontend only (React)
 * - Setup (Teams + Gruppengröße)
 * - Gruppen erstellen (Snake-Verteilung)
 * - Gruppenphase: Round-Robin + Tabelle
 * - Platzierungsphase: ALLE Plätze ausgespielt
 *   - VORHER: Plan/Vorschau (mit Platzhaltern wie "1. Gruppe A") + konkrete Spielpaarungen
 *   - NACHHER: echte Pools (alle Gruppenspiele fertig) mit echten Teams + Ergebnis-Eingabe
 * - Finale Tabelle
 * - localStorage Persistenz: bleibt bis "Speicher leeren"
 *
 * FIX: Hydration-Flag verhindert, dass derived-effects (teamCount Sync) die geladenen Daten überschreiben.
 */

// ------------------------------------------------------------
// Minimal UI
// ------------------------------------------------------------

function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl border bg-white text-black ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ className = "", children }) {
  return <div className={`font-semibold ${className}`}>{children}</div>;
}
function CardContent({ className = "", children }) {
  return <div className={`px-4 pb-4 ${className}`}>{children}</div>;
}
function Button({ variant = "default", className = "", children, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "ghost"
      ? "bg-transparent text-black hover:bg-slate-100"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-black text-white hover:bg-slate-800";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 ${className}`}
      {...props}
    />
  );
}
function Label({ className = "", children }) {
  return (
    <label className={`text-sm font-medium ${className}`}>{children}</label>
  );
}
function Separator() {
  return <div className="h-px w-full bg-black/10" />;
}
function Badge({ variant = "secondary", children }) {
  const base = "inline-flex items-center rounded-full px-2 py-1 text-xs";
  const styles =
    variant === "outline" ? "border border-black/15" : "bg-black/5";
  return <span className={`${base} ${styles}`}>{children}</span>;
}
function Switch({ checked, onCheckedChange }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative h-6 w-11 rounded-full border transition ${
        checked ? "bg-black" : "bg-white"
      }`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}

// ------------------------------------------------------------
// Icons + Rail
// ------------------------------------------------------------

function Icon({ children, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}
function GearIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path
        d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 13.1a7.8 7.8 0 0 0 .05-1.1 7.8 7.8 0 0 0-.05-1.1l2.03-1.58-1.93-3.34-2.5 1a7.66 7.66 0 0 0-1.9-1.1l-.38-2.67H9.28l-.38 2.67c-.68.26-1.33.62-1.9 1.1l-2.5-1-1.93 3.34L4.6 10.9a7.8 7.8 0 0 0-.05 1.1c0 .37.02.74.05 1.1l-2.03 1.58 1.93 3.34 2.5-1c.57.48 1.22.84 1.9 1.1l.38 2.67h5.44l.38-2.67c.68-.26 1.33-.62 1.9-1.1l2.5 1 1.93-3.34-2.03-1.58Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
function GroupsIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path
        d="M7 7h10M7 12h10M7 17h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4.5 7h.01M4.5 12h.01M4.5 17h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Icon>
  );
}
function MatchesIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path
        d="M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 9h8M8 13h8M8 17h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  );
}
function TrophyIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path
        d="M8 5h8v3a4 4 0 0 1-8 0V5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6 6H4v2a4 4 0 0 0 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18 6h2v2a4 4 0 0 1-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 12v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 19h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 15h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  );
}
function TableIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path
        d="M5 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10v10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 10v10" stroke="currentColor" strokeWidth="1.8" />
    </Icon>
  );
}
function RailButton({ title, active, disabled, onClick, children, badge }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`relative h-20 w-20 rounded-2xl flex items-center justify-center transition border ${
        active
          ? "bg-white text-black border-white"
          : "bg-transparent text-white border-white/10 hover:bg-white/10"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {children}
      {badge ? (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

// ------------------------------------------------------------
// Regeln + Storage
// ------------------------------------------------------------

const STORAGE_KEY = "volley_tourney_clean_v2";

const rules = {
  matchDurationMinutes: 10,
  points: { win: 2, draw: 1, loss: 0 },
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
function clampInt(n, min, max) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, Math.trunc(x)));
}

// ------------------------------------------------------------
// Schedule + Standings
// ------------------------------------------------------------

function roundRobinMatches(teamIds, labelPrefix = "Runde") {
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

function computeStandings(teamIds, matches) {
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
      aMatchPts = rules.points.win;
      bMatchPts = rules.points.loss;
    } else if (pa < pb) {
      B.wins += 1;
      A.losses += 1;
      aMatchPts = rules.points.loss;
      bMatchPts = rules.points.win;
    } else {
      A.draws += 1;
      B.draws += 1;
      aMatchPts = rules.points.draw;
      bMatchPts = rules.points.draw;
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

// ------------------------------------------------------------
// Setup: Teams + Gruppen
// ------------------------------------------------------------

function TeamEditor({ teams, setTeams }) {
  return (
    <div className="grid gap-2">
      {teams.map((t, idx) => (
        <div
          key={t.id}
          className="grid grid-cols-[48px_1fr] items-center gap-2"
        >
          <div className="text-xs text-slate-600">#{idx + 1}</div>
          <Input
            value={t.name}
            onChange={(e) => {
              const v = e.target.value;
              setTeams((prev) =>
                prev.map((x) => (x.id === t.id ? { ...x, name: v } : x))
              );
            }}
            placeholder={`Team ${idx + 1}`}
          />
        </div>
      ))}
    </div>
  );
}

function distributeSnake(teamIds, groupCount) {
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

function createGroups({ teams, groupSize }) {
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

function GroupsPreview({ groups, teamsById }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {groups.map((g) => (
        <div key={g.id} className="rounded-2xl border p-3 grid gap-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Gruppe {g.name}</div>
            <Badge variant="secondary">{g.teamIds.length}</Badge>
          </div>
          <div className="grid gap-2">
            {g.teamIds.map((tid, idx) => (
              <div key={tid} className="rounded-xl border px-3 py-2 text-sm">
                <span className="text-slate-600 mr-2">{idx + 1}.</span>
                {teamsById[tid]?.name ?? tid}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ------------------------------------------------------------
// Matches UI
// ------------------------------------------------------------

function MatchRow({ match, teamsById, allowDraw, onChange, disabled }) {
  const aName = match.a
    ? teamsById[match.a]?.name ?? match.a
    : match.aLabel ?? "—";
  const bName = match.b
    ? teamsById[match.b]?.name ?? match.b
    : match.bLabel ?? "—";

  const draftA = match.pointsA ?? "";
  const draftB = match.pointsB ?? "";

  const validNumber = (v) =>
    v === "" || (Number.isFinite(Number(v)) && Number(v) >= 0);
  const drawInvalid =
    !allowDraw &&
    match.a &&
    match.b &&
    match.pointsA != null &&
    match.pointsB != null &&
    Number(match.pointsA) === Number(match.pointsB);

  return (
    <div
      className={`rounded-2xl border p-3 grid gap-2 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs text-slate-600">{match.label ?? "Spiel"}</div>
          <div className="font-medium truncate">
            {aName} <span className="text-slate-600">vs</span> {bName}
          </div>
        </div>
        <Badge variant={match.pointsA == null ? "outline" : "secondary"}>
          {match.pointsA == null
            ? "offen"
            : `${match.pointsA}:${match.pointsB}`}
        </Badge>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="grid gap-1">
          <Label className="text-xs">Punkte {aName}</Label>
          <Input
            disabled={disabled}
            inputMode="numeric"
            value={draftA}
            onChange={(e) => {
              const v = e.target.value;
              if (!validNumber(v)) return;
              onChange({
                ...match,
                pointsA: v === "" ? null : clampInt(v, 0, 999),
              });
            }}
            className="w-28"
            placeholder="0"
          />
        </div>

        <div className="grid gap-1">
          <Label className="text-xs">Punkte {bName}</Label>
          <Input
            disabled={disabled}
            inputMode="numeric"
            value={draftB}
            onChange={(e) => {
              const v = e.target.value;
              if (!validNumber(v)) return;
              onChange({
                ...match,
                pointsB: v === "" ? null : clampInt(v, 0, 999),
              });
            }}
            className="w-28"
            placeholder="0"
          />
        </div>

        <Button
          variant="ghost"
          className="ml-auto"
          disabled={
            disabled || (match.pointsA == null && match.pointsB == null)
          }
          onClick={() => onChange({ ...match, pointsA: null, pointsB: null })}
        >
          löschen
        </Button>
      </div>

      {drawInvalid ? (
        <div className="text-xs text-red-700">
          Hier muss ein Sieger feststehen.
        </div>
      ) : null}
    </div>
  );
}

function StandingsTable({ standings, teamsById }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-2">Pl.</th>
            <th className="py-2 pr-2">Team</th>
            <th className="py-2 pr-2">Sp.</th>
            <th className="py-2 pr-2">S</th>
            <th className="py-2 pr-2">U</th>
            <th className="py-2 pr-2">N</th>
            <th className="py-2 pr-2">Pkt</th>
            <th className="py-2 pr-2">Bälle</th>
            <th className="py-2 pr-2">Diff</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s) => (
            <tr key={s.teamId} className="border-b last:border-b-0">
              <td className="py-2 pr-2 font-medium">{s.rank}</td>
              <td className="py-2 pr-2">
                {teamsById[s.teamId]?.name ?? s.teamId}
              </td>
              <td className="py-2 pr-2">{s.played}</td>
              <td className="py-2 pr-2">{s.wins}</td>
              <td className="py-2 pr-2">{s.draws}</td>
              <td className="py-2 pr-2">{s.losses}</td>
              <td className="py-2 pr-2 font-medium">{s.points}</td>
              <td className="py-2 pr-2">
                {s.pointsFor}:{s.pointsAgainst}
              </td>
              <td className="py-2 pr-2">
                {s.pointDiff >= 0 ? "+" : ""}
                {s.pointDiff}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ------------------------------------------------------------
// Platzierung
// ------------------------------------------------------------

function ordinal(n) {
  return `${n}.`;
}

function placementPreview(groups) {
  if (!groups.length) return [];

  const maxRank = Math.max(...groups.map((g) => g.teamIds.length));
  const pools = [];
  let placeStart = 1;

  for (let r = 1; r <= maxRank; r++) {
    const slots = groups
      .filter((g) => (g.teamIds?.length || 0) >= r)
      .map((g) => ({
        key: `${g.id}_${r}`,
        label: `${ordinal(r)} Gruppe ${g.name}`,
      }));

    if (!slots.length) continue;

    const placeEnd = placeStart + slots.length - 1;
    const label =
      slots.length === 1
        ? `Platz ${placeStart}`
        : `Plätze ${placeStart}–${placeEnd} (alle ${ordinal(r)} der Gruppen)`;

    const pseudoIds = slots.map((s) => s.key);
    const baseMatches =
      pseudoIds.length >= 2 ? roundRobinMatches(pseudoIds, label) : [];
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

    pools.push({
      id: `preview_${r}`,
      label,
      placeStart,
      placeEnd,
      slots,
      matches,
    });
    placeStart = placeEnd + 1;
  }

  return pools;
}

function buildPlacementPools(groups, matchesByGroup) {
  const standingsByGroup = groups.map((g) =>
    computeStandings(g.teamIds, matchesByGroup[g.id] || [])
  );
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
    const matches =
      participants.length >= 2 ? roundRobinMatches(participants, label) : [];

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

function computeFinalTableFromPools(placement) {
  if (!placement?.pools?.length) return [];
  const rows = [];

  for (const pool of placement.pools) {
    if (pool.teamIds.length === 1) {
      rows.push({
        place: pool.placeStart,
        teamId: pool.teamIds[0],
        info: pool.label,
      });
      continue;
    }
    const st = computeStandings(pool.teamIds, pool.matches || []);
    st.forEach((s, idx) =>
      rows.push({
        place: pool.placeStart + idx,
        teamId: s.teamId,
        info: pool.label,
      })
    );
  }

  rows.sort((a, b) => a.place - b.place);
  return rows;
}

function FinalTable({ finalRows, teamsById }) {
  if (!finalRows.length)
    return (
      <div className="text-sm text-slate-600">Noch keine finale Tabelle.</div>
    );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-2">Platz</th>
            <th className="py-2 pr-2">Team</th>
            <th className="py-2 pr-2">Quelle</th>
          </tr>
        </thead>
        <tbody>
          {finalRows.map((r) => (
            <tr
              key={`${r.place}-${r.teamId}`}
              className="border-b last:border-b-0"
            >
              <td className="py-2 pr-2 font-semibold">{r.place}</td>
              <td className="py-2 pr-2">
                {teamsById[r.teamId]?.name ?? r.teamId}
              </td>
              <td className="py-2 pr-2 text-slate-600">{r.info}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ------------------------------------------------------------
// App
// ------------------------------------------------------------

export default function VolleyballTurnierTool() {
  const [step, setStep] = useState("setup"); // setup | groups | matches | placement | final

  const [useStorage, setUseStorage] = useState(true);
  const [setup, setSetup] = useState({ teamCount: 8, groupSize: 4 });
  const [teams, setTeams] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({ id: uid(), name: `Team ${i + 1}` }))
  );

  const [groups, setGroups] = useState([]);
  const [matchesByGroup, setMatchesByGroup] = useState({});
  const [placement, setPlacement] = useState(null);

  // IMPORTANT: hydration flag
  const [hydrated, setHydrated] = useState(false);

  const teamsById = useMemo(() => {
    const map = {};
    for (const t of teams) map[t.id] = t;
    return map;
  }, [teams]);

  const derived = useMemo(() => {
    const teamCount = clampInt(setup.teamCount, 2, 64);
    const groupSize = clampInt(setup.groupSize, 2, 16);
    const groupCount = Math.ceil(teamCount / groupSize);
    const hasRemainder = teamCount % groupSize !== 0;
    return { teamCount, groupSize, groupCount, hasRemainder };
  }, [setup.teamCount, setup.groupSize]);

  const standingsByGroup = useMemo(() => {
    return groups.map((g) =>
      computeStandings(g.teamIds, matchesByGroup[g.id] || [])
    );
  }, [groups, matchesByGroup]);

  const openGroupMatches = useMemo(() => {
    let open = 0;
    for (const g of groups) {
      const ms = matchesByGroup[g.id] || [];
      open += ms.filter((m) => m.pointsA == null || m.pointsB == null).length;
    }
    return open;
  }, [groups, matchesByGroup]);

  const openPlacementMatches = useMemo(() => {
    if (!placement?.pools?.length) return 0;
    let open = 0;
    for (const p of placement.pools) {
      open += (p.matches || []).filter(
        (m) => m.pointsA == null || m.pointsB == null
      ).length;
    }
    return open;
  }, [placement]);

  const allGroupMatchesComplete = groups.length > 0 && openGroupMatches === 0;
  const allPlacementMatchesComplete =
    Boolean(placement?.pools?.length) && openPlacementMatches === 0;

  const placementPlan = useMemo(() => placementPreview(groups), [groups]);
  const finalRows = useMemo(
    () => computeFinalTableFromPools(placement),
    [placement]
  );

  // -----------------------
  // Load from localStorage (once)
  // -----------------------
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) {
          if (typeof parsed.step === "string") setStep(parsed.step);
          if (typeof parsed.useStorage === "boolean")
            setUseStorage(parsed.useStorage);
          if (parsed.setup) setSetup(parsed.setup);
          if (Array.isArray(parsed.teams)) setTeams(parsed.teams);
          if (Array.isArray(parsed.groups)) setGroups(parsed.groups);
          if (parsed.matchesByGroup) setMatchesByGroup(parsed.matchesByGroup);
          if (parsed.placement) setPlacement(parsed.placement);
        }
      }
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  // -----------------------
  // Save to localStorage (on change)
  // -----------------------
  useEffect(() => {
    if (!hydrated) return;
    if (!useStorage) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          step,
          useStorage,
          setup,
          teams,
          groups,
          matchesByGroup,
          placement,
        })
      );
    } catch {
      // ignore
    }
  }, [
    hydrated,
    step,
    useStorage,
    setup,
    teams,
    groups,
    matchesByGroup,
    placement,
  ]);

  // -----------------------
  // Keep teams length in sync with setup.teamCount (AFTER hydration only!)
  // -----------------------
  useEffect(() => {
    if (!hydrated) return;
    setTeams((prev) => {
      const n = clampInt(setup.teamCount, 2, 64);
      if (prev.length === n) return prev;
      if (prev.length > n) return prev.slice(0, n);
      const add = Array.from({ length: n - prev.length }, (_, i) => ({
        id: uid(),
        name: `Team ${prev.length + i + 1}`,
      }));
      return [...prev, ...add];
    });
  }, [hydrated, setup.teamCount]);

  // actions
  const generateGroupsAndSchedule = () => {
    const gs = createGroups({ teams, groupSize: setup.groupSize });
    const schedules = {};
    for (const g of gs)
      schedules[g.id] = roundRobinMatches(
        g.teamIds,
        `Gruppe ${g.name} – Runde`
      );
    setGroups(gs);
    setMatchesByGroup(schedules);
    setPlacement(null);
    setStep("groups");
  };

  const createPlacement = () => {
    if (!allGroupMatchesComplete) return;
    const pl = buildPlacementPools(groups, matchesByGroup);
    setPlacement(pl);
    setStep("placement");
  };

  const clearAll = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setStep("setup");
    setUseStorage(true);
    setSetup({ teamCount: 8, groupSize: 4 });
    setTeams(
      Array.from({ length: 8 }, (_, i) => ({
        id: uid(),
        name: `Team ${i + 1}`,
      }))
    );
    setGroups([]);
    setMatchesByGroup({});
    setPlacement(null);
  };

  // rail badges
  const groupBadge = groups.length ? null : "!";
  const matchesBadge = groups.length
    ? openGroupMatches
      ? String(openGroupMatches)
      : null
    : "!";
  const placementBadge = placement
    ? openPlacementMatches
      ? String(openPlacementMatches)
      : null
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-black">
      {/* Left rail */}
      <div className="fixed left-0 top-0 bottom-0 w-24 bg-slate-900 text-white border-r border-white/10 flex flex-col items-center gap-2 py-3 z-40">
        <RailButton
          title="Setup"
          active={step === "setup"}
          disabled={false}
          onClick={() => setStep("setup")}
        >
          <GearIcon className="h-10 w-10" />
        </RailButton>

        <div className="h-px w-14 bg-white/10 my-1" />

        <RailButton
          title="Gruppen"
          active={step === "groups"}
          disabled={false}
          onClick={() => setStep("groups")}
          badge={groupBadge}
        >
          <GroupsIcon className="h-10 w-10" />
        </RailButton>

        <RailButton
          title="Gruppenphase: Spiele"
          active={step === "matches"}
          disabled={false}
          onClick={() => setStep("matches")}
          badge={matchesBadge}
        >
          <MatchesIcon className="h-10 w-10" />
        </RailButton>

        <RailButton
          title={
            placement
              ? "Platzierungsphase"
              : "Platzierungsphase (Plan/Vorschau)"
          }
          active={step === "placement"}
          disabled={false}
          onClick={() => setStep("placement")}
          badge={placementBadge}
        >
          <TrophyIcon className="h-10 w-10" />
        </RailButton>

        <RailButton
          title={
            allPlacementMatchesComplete
              ? "Finale Tabelle"
              : "Finale Tabelle (wird vollständig, wenn alles fertig ist)"
          }
          active={step === "final"}
          disabled={false}
          onClick={() => setStep("final")}
        >
          <TableIcon className="h-10 w-10" />
        </RailButton>

        <div className="mt-auto" />
        <div className="text-[10px] text-white/60 px-2 text-center">
          {groups.length ? `${groups.length} Gruppen` : "noch keine Gruppen"}
        </div>
      </div>

      {/* Content */}
      <div className="pl-24">
        <div className="mx-auto max-w-5xl p-4 md:p-8 grid gap-4">
          <div className="grid gap-2">
            <div className="text-2xl md:text-3xl font-semibold">
              Volleyball Turnier Tool
            </div>
            <div className="text-sm text-slate-600">
              Zeitspiele (Standard {rules.matchDurationMinutes} Minuten): Sieg{" "}
              {rules.points.win}, Unentschieden {rules.points.draw}, Niederlage{" "}
              {rules.points.loss}.
            </div>
          </div>

          {/* SETUP */}
          {step === "setup" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Setup</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="grid gap-1">
                    <div className="font-medium">Auto-Speichern</div>
                    <div className="text-xs text-slate-600">
                      Speichert alles im Browser (localStorage). Bleibt bis du
                      „Speicher leeren“ klickst.
                    </div>
                  </div>
                  <Switch
                    checked={useStorage}
                    onCheckedChange={setUseStorage}
                  />
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Anzahl Teams</Label>
                    <Input
                      type="number"
                      min={2}
                      max={64}
                      value={setup.teamCount}
                      onChange={(e) =>
                        setSetup((s) => ({
                          ...s,
                          teamCount: clampInt(e.target.value, 2, 64),
                        }))
                      }
                    />
                    <div className="text-xs text-slate-600">2–64 Teams.</div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Gruppengröße</Label>
                    <Input
                      type="number"
                      min={2}
                      max={16}
                      value={setup.groupSize}
                      onChange={(e) =>
                        setSetup((s) => ({
                          ...s,
                          groupSize: clampInt(e.target.value, 2, 16),
                        }))
                      }
                    />
                    <div className="text-xs text-slate-600">
                      2–16 Teams pro Gruppe.
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    Gruppen: {derived.groupCount}
                  </Badge>
                  {derived.hasRemainder ? (
                    <Badge variant="outline">letzte Gruppe kleiner</Badge>
                  ) : (
                    <Badge variant="outline">gleichmäßig</Badge>
                  )}
                </div>

                <Separator />

                <div className="grid gap-2">
                  <div className="font-semibold">Teams</div>
                  <TeamEditor teams={teams} setTeams={setTeams} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={generateGroupsAndSchedule}>
                    {groups.length ? "Gruppen speichern" : "Gruppen erzeugen"}
                  </Button>
                  <Button variant="ghost" onClick={clearAll}>
                    Speicher leeren
                  </Button>
                </div>

                {groups.length ? (
                  <div className="text-xs text-slate-600">
                    Hinweis: Wenn du „Gruppen erzeugen“ erneut klickst, werden
                    Gruppen & Spiele neu erstellt (und bisherige Ergebnisse
                    verworfen).
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* GROUPS */}
          {step === "groups" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gruppen</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {!groups.length ? (
                  <div className="text-sm text-slate-600">
                    Noch keine Gruppen. Bitte im Setup „Gruppen erzeugen“.
                  </div>
                ) : (
                  <>
                    <GroupsPreview groups={groups} teamsById={teamsById} />
                    <Separator />
                    <div className="grid gap-3">
                      <div className="font-semibold">Tabellen (live)</div>
                      {groups.map((g, idx) => (
                        <div
                          key={g.id}
                          className="rounded-2xl border p-3 grid gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-semibold">Gruppe {g.name}</div>
                            <Badge variant="secondary">
                              {g.teamIds.length}
                            </Badge>
                          </div>
                          <StandingsTable
                            standings={standingsByGroup[idx] || []}
                            teamsById={teamsById}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* MATCHES */}
          {step === "matches" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">
                    Gruppenphase: Spiele & Ergebnisse
                  </CardTitle>
                  <Badge variant={openGroupMatches ? "outline" : "secondary"}>
                    {groups.length
                      ? openGroupMatches
                        ? `${openGroupMatches} offen`
                        : "komplett"
                      : "—"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6">
                {!groups.length ? (
                  <div className="text-sm text-slate-600">
                    Noch keine Gruppen. Bitte im Setup „Gruppen erzeugen“.
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-slate-600">
                      Endstand nach {rules.matchDurationMinutes} Minuten
                      eintragen. Unentschieden ist erlaubt.
                    </div>

                    {groups.map((g, gi) => {
                      const ms = matchesByGroup[g.id] || [];
                      const st = standingsByGroup[gi] || [];
                      return (
                        <div key={g.id} className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <div className="text-base font-semibold">
                              Gruppe {g.name}
                            </div>
                            <Badge variant="secondary">
                              {ms.length} Spiele
                            </Badge>
                          </div>

                          <div className="rounded-2xl border p-3">
                            <div className="font-semibold mb-2">Tabelle</div>
                            <StandingsTable
                              standings={st}
                              teamsById={teamsById}
                            />
                          </div>

                          <div className="grid gap-2">
                            {ms.map((m) => (
                              <MatchRow
                                key={m.id}
                                match={m}
                                teamsById={teamsById}
                                allowDraw={true}
                                disabled={false}
                                onChange={(updated) => {
                                  setMatchesByGroup((prev) => ({
                                    ...prev,
                                    [g.id]: (prev[g.id] || []).map((x) =>
                                      x.id === updated.id ? updated : x
                                    ),
                                  }));
                                }}
                              />
                            ))}
                          </div>

                          <Separator />
                        </div>
                      );
                    })}

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={createPlacement}
                        disabled={!allGroupMatchesComplete}
                      >
                        Platzierungsspiele erstellen
                      </Button>
                      {!allGroupMatchesComplete ? (
                        <span className="text-xs text-slate-600">
                          (erst möglich, wenn alle Gruppenspiele ein Ergebnis
                          haben)
                        </span>
                      ) : null}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* PLACEMENT */}
          {step === "placement" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">Platzierungsphase</CardTitle>
                  {placement ? (
                    <Badge
                      variant={openPlacementMatches ? "outline" : "secondary"}
                    >
                      {openPlacementMatches
                        ? `${openPlacementMatches} offen`
                        : "komplett"}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Plan</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="grid gap-6">
                {!groups.length ? (
                  <div className="text-sm text-slate-600">
                    Noch keine Gruppen. Bitte im Setup „Gruppen erzeugen“.
                  </div>
                ) : placement ? (
                  <>
                    <div className="text-sm text-slate-600">
                      {placement.note}
                    </div>

                    {placement.pools.map((pool) => {
                      const st =
                        pool.teamIds.length >= 2
                          ? computeStandings(pool.teamIds, pool.matches || [])
                          : [];
                      return (
                        <div key={pool.id} className="grid gap-3">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold">{pool.label}</div>
                            <Badge variant="secondary">
                              {pool.teamIds.length} Teams
                            </Badge>
                          </div>

                          {pool.teamIds.length >= 2 ? (
                            <StandingsTable
                              standings={st}
                              teamsById={teamsById}
                            />
                          ) : (
                            <div className="text-sm text-slate-600">
                              Nur ein Team – Platz wird automatisch gesetzt.
                            </div>
                          )}

                          <div className="grid gap-2">
                            {(pool.matches || []).map((m) => (
                              <MatchRow
                                key={m.id}
                                match={m}
                                teamsById={teamsById}
                                allowDraw={true}
                                disabled={false}
                                onChange={(updated) => {
                                  setPlacement((prev) => {
                                    const next =
                                      typeof structuredClone === "function"
                                        ? structuredClone(prev)
                                        : JSON.parse(JSON.stringify(prev));
                                    const p = next.pools.find(
                                      (x) => x.id === pool.id
                                    );
                                    p.matches = (p.matches || []).map((x) =>
                                      x.id === updated.id ? updated : x
                                    );
                                    return next;
                                  });
                                }}
                              />
                            ))}
                          </div>

                          <Separator />
                        </div>
                      );
                    })}

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={() => setStep("final")}
                        disabled={!allPlacementMatchesComplete}
                      >
                        Finale Tabelle anzeigen
                      </Button>
                      {!allPlacementMatchesComplete ? (
                        <span className="text-xs text-slate-600">
                          (noch {openPlacementMatches} Platzierungsspiele offen)
                        </span>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-slate-600">
                      Hier siehst du den kompletten Modus bis zum Ende. Solange
                      die Gruppenphase noch nicht fertig ist, stehen hier
                      Platzhalter wie „1. Gruppe A“.
                    </div>

                    <div className="grid gap-5">
                      {placementPlan.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-2xl border p-3 grid gap-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-semibold">{p.label}</div>
                            <Badge variant="secondary">
                              {p.slots.length} Teams
                            </Badge>
                          </div>

                          <div className="text-sm text-slate-700">
                            Teilnehmer:{" "}
                            {p.slots.map((s) => s.label).join(" · ")}
                          </div>

                          {p.slots.length >= 2 ? (
                            <div className="grid gap-2">
                              <div className="text-xs text-slate-600">
                                Konkrete Spielpaarungen (Vorschau):
                              </div>
                              {p.matches.map((m) => (
                                <div
                                  key={m.id}
                                  className="rounded-xl border px-3 py-2 text-sm flex items-center justify-between"
                                >
                                  <div className="min-w-0">
                                    <div className="text-[11px] text-slate-600">
                                      {m.label}
                                    </div>
                                    <div className="truncate font-medium">
                                      {m.aLabel}{" "}
                                      <span className="text-slate-600">vs</span>{" "}
                                      {m.bLabel}
                                    </div>
                                  </div>
                                  <Badge variant="outline">offen</Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-slate-600">
                              Nur ein Slot – Platz wird automatisch vergeben.
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={createPlacement}
                        disabled={!allGroupMatchesComplete}
                      >
                        Platzierungsspiele aktivieren
                      </Button>
                      {!allGroupMatchesComplete ? (
                        <span className="text-xs text-slate-600">
                          (noch {openGroupMatches} Gruppenspiele offen)
                        </span>
                      ) : null}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* FINAL */}
          {step === "final" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Finale Tabelle</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {!allPlacementMatchesComplete ? (
                  <div className="text-sm text-slate-600">
                    Finale Tabelle wird vollständig, sobald alle
                    Platzierungsspiele ausgefüllt sind.
                  </div>
                ) : null}
                <FinalTable finalRows={finalRows} teamsById={teamsById} />
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-slate-500">
            Navigation links. Daten bleiben gespeichert, bis du „Speicher
            leeren“ klickst.
          </div>
        </div>
      </div>
    </div>
  );
}
