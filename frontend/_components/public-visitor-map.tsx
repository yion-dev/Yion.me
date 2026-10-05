import countries from "@/_data/world-countries.json";
import { VisitorCountryCount } from "@/_types/types";
import VisitorCountryPages from "@/_components/visitor-country-pages";

function intensity(count: number, max: number) {
  if (!count) return 0;
  const share = count / max;
  return share >= .75 ? 4 : share >= .5 ? 3 : share >= .25 ? 2 : 1;
}

export default function PublicVisitorMap({ countriesByVisit }: { countriesByVisit: VisitorCountryCount[] | null }) {
  const ranked = (countriesByVisit ?? []).filter(item => /^[A-Z]{2}$/.test(item.country_code) && item.visitors > 0);
  const counts = new Map(ranked.map(item => [item.country_code, item.visitors]));
  const max = Math.max(0, ...ranked.map(item => item.visitors));

  return <section className="public-map-section" aria-labelledby="public-map-title">
    <h2 id="public-map-title" className="text-xl lg:text-2xl">&gt; Visitors info</h2>
    <div className="public-map-frame">
      <svg className="public-world-map" viewBox="0 0 1000 500" role="img" aria-label="World map shaded by visitor count per country">
        <path className="public-map-grid" d="M0 114H1000 M0 221H1000 M0 329H1000 M0 436H1000 M83 0V500 M250 0V500 M417 0V500 M583 0V500 M750 0V500 M917 0V500" />
        {countries.map((country, index) => {
          const count = counts.get(country.code) ?? 0;
          return <path key={`${country.code}-${index}`} className={`public-map-country public-map-level-${intensity(count, max)}`} d={country.path}><title>{`${country.name}: ${count} ${count === 1 ? "visitor" : "visitors"}`}</title></path>;
        })}
        <circle className={`public-map-singapore public-map-level-${intensity(counts.get("SG") ?? 0, max)}`} cx="788.6" cy="288.7" r="4"><title>{`Singapore: ${counts.get("SG") ?? 0} visitors`}</title></circle>
      </svg>
      {countriesByVisit === null ? <p className="public-map-empty">Visitor locations are temporarily unavailable.</p> : !ranked.length ? <p className="public-map-empty">No visitor countries recorded yet.</p> : null}
    </div>
    {!!ranked.length && <VisitorCountryPages countries={ranked} />}
  </section>;
}
