import React, { useMemo, useState } from "react";
import Card from "../../components/ui/Card/Card";
import CardHeader from "../../components/ui/CardHeader/CardHeader";
import CardTitle from "../../components/ui/CardTitle/CardTitle";
import CardContent from "../../components/ui/CardContent/CardContent";
import Button from "../../components/ui/Button/Button";
import Separator from "../../components/ui/Separator/Separator";
import Badge from "../../components/ui/Badge/Badge";
import Label from "../../components/form/Label/Label";
import TeamEditor from "../../features/teams/TeamEditor";
import SelectListbox from "../../components/form/SelectListbox/SelectListbox";

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
  const [confirmOpen, setConfirmOpen] = useState(false);

  const teamCountOptions = useMemo(
    () =>
      Array.from({ length: 64 - 2 + 1 }, (_, i) => {
        const value = i + 2;
        return { id: value, name: String(value), value };
      }),
    []
  );

  const groupSizeOptions = useMemo(
    () =>
      Array.from({ length: 16 - 2 + 1 }, (_, i) => {
        const value = i + 2;
        return { id: value, name: String(value), value };
      }),
    []
  );

  const selectedTeamCount =
    teamCountOptions.find((o) => o.value === setup.teamCount) ??
    teamCountOptions[0];

  const selectedGroupSize =
    groupSizeOptions.find((o) => o.value === setup.groupSize) ??
    groupSizeOptions[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Auswahl der Teamanzahl, Gruppengröße und Teamnamen
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="text-xs text-slate-600">
          Sieg: {RULES.points.win} Punkte, Unentschieden: {RULES.points.draw}{" "}
          Punkte, Niederlage: {RULES.points.loss} Punkte.
        </div>

        <Separator />

        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Anzahl Teams</Label>
            <SelectListbox
              value={selectedTeamCount}
              options={teamCountOptions}
              onChange={(opt) =>
                setSetup((s) => ({
                  ...s,
                  teamCount: clampInt(opt.value, 2, 64),
                }))
              }
            />
            <div className="text-xs text-slate-600">2–64 Teams.</div>
          </div>

          <div className="grid gap-2">
            <Label>Gruppengröße</Label>
            <SelectListbox
              value={selectedGroupSize}
              options={groupSizeOptions}
              onChange={(opt) =>
                setSetup((s) => ({
                  ...s,
                  groupSize: clampInt(opt.value, 2, 16),
                }))
              }
            />
            <div className="text-xs text-slate-600">2–16 Teams pro Gruppe.</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Gruppen: {derived.groupCount}</Badge>
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
          <Button onClick={onGenerateGroups} disabled={groupsExist}>
            Gruppen erzeugen
          </Button>

          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Alles zurücksetzen
          </Button>
        </div>

        {groupsExist ? (
          <div className="text-xs text-slate-600">
            Gruppen wurden bereits erzeugt. Um sie neu zu erstellen, bitte
            „Alles zurücksetzen“ verwenden. Alle Namen und Ergebnisse werden damit gelöscht.
          </div>
        ) : null}

        {/* Confirm Modal */}
        {confirmOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setConfirmOpen(false)}
            />
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border p-4 grid gap-3">
              <div className="text-lg font-semibold">Alles zurücksetzen?</div>
              <div className="text-sm text-slate-600">
                Dadurch werden Setup, Teams, Gruppen, alle Ergebnisse und die
                Platzierungsphase gelöscht. Das kann nicht rückgängig gemacht
                werden.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                  Abbrechen
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setConfirmOpen(false);
                    onClearAll();
                  }}
                >
                  Ja, alles löschen
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
