import PublicVisitorMap from "@/_components/public-visitor-map";
import VisitorInfo from "@/_components/visitorinfo-card";
import { getVisitorCountries } from "@/_lib/api";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Visitors",
  description: "Explore where visitors to Yion Dev are coming from.",
};

export default async function VisitorsPage() {
  const countriesByVisit = await getVisitorCountries();

  return (
    <main className="w-full min-w-0 flex-1 lg:py-4">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl lg:text-2xl">&gt; Visitors</h1>
          <p>Where visitors to this site are coming from.</p>
        </div>
        <VisitorInfo />
        <PublicVisitorMap countriesByVisit={countriesByVisit} />
      </div>
    </main>
  );
}
