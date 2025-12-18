import React from "react";
import Badge from "../../components/ui/Badge/Badge";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/form/Input/Input";
import Label from "../../components/form/Label/Label";
import TrashIcon from "../../components/icons/TrashIcon";
import { clampInt } from "../../lib/utils";

export default function MatchRow({ match, teamsById, allowDraw, onChange, disabled }) {
  const aName = match.a ? teamsById[match.a]?.name ?? match.a : match.aLabel ?? "—";
  const bName = match.b ? teamsById[match.b]?.name ?? match.b : match.bLabel ?? "—";

  const draftA = match.pointsA ?? "";
  const draftB = match.pointsB ?? "";

  const validNumber = (v) => v === "" || (Number.isFinite(Number(v)) && Number(v) >= 0);
  const drawInvalid =
    !allowDraw &&
    match.a &&
    match.b &&
    match.pointsA != null &&
    match.pointsB != null &&
    Number(match.pointsA) === Number(match.pointsB);

  return (
    <div className={`rounded-lg border p-3 grid gap-2 ${disabled ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs text-slate-600">{match.label ?? "Spiel"}</div>
          <div className="font-medium truncate">
            {aName} <span className="text-slate-600">vs</span> {bName}
          </div>
        </div>
        <Badge variant={match.pointsA == null ? "outline" : "secondary"}>
          {match.pointsA == null ? "offen" : `${match.pointsA}:${match.pointsB}`}
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
              onChange({ ...match, pointsA: v === "" ? null : clampInt(v, 0, 999) });
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
              onChange({ ...match, pointsB: v === "" ? null : clampInt(v, 0, 999) });
            }}
            className="w-28"
            placeholder="0"
          />
        </div>

        <Button
          variant="danger"
          className="ml-auto"
          disabled={disabled || (match.pointsA == null && match.pointsB == null)}
          onClick={() => onChange({ ...match, pointsA: null, pointsB: null })}
        >
        <TrashIcon className="h-5 w-5" />
        </Button>
      </div>

      {drawInvalid ? <div className="text-xs text-red-700">Hier muss ein Sieger feststehen.</div> : null}
    </div>
  );
}
