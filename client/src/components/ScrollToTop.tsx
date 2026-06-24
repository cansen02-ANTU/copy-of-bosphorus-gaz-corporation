import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Handles scroll position on navigation:
 * - When the URL has a hash (e.g. /dogal-gaz#talep), scrolls to the matching
 *   element. Because the target element may mount slightly after navigation
 *   (route component rendering), we retry for a short window until it exists.
 * - Otherwise, scrolls to the top of the page.
 *
 * Note: wouter's useLocation only tracks the pathname, not the hash, so we also
 * listen to `hashchange` for same-page anchor clicks.
 */
export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let cancelled = false;
    let attempts = 0;

    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      // Element not mounted yet — retry on the next frame for up to ~1s.
      attempts += 1;
      if (attempts < 60) {
        requestAnimationFrame(tryScroll);
      }
    };

    requestAnimationFrame(tryScroll);

    return () => {
      cancelled = true;
    };
  }, [location]);

  // Handle same-page hash changes (clicking an anchor while already on the page).
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = decodeURIComponent(hash.slice(1));
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
