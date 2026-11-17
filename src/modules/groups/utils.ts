export const clean = (v?: string | null) => {
  const t = v?.trim();
  return !t || t.toLowerCase() === "null" ? "" : t;
};

export const scheduleText = (g: {
  meetingDays?: string | null;
  meetingFrequency?: string | null;
  meetingLocation?: string | null;
}) =>
  [g.meetingFrequency, g.meetingDays, g.meetingLocation]
    .map(clean)
    .filter(Boolean)
    .join(" • ");

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

/** UNVERIFIED: assumes personInGroupID is set only for the user's own groups. */
export const isMyGroup = (g: { personInGroupID?: string | null }) => {
  const id = clean(g.personInGroupID);
  return !!id && id !== EMPTY_GUID;
};
