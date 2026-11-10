// Canonical site origin, used for metadata, canonical URLs, sitemap and JSON-LD.
// Production lives at https://ankooaiteliers.com; NEXT_PUBLIC_SITE_URL overrides it
// (e.g. for a staging deploy). Local development falls back to localhost.
export const PRODUCTION_URL = "https://ankooaiteliers.com";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:3000")
).replace(/\/$/, "");

export const absoluteUrl = (path = "") =>
  `${SITE_URL}${path.startsWith("/") || path === "" ? "" : "/"}${path}`;

// Keep only social links that point somewhere real (drop bare-domain placeholders).
export const realLinks = (...urls: (string | undefined | null)[]) =>
  urls.filter((u): u is string => {
    if (!u) return false;
    try {
      return new URL(u).pathname.replace(/\/+$/, "").length > 0;
    } catch {
      return false;
    }
  });
