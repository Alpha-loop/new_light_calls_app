import { useCallback, useEffect, useState } from "react";

import { useChurchStore } from "@/store/churchStore";

import { getGroupById } from "../services/group.service";

import { GroupDetail } from "../types/group.types";

export default function useGroupDetail(id?: string) {
  const tenantId = useChurchStore(s => s.tenantId);

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!id || !tenantId) return;
    try {
      setLoading(true);
      setError("");
      setGroup(await getGroupById(tenantId, id));
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Couldn't load this group."
      );
    } finally {
      setLoading(false);
    }
  }, [id, tenantId]);

  useEffect(() => {
    load();
  }, [load]);

  return { group, loading, error, reload: load };
}
