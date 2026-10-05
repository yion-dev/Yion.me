"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function ProjectPictureCarousel({ pictures, projectName }: { pictures: string[]; projectName: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  if (!pictures.length) return null;

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(index, pictures.length - 1));
    track.scrollTo({ left: next * track.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    setActive(next);
  }

  return <section className="flex min-w-0 flex-col gap-3" aria-label={`${projectName} photos`}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-sm lg:text-lg">## Project pictures</h3>
      <span className="text-xs text-zinc-400">[ {active + 1} / {pictures.length} ]</span>
    </div>
    <div className="relative min-w-0 border border-zinc-700 bg-zinc-900" role="region" aria-roledescription="carousel" aria-label={`${projectName} picture gallery`}>
      <div ref={trackRef} className="project-carousel-track flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain" onScroll={event => {
        const track = event.currentTarget;
        if (track.clientWidth) setActive(Math.round(track.scrollLeft / track.clientWidth));
      }}>
        {pictures.map((url, index) => <div key={`${url}-${index}`} className="relative aspect-[4/3] w-full flex-none snap-center sm:aspect-video" role="group" aria-roledescription="slide" aria-label={`Picture ${index + 1} of ${pictures.length}`}>
          <Image unoptimized src={url} alt={`${projectName} picture ${index + 1}`} fill sizes="(max-width: 896px) 100vw, 896px" className="object-contain" />
        </div>)}
      </div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
      {pictures.length > 1 ? <div className="flex gap-2">
        <button type="button" className="border border-zinc-600 px-3 py-2 disabled:opacity-40" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous project picture">[ Prev ]</button>
        <button type="button" className="border border-zinc-600 px-3 py-2 disabled:opacity-40" onClick={() => goTo(active + 1)} disabled={active === pictures.length - 1} aria-label="Next project picture">[ Next ]</button>
      </div> : <span />}
      <a href={pictures[active]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">[ Open image ]</a>
    </div>
  </section>;
}
