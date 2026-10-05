import { ProjectResponseInterface } from "@/_types/types"
import clsx from "clsx"
import Link from "next/link"
import Image from "next/image"

type ProjectCardProps = ProjectResponseInterface & {
  className?: string
  variant?: "default" | "horizontal"
}

export default function ProjectCard({
  project_id,
  project_name,
  project_slug,
  project_short_description,
  project_techstack,
  project_status,
  project_liveUrl,
  project_githubUrl,
  project_thumbnailUrl,
  project_thumbnailImageUrl,
  project_pictures,
  className,
  variant = "default",
}: ProjectCardProps) {

  const pictureUrl = project_thumbnailImageUrl || project_pictures?.[0] || null

  const corners = (
    <>
      <span className="absolute top-0 left-0 border-t border-l border-transparent group-hover:border-zinc-300 size-3 z-10 transition-colors" />
      <span className="absolute top-0 right-0 border-t border-r border-transparent group-hover:border-zinc-300 size-3 z-10 transition-colors" />
      <span className="absolute bottom-0 left-0 border-b border-l border-transparent group-hover:border-zinc-300 size-3 z-10 transition-colors" />
      <span className="absolute bottom-0 right-0 border-b border-r border-transparent group-hover:border-zinc-300 size-3 z-10 transition-colors" />
    </>
  )

  const thumbnail = (className: string, sizes: string) => (
    <div className={clsx("relative shrink-0 overflow-hidden bg-zinc-900", className)}>
      <span className="absolute top-0 left-0 border-t border-l border-zinc-100 size-3 z-10" />
      <span className="absolute top-0 right-0 border-t border-r border-zinc-100 size-3 z-10" />
      <span className="absolute bottom-0 left-0 border-b border-l border-zinc-100 size-3 z-10" />
      <span className="absolute bottom-0 right-0 border-b border-r border-zinc-100 size-3 z-10" />
      {project_thumbnailUrl ? <video autoPlay loop muted playsInline preload="metadata" poster="/loading.svg" className="absolute inset-0 h-full w-full object-cover"><source src={project_thumbnailUrl} /></video> : pictureUrl ?
        <Image src={pictureUrl} alt={`${project_name} thumbnail`} fill sizes={sizes} unoptimized={!project_thumbnailImageUrl} className="object-cover" /> :
        <span className="absolute inset-0 flex items-center justify-center text-xs text-zinc-500">[ No media ]</span>}
    </div>
  )

  const titleStatus = (
    <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-4">
      <h2 className="title min-w-0 break-words text-base font-bold text-zinc-100 lg:text-lg">
        [{project_id ?? 0}] {project_name}
      </h2>
      <span className="max-w-full shrink-0 border border-zinc-600 px-2 py-1 text-xs text-zinc-400">
        project_status: {project_status}
      </span>
    </div>
  )

  const info = (
    <div className="flex min-w-0 flex-col gap-4">
      <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">
        {project_short_description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project_techstack.map((e, i) => (
          <TechCard key={i} displayName={e} />
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5 break-all text-sm text-zinc-500">
        <span>status:    {project_status}</span>
        <span>github:    {project_githubUrl || "—"}</span>
        <span>live:      {project_liveUrl || "—"}</span>
      </div>
    </div>
  )

  return (
    <Link href={`/projects/${project_slug}`} className="block w-full min-w-0">

      {variant === "default" && (
        <div className={clsx(
          "flex flex-col gap-4 w-full group relative",
          className
        )}>
          {corners}
          {titleStatus}
          {thumbnail("w-full h-50", "(max-width: 768px) 100vw, 50vw")}
          {info}
        </div>
      )}

      {variant === "horizontal" && (
        <div className={clsx(
          "flex flex-row gap-8 w-full py-4 group relative",
          className
        )}>
          {corners}
          {/* Left — all info */}
          <div className="flex flex-col justify-between flex-1 gap-4">
            {titleStatus}
            {info}
          </div>
          {thumbnail("w-70 min-w-70 h-50", "280px")}
        </div>
      )}

    </Link>
  )
}

export function TechCard({ displayName }: { displayName: string }) {
  return (
    <div className="w-fit h-fit px-2 lg:px-3 text-sm bg-foreground text-background border">
      {displayName}
    </div>
  )
}
