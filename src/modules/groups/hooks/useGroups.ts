import { useGlobalRefresh } from "@/store/refreshStore";
import { useCallback, useEffect, useState } from "react";

import { useChurchStore } from "@/store/churchStore";

import { getAllGroups } from "../services/group.service";

import { Group } from "../types/group.types";

export default function useGroups() {
  const tenantId = useChurchStore(s => s.tenantId);

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async (isRefresh = false) => {
      if (!tenantId) return;
      try {
        isRefresh ? setRefreshing(true) : setLoading(true);
        setError("");
        setGroups(await getAllGroups(tenantId));
      } catch (e: any) {
        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Couldn't load groups."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [tenantId]
  );

  useEffect(() => {
    load();
  }, [load]);

  const bump = useGlobalRefresh(() => {
    load();
  });

  return {
    groups,
    loading,
    refreshing,
    error,
    reload: () => load(),
    onRefresh: () => {
      bump();
      load(true);
    },
  };
}
