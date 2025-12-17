import React from "react";
import Card from "../../components/ui/Card/Card";
import CardHeader from "../../components/ui/CardHeader/CardHeader";
import CardTitle from "../../components/ui/CardTitle/CardTitle";
import CardContent from "../../components/ui/CardContent/CardContent";
import Badge from "../../components/ui/Badge/Badge";
import Button from "../../components/ui/Button/Button";
import MatchRow from "../../features/matches/MatchRow";
import StandingsTable from "../../features/standings/StandingsTable";
import { computeStandings } from "../../lib/standings";

export default function PlacementPage({
  groups,
  teamsById,
  placement,
  setPlacement,
  placementPlan,
  openPlacementMatches,
  allGroupMatchesComplete,
  openGroupMatches,
  onCreatePlacement,
  onGoFinal,
  allPlacementMatchesComplete,
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Platzierungsphase</CardTitle>
          {placement ? (
            <Badge variant={openPlacementMatches ? "outline" : "secondary"}>
              {openPlacementMatches ? `${openPlacementMatches} offen` : "komplett"}
            </Badge>
          ) : (
            <Badge variant="outline">Plan</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="grid gap-6">
        {!groups.length ? (
          <div className="text-sm text-slate-600">Noch keine Gruppen. Bitte im Setup „Gruppen erzeugen“.</div>
        ) : placement ? (
          <>
            <div className="text-sm text-slate-600">{placement.note}</div>

            {placement.pools.map((pool) => {
              const st = pool.teamIds.length >= 2 ? computeStandings(pool.teamIds, pool.matches || []) : [];
              return (
                <div key={pool.id} className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{pool.label}</div>
                    <Badge variant="secondary">{pool.teamIds.length} Teams</Badge>
                  </div>

                  {pool.teamIds.length >= 2 ? (
                    <StandingsTable standings={st} teamsById={teamsById} />
                  ) : (
                    <div className="text-sm text-slate-600">Nur ein Team – Platz wird automatisch gesetzt.</div>
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
                              typeof structuredClone === "function" ? structuredClone(prev) : JSON.parse(JSON.stringify(prev));
                            const p = next.pools.find((x) => x.id === pool.id);
                            p.matches = (p.matches || []).map((x) => (x.id === updated.id ? updated : x));
                            return next;
                          });
                        }}
                      />
                    ))}
                  </div>

                  <div className="h-px w-full bg-black/10" />
                </div>
              );
            })}

            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={onGoFinal} disabled={!allPlacementMatchesComplete}>
                Finale Tabelle anzeigen
              </Button>
              {!allPlacementMatchesComplete ? (
                <span className="text-xs text-slate-600">(noch {openPlacementMatches} Platzierungsspiele offen)</span>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-slate-600">
              Hier siehst du den kompletten Modus bis zum Ende. Solange die Gruppenphase noch nicht fertig ist, stehen Platzhalter wie „1. Gruppe A“.
            </div>

            <div className="grid gap-5">
              {placementPlan.map((p) => (
                <div key={p.id} className="rounded-2xl border p-3 grid gap-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{p.label}</div>
                    <Badge variant="secondary">{p.slots.length} Teams</Badge>
                  </div>

                  <div className="text-sm text-slate-700">Teilnehmer: {p.slots.map((s) => s.label).join(" · ")}</div>

                  {p.slots.length >= 2 ? (
                    <div className="grid gap-2">
                      <div className="text-xs text-slate-600">Konkrete Spielpaarungen (Vorschau):</div>
                      {p.matches.map((m) => (
                        <div key={m.id} className="rounded-xl border px-3 py-2 text-sm flex items-center justify-between">
                          <div className="min-w-0">
                            <div className="text-[11px] text-slate-600">{m.label}</div>
                            <div className="truncate font-medium">
                              {m.aLabel} <span className="text-slate-600">vs</span> {m.bLabel}
                            </div>
                          </div>
                          <Badge variant="outline">offen</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600">Nur ein Slot – Platz wird automatisch vergeben.</div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={onCreatePlacement} disabled={!allGroupMatchesComplete}>
                Platzierungsspiele aktivieren
              </Button>
              {!allGroupMatchesComplete ? (
                <span className="text-xs text-slate-600">(noch {openGroupMatches} Gruppenspiele offen)</span>
              ) : null}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
