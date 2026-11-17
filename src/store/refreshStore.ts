import { useEffect, useRef } from "react";

import { create } from "zustand";

interface RefreshState {
  tick: number;
  origin: string | null;
  bump: (origin: string) => void;
}

const useRefreshStore = create<RefreshState>(set => ({
  tick: 0,
  origin: null,
  bump: origin => set(s => ({ tick: s.tick + 1, origin })),
}));

/**
 * Lets pull-to-refresh on one screen refresh the whole app.
 *
 * Every data hook registers its own reload here. When any screen
 * pulls to refresh it calls the returned `bump()`, and every OTHER
 * registered hook reloads too (the caller already reloads itself).
 */
export function useGlobalRefresh(reload: () => void) {
  const id = useRef(Math.random().toString(36).slice(2));
  const reloadRef = useRef(reload);
  reloadRef.current = reload;

  useEffect(() => {
    return useRefreshStore.subscribe((state, prev) => {
      if (state.tick !== prev.tick && state.origin !== id.current) {
        reloadRef.current();
      }
    });
  }, []);

  return () => useRefreshStore.getState().bump(id.current);
}
