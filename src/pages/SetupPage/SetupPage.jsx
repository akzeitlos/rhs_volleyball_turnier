import React from "react";
import Card from "../../components/ui/Card/Card";
import CardHeader from "../../components/ui/CardHeader/CardHeader";
import CardTitle from "../../components/ui/CardTitle/CardTitle";
import CardContent from "../../components/ui/CardContent/CardContent";
import Button from "../../components/ui/Button/Button";
import Separator from "../../components/ui/Separator/Separator";
import Badge from "../../components/ui/Badge/Badge";
import Switch from "../../components/ui/Switch/Switch";
import Input from "../../components/form/Input/Input";
import Label from "../../components/form/Label/Label";
import TeamEditor from "../../features/teams/TeamEditor";

export default function SetupPage({
  RULES,
  useStorage,
  setUseStorage,
  setup,
  setSetup,
  derived,
  teams,
  setTeams,
  groupsExist,
  onGenerateGroups,
  onClearAll,
  clampInt,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Setup</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4">
        {/* <div className="flex items-center justify-between gap-3">
          <div className="grid gap-1">
            <div className="font-medium">Auto-Speichern</div>
            <div className="text-xs text-slate-600">Speichert alles im Browser (localStorage).</div>
          </div>
          <Switch checked={useStorage} onCheckedChange={setUseStorage} />
        </div> */}

        <div className="text-xs text-slate-600">
              Sieg: {RULES.points.win} Punkte, Unentschieden: {RULES.points.draw} Punkte, Niederlage: {RULES.points.loss} Punkte.
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
              onChange={(e) => setSetup((s) => ({ ...s, teamCount: clampInt(e.target.value, 2, 64) }))}
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
              onChange={(e) => setSetup((s) => ({ ...s, groupSize: clampInt(e.target.value, 2, 16) }))}
            />
            <div className="text-xs text-slate-600">2–16 Teams pro Gruppe.</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Gruppen: {derived.groupCount}</Badge>
          {derived.hasRemainder ? <Badge variant="outline">letzte Gruppe kleiner</Badge> : <Badge variant="outline">gleichmäßig</Badge>}
        </div>

        <Separator />

        <div className="grid gap-2">
          <div className="font-semibold">Teams</div>
          <TeamEditor teams={teams} setTeams={setTeams} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={onGenerateGroups}>{groupsExist ? "Gruppen speichern" : "Gruppen erzeugen"}</Button>
          <Button variant="ghost" onClick={onClearAll}>Speicher leeren</Button>
        </div>

        {groupsExist ? (
          <div className="text-xs text-slate-600">
            Hinweis: Klick auf „Gruppen speichern“ erzeugt Gruppen & Spiele neu (bisherige Ergebnisse werden überschrieben).
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
