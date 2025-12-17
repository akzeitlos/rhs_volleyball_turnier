import { useEffect, useMemo, useState } from "react";
import { uid, clampInt } from "../lib/utils";
import { STEPS } from "../lib/constants";

const DEFAULT_STORAGE_KEY = "volley_turnier_planer_v1";

function makeDefaultState() {
  return {
    step: STEPS.setup,
    useStorage: true,
    setup: { teamCount: 8, groupSize: 4 },
    teams: Array.from({ length: 8 }, (_, i) => ({ id: uid(), name: `Team ${i + 1}` })),
    groups: [],
    matchesByGroup: {},
    placement: null,
  };
}

export default function useTournamentStorage(storageKeyFromEnv) {
  const storageKey = storageKeyFromEnv || DEFAULT_STORAGE_KEY;

  const [state, setState] = useState(() => makeDefaultState());
  const [hydrated, setHydrated] = useState(false);

  // Load once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setState((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      }
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Save on change
  useEffect(() => {
    if (!hydrated) return;
    if (!state.useStorage) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [hydrated, storageKey, state]);

  // Keep teams length in sync with setup.teamCount AFTER hydration
  useEffect(() => {
    if (!hydrated) return;

    setState((prev) => {
      const n = clampInt(prev.setup?.teamCount ?? 8, 2, 64);
      const cur = Array.isArray(prev.teams) ? prev.teams : [];

      if (cur.length === n) return prev;

      if (cur.length > n) {
        return { ...prev, teams: cur.slice(0, n) };
      }

      const add = Array.from({ length: n - cur.length }, (_, i) => ({
        id: uid(),
        name: `Team ${cur.length + i + 1}`,
      }));

      return { ...prev, teams: [...cur, ...add] };
    });
  }, [hydrated, state.setup?.teamCount]);

  const actions = useMemo(() => {
    return {
      setStep: (step) => setState((s) => ({ ...s, step })),
      setUseStorage: (useStorage) => setState((s) => ({ ...s, useStorage })),
      setSetup: (updater) =>
        setState((s) => ({
          ...s,
          setup: typeof updater === "function" ? updater(s.setup) : updater,
        })),
      setTeams: (updater) =>
        setState((s) => ({
          ...s,
          teams: typeof updater === "function" ? updater(s.teams) : updater,
        })),
      setGroups: (groups) => setState((s) => ({ ...s, groups })),
      setMatchesByGroup: (updater) =>
        setState((s) => ({
          ...s,
          matchesByGroup:
            typeof updater === "function" ? updater(s.matchesByGroup) : updater,
        })),
      setPlacement: (placement) => setState((s) => ({ ...s, placement })),

      clearAll: () => {
        try {
          localStorage.removeItem(storageKey);
        } catch {
          // ignore
        }
        setState(makeDefaultState());
      },
    };
  }, [storageKey]);

  return { state, setState, hydrated, storageKey, actions };
}
