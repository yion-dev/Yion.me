import { baseUrl, projectUrl } from "@/lib/constants"
import { ProjectCardProps, TechCardPropsInterface } from "@/types/types"
import clsx from "clsx"
import Link from "next/link"

export default function ProjectCard({ 
    index,
    itemId,
    title, 
    description, 
    tech, 
    status = 'Production', 
    href, 
    gif,
    className
}: ProjectCardProps) {
  return (
    <Link href={ baseUrl + projectUrl + "/" +itemId }>
      <div className={clsx("flex flex-col lg:flex-row h-full gap-4", className)}>
        <div className="flex flex-col justify-evenly text-base">
          <h1 className="text-lg lg:text-xl font-bold">[{index}] {title}</h1>
          <p className="text-sm">{description}</p>
          {/* <p className="mt-4">stack:   {tech}</p> */}
          <div className="flex flex-wrap mt-4 gap-2">
          { tech.map((e,i) => (
              <TechCard key={ i } displayName={ e.displayName } />
            ))

          }
          </div>
          <p>status:  {status}</p>
          <p className="flex justify-between">
            <span>link:    {href}</span>
            <span className="font-black">[Read More]</span>
          </p>
        </div>

        <div className="relative w-full max-w-100 h-fit group">
          <span className="absolute top-0 left-0 border-t border-l size-4"></span>
          <span className="absolute bottom-0 left-0 border-b border-l size-4"></span>
          <span className="absolute top-0 right-0 border-t border-r size-4"></span>
          <span className="absolute bottom-0 right-0 border-b border-r size-4"></span>
          <img src={gif} alt={title} className="w-full max-h-50 object-cover" />
        </div>
      </div>
    </Link>
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