"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!/^\/(?:about|projects(?:\/[A-Za-z0-9_-]+)?|blogs(?:\/[A-Za-z0-9_-]+)?)?$/.test(pathname)) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    // A browser request preserves the visitor connection; server-side fetches do not.
    // No IP address or query string is supplied by the browser.
    void fetch("/api/visitors/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => { /* Analytics must never interrupt navigation. */ });
  }, [pathname]);

  return null;
}
