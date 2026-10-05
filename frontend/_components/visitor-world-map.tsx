import { VisitorResponseInterface } from "@/_types/types";
import countries from "@/_data/world-countries.json";

type Props = {
  visitors: VisitorResponseInterface[];
  loading: boolean;
  unavailable: boolean;
};

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

function countByCountry(visitors: VisitorResponseInterface[]) {
  // Older data can contain multiple records for an IP. Count each address once.
  const countryByIp = new Map<string, string | null>();
  for (const visitor of visitors) {
    const code = visitor.visitor_country_code?.toUpperCase() ?? null;
    const validCode = code && /^[A-Z]{2}$/.test(code) ? code : null;
    if (!countryByIp.has(visitor.visitor_ip_address) || (!countryByIp.get(visitor.visitor_ip_address) && validCode)) {
      countryByIp.set(visitor.visitor_ip_address, validCode);
    }
  }

  const counts = new Map<string, number>();
  for (const code of countryByIp.values()) {
    if (code) counts.set(code, (counts.get(code) ?? 0) + 1);
  }

  return {
    counts,
    identified: [...counts.values()].reduce((total, count) => total + count, 0),
    unknown: countryByIp.size - [...counts.values()].reduce((total, count) => total + count, 0),
  };
}

function intensity(count: number, max: number) {
  if (!count) return 0;
  const share = count / max;
  return share >= 0.75 ? 4 : share >= 0.5 ? 3 : share >= 0.25 ? 2 : 1;
}

export default function VisitorWorldMap({ visitors, loading, unavailable }: Props) {
  const { counts, identified, unknown } = countByCountry(visitors);
  const ranked = [...counts.entries()].sort(([codeA, countA], [codeB, countB]) => countB - countA || codeA.localeCompare(codeB));
  const max = ranked[0]?.[1] ?? 0;
  const statValue = (value: number) => loading || unavailable ? "--" : value;

  return (
    <section className="admin-section admin-map-section" aria-labelledby="visitor-world-title">
      <div className="admin-heading">
        <div>
          <span className="admin-eyebrow">[ visitor analytics ]</span>
          <h2 id="visitor-world-title">&gt; Where visitors come from</h2>
          <p className="admin-muted admin-map-subtitle">Unique visitor IPs grouped by country · all time</p>
        </div>
      </div>

      <div className="admin-map-stats" aria-label="Visitor locations">
        <div className="admin-frame admin-map-stat"><span>[ Identified ]</span><strong>{statValue(identified)}</strong><small>visitors on the map</small></div>
        <div className="admin-frame admin-map-stat"><span>[ Countries ]</span><strong>{statValue(ranked.length)}</strong><small>with recorded visits</small></div>
        <div className="admin-frame admin-map-stat"><span>[ Unknown ]</span><strong>{statValue(unknown)}</strong><small>no country match</small></div>
      </div>

      <div className="admin-frame admin-map-panel">
        <svg className="admin-world-map" viewBox="0 0 1000 500" role="img" aria-label="World map shaded by visitor count per country">
          <g aria-hidden="true">
            <path className="admin-map-grid" d="M0 114H1000 M0 221H1000 M0 329H1000 M0 436H1000 M83 0V500 M250 0V500 M417 0V500 M583 0V500 M750 0V500 M917 0V500" />
            {countries.map((country, index) => {
              const count = counts.get(country.code) ?? 0;
              return <path key={`${country.code}-${index}`} className={`admin-map-country admin-map-level-${intensity(count, max)}`} d={country.path}><title>{`${country.name}${count ? `: ${count} ${count === 1 ? "visitor" : "visitors"}` : ""}`}</title></path>;
            })}
            <circle className={`admin-map-singapore admin-map-level-${intensity(counts.get("SG") ?? 0, max)}`} cx="788.6" cy="288.7" r="4"><title>{`Singapore${counts.get("SG") ? `: ${counts.get("SG")} visitors` : ""}`}</title></circle>
          </g>
        </svg>
        {!loading && !unavailable && !identified && <p className="admin-map-empty">No public IP country data yet.</p>}
        {unavailable && <p className="admin-map-empty">Country data is unavailable.</p>}
      </div>

      <div className="admin-map-breakdown">
        <div className="admin-map-breakdown-heading"><h3>&gt; By country</h3><span className="admin-eyebrow">unique visitors</span></div>
        {loading ? <p className="admin-muted" role="status">[ loading country data... ]</p> : unavailable ? <p className="admin-muted">Country data is unavailable.</p> : ranked.length ? (
          <ol className="admin-map-country-list">
            {ranked.map(([code, count], index) => <li key={code} className="admin-map-country-row">
              <span className="admin-muted">{String(index + 1).padStart(2, "0")}</span>
              <span>{countryNames.of(code) ?? code}</span>
              <span className="admin-map-bar" aria-hidden="true"><span style={{ width: `${count / max * 100}%` }} /></span>
              <strong>{count}</strong>
            </li>)}
          </ol>
        ) : <p className="admin-muted">No countries identified yet.</p>}
      </div>

      <p className="admin-muted admin-map-note">Country is estimated from IP. VPNs and shared networks may affect counts. IP geolocation by <a href="https://db-ip.com" target="_blank" rel="noopener noreferrer">DB-IP</a> · map outlines from <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">Natural Earth</a>.</p>
    </section>
  );
}
