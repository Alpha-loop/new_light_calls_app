const clean = (v: any): string | null => {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t || t.toLowerCase() === "null" || t === "undefined") return null;
  return /^https?:\/\//i.test(t) ? t : null;
};

const PREFERRED = [
  "primaryImageUrl",
  "flierUrl",
  "flyerUrl",
  "imageUrl",
  "bannerUrl",
  "mediaUrl",
  "pictureUrl",
];

/**
 * The event flier. Backend returns unset values as the string
 * "null", and the flier may sit in a different field than the
 * primary image, so try the likely names, then any field whose
 * name looks like an image.
 */
export function getEventImage(event: any): string | null {
  for (const key of PREFERRED) {
    const v = clean(event?.[key]);
    if (v) return v;
  }

  for (const key of Object.keys(event || {})) {
    if (/image|img|flier|flyer|banner|poster|photo|picture/i.test(key)) {
      const v = clean(event[key]);
      if (v) return v;
    }
  }

  return null;
}
