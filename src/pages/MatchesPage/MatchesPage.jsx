import React from "react";
import Card from "../../components/ui/Card/Card";
import CardHeader from "../../components/ui/CardHeader/CardHeader";
import CardTitle from "../../components/ui/CardTitle/CardTitle";
import CardContent from "../../components/ui/CardContent/CardContent";
import Badge from "../../components/ui/Badge/Badge";
import Button from "../../components/ui/Button/Button";
import Separator from "../../components/ui/Separator/Separator";
import MatchRow from "../../features/matches/MatchRow";
import StandingsTable from "../../features/standings/StandingsTable";

export default function MatchesPage({
  groups,
  teamsById,
  standingsByGroup,
  matchesByGroup,
  setMatchesByGroup,
  openGroupMatches,
  RULES,
  allGroupMatchesComplete,
  onCreatePlacement,
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Gruppenphase: Spiele & Ergebnisse</CardTitle>
          <Badge variant={openGroupMatches ? "outline" : "secondary"}>
            {groups.length ? (openGroupMatches ? `${openGroupMatches} offen` : "komplett") : "—"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6">
        {!groups.length ? (
          <div className="text-sm text-slate-600">Noch keine Gruppen. Bitte im Setup „Gruppen erzeugen“.</div>
        ) : (
          <>
            <div className="text-sm text-slate-600">
              Endstand nach {RULES.matchDurationMinutes} Minuten eintragen. Unentschieden ist erlaubt.
            </div>

            {groups.map((g, gi) => {
              const ms = matchesByGroup[g.id] || [];
              const st = standingsByGroup[gi] || [];
              return (
                <div key={g.id} className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="text-base font-semibold">Gruppe {g.name}</div>
                    <Badge variant="secondary">{ms.length} Spiele</Badge>
                  </div>

                  <div className="rounded-2xl border p-3">
                    <div className="font-semibold mb-2">Tabelle</div>
                    <StandingsTable standings={st} teamsById={teamsById} />
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
                            [g.id]: (prev[g.id] || []).map((x) => (x.id === updated.id ? updated : x)),
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
              <Button onClick={onCreatePlacement} disabled={!allGroupMatchesComplete}>
                Platzierungsspiele erstellen
              </Button>
              {!allGroupMatchesComplete ? (
                <span className="text-xs text-slate-600">(erst möglich, wenn alle Gruppenspiele ein Ergebnis haben)</span>
              ) : null}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
