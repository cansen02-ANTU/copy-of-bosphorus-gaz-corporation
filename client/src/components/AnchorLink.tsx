import { Link, useLocation } from "wouter";
import type { ComponentProps } from "react";

/**
 * A wouter Link wrapper for in-app hash anchors (e.g. "/sirketimiz#vizyon").
 *
 * Why this exists: when the user is ALREADY on the target page, clicking a
 * Link that only changes the hash (same pathname) pushes the new location
 * without firing a real `hashchange` event, so the global ScrollToTop effect
 * (keyed on pathname) does not re-run and the page stays put. This component
 * detects that same-path case and scrolls to the target element directly.
 *
 * For cross-page navigation, it behaves like a normal Link and lets the global
 * ScrollToTop handler scroll to the hash once the destination page mounts.
 */
type AnchorLinkProps = ComponentProps<typeof Link> & { href: string };

export default function AnchorLink({ href, onClick, ...rest }: AnchorLinkProps) {
  const [location] = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e as never);

    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;

    const path = href.slice(0, hashIndex) || "/";
    const id = href.slice(hashIndex + 1);

    // Same page already? Scroll directly — wouter won't emit a usable event.
    if (path === location) {
      requestAnimationFrame(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
