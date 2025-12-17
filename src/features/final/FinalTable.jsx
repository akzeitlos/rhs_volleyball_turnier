import React from "react";

export default function FinalTable({ finalRows, teamsById }) {
  if (!finalRows.length) return <div className="text-sm text-slate-600">Noch keine finale Tabelle.</div>;

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
            <tr key={`${r.place}-${r.teamId}`} className="border-b last:border-b-0">
              <td className="py-2 pr-2 font-semibold">{r.place}</td>
              <td className="py-2 pr-2">{teamsById[r.teamId]?.name ?? r.teamId}</td>
              <td className="py-2 pr-2 text-slate-600">{r.info}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
