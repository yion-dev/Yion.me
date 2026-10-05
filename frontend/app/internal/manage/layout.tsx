"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./manage.css";

const links = [
  ["Overview", "dashboard"],
  ["New Project", "projects"],
  ["New Blog", "blogs"],
  ["Images", "images"],
  ["Visitors", "website-visitors"],
];

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="admin-shell">
      <header className="admin-frame admin-intro">
        <span className="admin-eyebrow">$ portfolio / manage</span>
        <h1>&gt; Admin</h1>
        <p className="admin-muted">A little space to manage what you share with the world.</p>
      </header>
      <nav className="admin-nav" aria-label="Administration">
        {links.map(([label, path]) => {
          const href = `/internal/manage/${path}`;
          return <Link key={path} href={href} aria-current={pathname === href ? "page" : undefined}>[ {label} ]</Link>;
        })}
      </nav>
      {children}
    </div>
  );
}
