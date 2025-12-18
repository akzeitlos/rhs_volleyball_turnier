import React from "react";

// Layout
import SideRail from "./components/layout/SideRail/SideRail";
import StepRenderer from "./components/layout/StepRenderer/StepRenderer";

// Pages
import SetupPage from "./pages/SetupPage";
import GroupsPage from "./pages/GroupsPage";
import MatchesPage from "./pages/MatchesPage";
import PlacementPage from "./pages/PlacementPage";
import FinalPage from "./pages/FinalPage";

// Lib
import { RULES, STEPS } from "./lib/constants";
import { clampInt } from "./lib/utils";

// Hook
import useTournament from "./hooks/useTournament";

export default function VolleyballTurnierTool() {
  const tournament = useTournament(import.meta.env.VITE_STORAGE_KEY);

  const {
    state,
    actions,
    teamsById,
    derived,
    standingsByGroup,
    openGroupMatches,
    openPlacementMatches,
    allGroupMatchesComplete,
    allPlacementMatchesComplete,
    placementPlan,
    finalRows,
    generateGroupsAndSchedule,
    createPlacementAction,
  } = tournament;

  const { step, useStorage, setup, teams, groups, matchesByGroup, placement } =
    state;

  return (
    <div className="min-h-screen bg-slate-50 text-black">
      <SideRail
        step={step}
        setStep={actions.setStep}
        groups={groups}
        placement={placement}
        openGroupMatches={openGroupMatches}
        openPlacementMatches={openPlacementMatches}
        allPlacementMatchesComplete={allPlacementMatchesComplete}
      />

      <div className="pl-24">
        <div className="mx-auto max-w-5xl p-4 md:p-8 grid gap-4">
          <div className="grid gap-2">
            <div className="text-2xl md:text-3xl font-semibold">
              Volleyball Turnier Planer
            </div>
            <div className="text-sm text-slate-600">
              Zeitspiele (Standard {RULES.matchDurationMinutes} Minuten): Sieg{" "}
              {RULES.points.win}, Unentschieden {RULES.points.draw}, Niederlage{" "}
              {RULES.points.loss}.
            </div>
          </div>

          <StepRenderer
            step={step}
            pages={{
              [STEPS.setup]: (
                <SetupPage
                  RULES={RULES}
                  useStorage={useStorage}
                  setUseStorage={actions.setUseStorage}
                  setup={setup}
                  setSetup={actions.setSetup}
                  derived={derived}
                  teams={teams}
                  setTeams={actions.setTeams}
                  groupsExist={groups.length > 0}
                  onGenerateGroups={generateGroupsAndSchedule}
                  onClearAll={actions.clearAll}
                  clampInt={clampInt}
                />
              ),

              [STEPS.groups]: (
                <GroupsPage
                  groups={groups}
                  teamsById={teamsById}
                  standingsByGroup={standingsByGroup}
                />
              ),

              [STEPS.matches]: (
                <MatchesPage
                  groups={groups}
                  teamsById={teamsById}
                  standingsByGroup={standingsByGroup}
                  matchesByGroup={matchesByGroup}
                  setMatchesByGroup={actions.setMatchesByGroup}
                  openGroupMatches={openGroupMatches}
                  RULES={RULES}
                  allGroupMatchesComplete={allGroupMatchesComplete}
                  onCreatePlacement={createPlacementAction}
                />
              ),

              [STEPS.placement]: (
                <PlacementPage
                  groups={groups}
                  teamsById={teamsById}
                  placement={placement}
                  setPlacement={actions.setPlacement}
                  placementPlan={placementPlan}
                  openPlacementMatches={openPlacementMatches}
                  allGroupMatchesComplete={allGroupMatchesComplete}
                  openGroupMatches={openGroupMatches}
                  onCreatePlacement={createPlacementAction}
                  onGoFinal={() => actions.setStep(STEPS.final)}
                  allPlacementMatchesComplete={allPlacementMatchesComplete}
                />
              ),

              [STEPS.final]: (
                <FinalPage
                  allPlacementMatchesComplete={allPlacementMatchesComplete}
                  finalRows={finalRows}
                  teamsById={teamsById}
                />
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}
