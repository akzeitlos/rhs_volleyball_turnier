import RailButton from "../../ui/RailButton/RailButton";

// Icons
import GearIcon from "../../icons/GearIcon";
import GroupsIcon from "../../icons/GroupsIcon";
import MatchesIcon from "../../icons/MatchesIcon";
import TrophyIcon from "../../icons/TrophyIcon";
import TableIcon from "../../icons/TableIcon";

export default function SideRail({
  step,
  setStep,
  groups,
  placement,
  openGroupMatches,
  openPlacementMatches,
  allPlacementMatchesComplete,
}) {
  const groupBadge = groups.length ? null : "!";
  const matchesBadge = groups.length
    ? openGroupMatches
      ? String(openGroupMatches)
      : null
    : "!";
  const placementBadge = placement
    ? openPlacementMatches
      ? String(openPlacementMatches)
      : null
    : null;

  return (
    <div className="fixed left-0 top-0 bottom-0 w-24 bg-slate-900 text-white border-r border-white/10 flex flex-col items-center gap-2 py-3 z-40">
      <RailButton
        title="Setup"
        active={step === "setup"}
        onClick={() => setStep("setup")}
      >
        <GearIcon className="h-10 w-10" />
      </RailButton>

      <div className="h-px w-14 bg-white/10 my-1" />

      <RailButton
        title="Gruppen"
        active={step === "groups"}
        onClick={() => setStep("groups")}
        badge={groupBadge}
      >
        <GroupsIcon className="h-10 w-10" />
      </RailButton>

      <RailButton
        title="Gruppenphase: Spiele"
        active={step === "matches"}
        onClick={() => setStep("matches")}
        badge={matchesBadge}
      >
        <MatchesIcon className="h-10 w-10" />
      </RailButton>

      <RailButton
        title={
          placement
            ? "Platzierungsphase"
            : "Platzierungsphase (Plan/Vorschau)"
        }
        active={step === "placement"}
        onClick={() => setStep("placement")}
        badge={placementBadge}
      >
        <TrophyIcon className="h-10 w-10" />
      </RailButton>

      <RailButton
        title={
          allPlacementMatchesComplete
            ? "Finale Tabelle"
            : "Finale Tabelle (unvollständig)"
        }
        active={step === "final"}
        onClick={() => setStep("final")}
      >
        <TableIcon className="h-10 w-10" />
      </RailButton>

      <div className="mt-auto" />

      <div className="text-[10px] text-white/60 px-2 text-center">
        {groups.length ? `${groups.length} Gruppen` : "noch keine Gruppen"}
      </div>
    </div>
  );
}
