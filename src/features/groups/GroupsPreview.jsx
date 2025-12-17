import React from "react";
import Badge from "../../components/ui/Badge/Badge";

export default function GroupsPreview({ groups, teamsById }) {
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
