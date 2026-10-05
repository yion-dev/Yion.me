"use client";

import { useState } from "react";
import { VisitorCountryCount } from "@/_types/types";

const PAGE_SIZE = 15;
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

export default function VisitorCountryPages({ countries }: { countries: VisitorCountryCount[] }) {
  const [page, setPage] = useState(1);
  const ranked = [...countries].sort((a, b) => b.visitors - a.visitors || a.country_code.localeCompare(b.country_code));
  const totalPages = Math.ceil(ranked.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = ranked.slice(start, start + PAGE_SIZE);
  const max = ranked[0]?.visitors ?? 1;

  return <section className="public-country-section" aria-labelledby="public-country-title">
    <div className="public-country-heading">
      <h3 id="public-country-title">&gt; By country</h3>
      <span>[ {ranked.length} countries ]</span>
    </div>
    <ol className="public-country-list" start={start + 1}>
      {visible.map((item, index) => <li key={item.country_code} className="public-country-row">
        <span className="public-country-rank">{String(start + index + 1).padStart(2, "0")}</span>
        <span className="public-country-name">{countryNames.of(item.country_code) ?? item.country_code}</span>
        <span className="public-country-bar" aria-hidden="true"><span style={{ width: `${item.visitors / max * 100}%` }} /></span>
        <strong>{item.visitors}</strong>
      </li>)}
    </ol>
    {totalPages > 1 && <nav className="public-country-pages" aria-label="Country pages">
      <span aria-live="polite">[ {start + 1}–{Math.min(start + PAGE_SIZE, ranked.length)} of {ranked.length} · page {currentPage}/{totalPages} ]</span>
      <div>
        <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>[ Prev ]</button>
        <button type="button" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>[ Next ]</button>
      </div>
    </nav>}
  </section>;
}
