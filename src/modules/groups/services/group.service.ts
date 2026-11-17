import { api } from "@/services/apiClient";

import { GroupDetail, Group } from "../types/group.types";

/**
 * Join-request endpoint — not built on the backend yet.
 * Set this (and adjust the body in requestToJoinGroup) once the
 * backend team confirms it. While null, the Join button is
 * disabled so members aren't told a request was sent when it wasn't.
 */
export const JOIN_GROUP_ENDPOINT: string | null = null;

export const getAllGroups = async (
  tenantId: string,
  page = 1,
  pageSize = 50
): Promise<Group[]> => {
  const res = await api.get("/portal/PortalEvents/AllGroups", {
    params: { tenantId, page, pageSize },
  });

  if (res.data?.status === false) {
    throw new Error(res.data?.message || "Unable to load groups");
  }

  return res.data?.object ?? [];
};

export const getGroupById = async (
  tenantId: string,
  id: string
): Promise<GroupDetail> => {
  const res = await api.get(`/portal/PortalEvents/${id}/group`, {
    params: { tenantId },
  });

  if (res.data?.status === false || !res.data?.object) {
    throw new Error(res.data?.message || "Group not found");
  }

  return res.data.object;
};

export const requestToJoinGroup = async (payload: {
  groupId: string;
  tenantId: string;
  userId?: string;
}) => {
  if (!JOIN_GROUP_ENDPOINT) {
    throw new Error("Join requests are not available yet.");
  }

  const res = await api.post(JOIN_GROUP_ENDPOINT, payload);

  if (res.data?.status === false) {
    throw new Error(res.data?.message || "Unable to send request");
  }

  return res.data;
};
