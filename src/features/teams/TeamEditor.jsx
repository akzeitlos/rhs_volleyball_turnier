import React from "react";
import Input from "../../components/form/Input/Input";

export default function TeamEditor({ teams, setTeams }) {
  return (
    <div className="grid gap-2">
      {teams.map((t, idx) => (
        <div key={t.id} className="grid grid-cols-[48px_1fr] items-center gap-2">
          <div className="text-xs text-slate-600">#{idx + 1}</div>
          <Input
            value={t.name}
            onChange={(e) => {
              const v = e.target.value;
              setTeams((prev) => prev.map((x) => (x.id === t.id ? { ...x, name: v } : x)));
            }}
            placeholder={`Team ${idx + 1}`}
          />
        </div>
      ))}
    </div>
  );
}
