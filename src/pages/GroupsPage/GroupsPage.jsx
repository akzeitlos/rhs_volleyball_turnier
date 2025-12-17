import React from "react";
import Card from "../../components/ui/Card/Card";
import CardHeader from "../../components/ui/CardHeader/CardHeader";
import CardTitle from "../../components/ui/CardTitle/CardTitle";
import CardContent from "../../components/ui/CardContent/CardContent";
import Separator from "../../components/ui/Separator/Separator";
import Badge from "../../components/ui/Badge/Badge";
import GroupsPreview from "../../features/groups/GroupsPreview";
import StandingsTable from "../../features/standings/StandingsTable";

export default function GroupsPage({ groups, teamsById, standingsByGroup }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Gruppen</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {!groups.length ? (
          <div className="text-sm text-slate-600">Noch keine Gruppen. Bitte im Setup „Gruppen erzeugen“.</div>
        ) : (
          <>
            <GroupsPreview groups={groups} teamsById={teamsById} />

            <Separator />

            <div className="grid gap-3">
              <div className="font-semibold">Tabellen (live)</div>
              {groups.map((g, idx) => (
                <div key={g.id} className="rounded-2xl border p-3 grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Gruppe {g.name}</div>
                    <Badge variant="secondary">{g.teamIds.length}</Badge>
                  </div>
                  <StandingsTable standings={standingsByGroup[idx] || []} teamsById={teamsById} />
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
