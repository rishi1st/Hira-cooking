// Requests an appropriately-sized, compressed version of an image from
// common CDNs instead of downloading the full-resolution original for a
// small card. This is the single biggest lever for a menu with 1000+
// photos: shaving a 2-3MB source photo down to ~40-80KB per card.
// Falls back to the original URL untouched for hosts we don't recognise.
export function optimizeImageUrl(url, { width = 480, quality = 65 } = {}) {
  if (!url) return url;
  try {
    const u = new URL(url);

    if (u.hostname.includes("unsplash.com")) {
      u.searchParams.set("q", String(quality));
      u.searchParams.set("w", String(width));
      u.searchParams.set("auto", "format");
      u.searchParams.set("fit", "crop");
      return u.toString();
    }

    if (u.hostname.includes("res.cloudinary.com")) {
      return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
    }

    if (u.hostname.includes("imagekit.io")) {
      u.searchParams.set("tr", `w-${width},q-${quality}`);
      return u.toString();
    }

    return url;
  } catch {
    return url;
  }
}