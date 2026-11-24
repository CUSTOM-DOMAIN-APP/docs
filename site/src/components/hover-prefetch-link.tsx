"use client";

/**
 * The link every docs component renders (sidebar, cards, links in pages), handed to the Fumadocs RootProvider.
 * Next prefetches each link as it scrolls into view, which on a docs page meant fetching a dozen pages while the
 * first one was still loading. This link prefetches on intent instead (hover, focus or touch), Next's own pattern.
 */

import Link from "next/link";
import { forwardRef, useState, type AnchorHTMLAttributes } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { prefetch?: boolean };

export const HoverPrefetchLink = forwardRef<HTMLAnchorElement, Props>(function HoverPrefetchLink(
  { href, onMouseEnter, onFocus, onTouchStart, prefetch, ...props },
  ref,
) {
  const [intent, setIntent] = useState(false);
  if (href === undefined) return <a ref={ref} {...props} />;
  return (
    <Link
      {...props}
      href={href}
      ref={ref}
      prefetch={prefetch === false ? false : intent ? null : false}
      onMouseEnter={(e) => {
        setIntent(true);
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        setIntent(true);
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        setIntent(true);
        onTouchStart?.(e);
      }}
    />
  );
});
