import { useMemo } from "react";

import useTournamentStorage from "./useTournamentStorage";

import { STEPS } from "../lib/constants";
import { clampInt } from "../lib/utils";
import { roundRobinMatches } from "../lib/schedule";
import { createGroups } from "../lib/groups";
import {
  placementPreview,
  buildPlacementPools,
  computeFinalTableFromPools,
} from "../lib/placement";

import {
  makeTeamsById,
  deriveSetup,
  computeStandingsByGroup,
  countOpenGroupMatches,
  countOpenPlacementMatches,
  isGroupPhaseComplete,
  isPlacementComplete,
} from "../lib/derived";

export default function useTournament(storageKeyFromEnv) {
  const { state, actions } = useTournamentStorage(storageKeyFromEnv);

  const { step, setup, teams, groups, matchesByGroup, placement } = state;

  // Derived
  const teamsById = useMemo(() => makeTeamsById(teams), [teams]);

  const derived = useMemo(() => deriveSetup(setup, clampInt), [setup]);

  const standingsByGroup = useMemo(
    () => computeStandingsByGroup(groups, matchesByGroup),
    [groups, matchesByGroup]
  );

  const openGroupMatches = useMemo(
    () => countOpenGroupMatches(groups, matchesByGroup),
    [groups, matchesByGroup]
  );

  const openPlacementMatches = useMemo(
    () => countOpenPlacementMatches(placement),
    [placement]
  );

  const allGroupMatchesComplete = useMemo(
    () => isGroupPhaseComplete(groups, openGroupMatches),
    [groups, openGroupMatches]
  );

  const allPlacementMatchesComplete = useMemo(
    () => isPlacementComplete(placement, openPlacementMatches),
    [placement, openPlacementMatches]
  );

  const placementPlan = useMemo(() => placementPreview(groups), [groups]);

  const finalRows = useMemo(
    () => computeFinalTableFromPools(placement),
    [placement]
  );

  // Actions (Tournament)
  const generateGroupsAndSchedule = () => {
    const gs = createGroups({ teams, groupSize: setup.groupSize });

    const schedules = {};
    for (const g of gs) {
      schedules[g.id] = roundRobinMatches(
        g.teamIds,
        `Gruppe ${g.name} – Runde`
      );
    }

    actions.setGroups(gs);
    actions.setMatchesByGroup(schedules);
    actions.setPlacement(null);
    actions.setStep(STEPS.groups);
  };

  const createPlacementAction = () => {
    if (!allGroupMatchesComplete) return;
    const pl = buildPlacementPools(groups, matchesByGroup);
    actions.setPlacement(pl);
    actions.setStep(STEPS.placement);
  };

  return {
    // raw state
    state,
    actions,

    // derived
    teamsById,
    derived,
    standingsByGroup,
    openGroupMatches,
    openPlacementMatches,
    allGroupMatchesComplete,
    allPlacementMatchesComplete,
    placementPlan,
    finalRows,

    // tournament actions
    generateGroupsAndSchedule,
    createPlacementAction,

    // convenience
    step,
  };
}
