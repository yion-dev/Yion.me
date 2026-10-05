"use client";

import { useEffect, useState } from "react";
import VisitorCard from "@/_components/admin-visitor-card";
import { VisitorResponseInterface } from "@/_types/types";
import { getVisitors } from "@/_lib/api";

const PER_PAGE = 20;

export default function WebsiteVisitors() {
  const [visitors, setVisitors] = useState<VisitorResponseInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data: VisitorResponseInterface[] = await getVisitors(true);
      setVisitors([...data].sort((a,b) => b.visitor_visited_at.localeCompare(a.visitor_visited_at)));
      setPage(1);
    } catch { setError("Could not load visitors. Please try again."); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    let active = true;
    getVisitors(true).then((data: VisitorResponseInterface[]) => {
      if (active) setVisitors([...data].sort((a,b) => b.visitor_visited_at.localeCompare(a.visitor_visited_at)));
    }).catch(() => { if (active) setError("Could not load visitors. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const totalPages = Math.max(1, Math.ceil(visitors.length / PER_PAGE));
  const paginated = visitors.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <main className="admin-content" aria-busy={loading}>
      <div className="admin-heading"><div><h2>&gt; Website Visitors</h2><p className="admin-muted">Visitor records, with the newest first.</p></div><button className="admin-action" onClick={refresh} disabled={loading}>[ {loading ? "Loading..." : "Refresh"} ]</button></div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {loading && <p className="admin-muted" role="status">[ loading visitors... ]</p>}
      {!loading && !visitors.length && <p className="admin-empty">No visitor records to display.</p>}
      <div className="admin-visitors">{paginated.map(visitor => <VisitorCard key={visitor.visitor_id} visitor={visitor} />)}</div>
      <p className="admin-muted">IP geolocation by <a href="https://db-ip.com" target="_blank" rel="noopener noreferrer">DB-IP</a>.</p>
      {!!visitors.length && <nav className="admin-pagination" aria-label="Visitor pages"><span className="admin-eyebrow">[ {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, visitors.length)} of {visitors.length} visitors ]</span><div className="flex flex-wrap items-center gap-3"><button className="admin-action" onClick={() => setPage(p => p - 1)} disabled={page === 1}>[ Prev ]</button><span className="text-sm" aria-live="polite">{page} / {totalPages}</span><button className="admin-action" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>[ Next ]</button></div></nav>}
    </main>
  );
}
