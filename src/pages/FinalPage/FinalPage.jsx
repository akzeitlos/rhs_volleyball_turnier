import React from "react";
import Card from "../../components/ui/Card/Card";
import CardHeader from "../../components/ui/CardHeader/CardHeader";
import CardTitle from "../../components/ui/CardTitle/CardTitle";
import CardContent from "../../components/ui/CardContent/CardContent";
import FinalTable from "../../features/final/FinalTable";

export default function FinalPage({ allPlacementMatchesComplete, finalRows, teamsById }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Finale Tabelle</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {!allPlacementMatchesComplete ? (
          <div className="text-sm text-slate-600">
            Finale Tabelle wird vollständig, sobald alle Platzierungsspiele ausgefüllt sind.
          </div>
        ) : null}
        <FinalTable finalRows={finalRows} teamsById={teamsById} />
      </CardContent>
    </Card>
  );
}
