import { ProjectCardProps, TechCardPropsInterface } from "@/types/types"
import clsx from "clsx"

export default function ProjectCard({ 
    index,
    title, 
    description, 
    tech, 
    status = 'Production', 
    href, 
    thumbnail,
    className
}: ProjectCardProps) {
  return (
    <div className={clsx("flex flex-col lg:flex-row h-full gap-4", className)}>
      <div className="flex flex-col justify-between text-base">
        <h1 className="text-lg lg:text-xl font-bold">[{index}] {title}</h1>
        <p className="text-sm">{description}</p>
        <div className="flex flex-wrap mt-4 gap-2">
          {tech.map((e, i) => (
            <TechCard key={i} displayName={e.displayName} />
          ))

          }
        </div>
        <div className="flex flex-col">
          <p>status:  {status}</p>
          <span>link:    {href}</span>
        </div>
      </div>

      <div className="relative w-full max-w-100 h-fit group">
        <span className="absolute top-0 left-0 border-t border-l size-4"></span>
        <span className="absolute bottom-0 left-0 border-b border-l size-4"></span>
        <span className="absolute top-0 right-0 border-t border-r size-4"></span>
        <span className="absolute bottom-0 right-0 border-b border-r size-4"></span>
        <video
          width={400}
          height={200}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/loading.webp"
          className="w-full max-h-50 object-cover"
        >
          <source src={thumbnail} type="video/webm" />
          <source src={thumbnail} type="video/mp4" />
        </video>
      </div>
    </div>
  )
}


export function TechCard ({
  displayName
}:TechCardPropsInterface) {
  return (
    <div className="w-fit h-fit px-2 text-xs bg-foreground text-background font-black border">
      { displayName }
    </div>
  )
}