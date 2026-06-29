import { ProjectResponseInterface } from "@/_types/types"
import clsx from "clsx"
import Link from "next/link"

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
  className,
  variant = "default",
}: ProjectCardProps) {

  const corners = (
    <>
      <span className="absolute top-0 left-0 border-t border-l border-transparent group-hover:border-zinc-600 size-3 z-10 transition-colors" />
      <span className="absolute top-0 right-0 border-t border-r border-transparent group-hover:border-zinc-600 size-3 z-10 transition-colors" />
      <span className="absolute bottom-0 left-0 border-b border-l border-transparent group-hover:border-zinc-600 size-3 z-10 transition-colors" />
      <span className="absolute bottom-0 right-0 border-b border-r border-transparent group-hover:border-zinc-600 size-3 z-10 transition-colors" />
    </>
  )

  const thumbnail = (
    <div className="relative w-full h-50 shrink-0">
      <span className="absolute top-0 left-0 border-t border-l border-zinc-100 size-3 z-10" />
      <span className="absolute top-0 right-0 border-t border-r border-zinc-100 size-3 z-10" />
      <span className="absolute bottom-0 left-0 border-b border-l border-zinc-100 size-3 z-10" />
      <span className="absolute bottom-0 right-0 border-b border-r border-zinc-100 size-3 z-10" />
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/loading.svg"
        className="w-full h-full object-cover"
      >
        <source src={project_thumbnailUrl} type="video/webm" />
        <source src={project_thumbnailUrl} type="video/mp4" />
      </video>
    </div>
  )

  const titleStatus = (
    <div className="flex items-start justify-between gap-4">
      <h2 className="title text-base lg:text-lg font-bold text-zinc-100">
        [{project_id ?? 0}] {project_name}
      </h2>
      <span className="text-x1s border border-zinc-600 px-2 py-1 text-zinc-400 whitespace-nowrap shrink-0">
        project_status: {project_status}
      </span>
    </div>
  )

  const info = (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-zinc-600 leading-relaxed">
        {project_short_description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project_techstack.map((e, i) => (
          <TechCard key={i} displayName={e} />
        ))}
      </div>
      <div className="flex flex-col gap-0.5 text-xs text-zinc-500">
        <span>status:    {project_status}</span>
        <span>github:    {project_githubUrl || "—"}</span>
        <span>live:      {project_liveUrl || "—"}</span>
      </div>
    </div>
  )

  return (
    <Link href={`/projects/${project_slug}`} className="block w-full">

      {variant === "default" && (
        <div className={clsx(
          "flex flex-col gap-4 w-full p-4 group relative",
          className
        )}>
          {corners}
          {titleStatus}
          {thumbnail}
          {info}
        </div>
      )}

      {variant === "horizontal" && (
        <div className={clsx(
          "flex flex-row gap-8 w-full p-4 group relative",
          className
        )}>
          {corners}
          {/* Left — all info */}
          <div className="flex flex-col justify-between flex-1 gap-4">
            {titleStatus}
            {info}
          </div>
          {/* Right — video */}
          <div className="relative w-70 min-w-70 h-full shrink-0">
            <span className="absolute top-0 left-0 border-t border-l border-zinc-100 size-3 z-10" />
            <span className="absolute top-0 right-0 border-t border-r border-zinc-100 size-3 z-10" />
            <span className="absolute bottom-0 left-0 border-b border-l border-zinc-100 size-3 z-10" />
            <span className="absolute bottom-0 right-0 border-b border-r border-zinc-100 size-3 z-10" />
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/loading.svg"
              className="w-full h-full object-cover"
            >
              <source src={project_thumbnailUrl} type="video/webm" />
              <source src={project_thumbnailUrl} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

    </Link>
  )
}

export function TechCard({ displayName }: { displayName: string }) {
  return (
    <div className="w-fit h-fit px-2 lg:px-3 text-xs lg:text-sm bg-foreground text-background border">
      {displayName}
    </div>
  )
}