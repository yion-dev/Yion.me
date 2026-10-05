import { VisitorResponseInterface } from "@/_types/types";

export default function VisitorCard({ visitor }: { visitor: VisitorResponseInterface }) {
  const country = visitor.visitor_country_code
    ? new Intl.DisplayNames(["en"], { type: "region" }).of(visitor.visitor_country_code) ?? visitor.visitor_country_code
    : "Unknown country";
  return (
    <article className="admin-frame admin-visitor">
      <header><span>[ visitor #{visitor.visitor_id} ]</span><time dateTime={visitor.visitor_visited_at}>{visitor.visitor_visited_at.slice(0, 16).replace("T", " ")}</time></header>
      <strong>{visitor.visitor_ip_address}</strong>
      <span className="admin-muted">{country}</span>
      <div className="admin-tags">{[...new Set(visitor.visitor_visited_pages)].map(page => <span key={page} className="admin-badge">{page}</span>)}</div>
    </article>
  );
}
