/**
 * Posts made from the church's shared admin login come back with
 * that account's own name ("church-app"). Show the church instead.
 */
export const displayPosterName = (
  name: string | undefined,
  churchName?: string
) => {
  const n = (name || "").trim();
  if (!n || /church[\s._-]*app/i.test(n)) {
    return churchName || "Foursquare VGC";
  }
  return n;
};
