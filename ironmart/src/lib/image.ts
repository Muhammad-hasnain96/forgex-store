/** True if value should render as an <img>, not emoji/text. */
export function isImageUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  if (v.startsWith("/uploads/")) return true;
  if (/^https?:\/\//i.test(v)) return true;
  if (v.startsWith("//")) return true;
  if (/^www\./i.test(v)) return true;
  return /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(v);
}

/** Normalize user-pasted image URLs for use in src. */
export function imageSrc(value: string): string {
  const v = value.trim();
  if (v.startsWith("/uploads/")) return v;
  if (/^https?:\/\//i.test(v)) return v;
  if (v.startsWith("//")) return `https:${v}`;
  if (/^www\./i.test(v) || isImageUrl(v)) return `https://${v.replace(/^\/+/, "")}`;
  return v;
}

/** Proxy external images through our API (avoids hotlink blocks). */
export function proxiedImageSrc(value: string): string {
  if (!isImageUrl(value)) return value;
  const v = value.trim();
  if (v.startsWith("/uploads/")) return v;
  const src = imageSrc(value);
  return `/api/image-proxy?url=${encodeURIComponent(src)}`;
}
