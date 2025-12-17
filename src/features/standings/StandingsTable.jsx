import React from "react";

export default function StandingsTable({ standings, teamsById }) {
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
              <td className="py-2 pr-2">{teamsById[s.teamId]?.name ?? s.teamId}</td>
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
