
export interface ProjectCardProps {
    index: number,
    title: string,
    href: string,
    gif: string,
    tech: string,
    description: string,
    status: 'deployed' | 'building'
}

export default function ProjectCard({ 
    index, title, description, tech, status = 'deployed', href, gif 
}: ProjectCardProps) {
  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      <div className="flex flex-col justify-evenly text-base">
        <h1 className="text-lg lg:text-xl font-bold">[{index}] {title}</h1>
        <p className="text-sm">{description}</p>
        <p className="mt-4">stack:   {tech}</p>
        <p>status:  {status}</p>
        <p className="flex justify-between">
          <span>link:    {href}</span>
          <span className="font-black">[Read More]</span>
        </p>
      </div>

      <div className="relative w-full max-w-100 h-fit group">
        <span className="absolute top-0 left-0 border-t border-l size-4 rounded-xs"></span>
        <span className="absolute bottom-0 left-0 border-b border-l size-4 rounded-xs"></span>
        <span className="absolute top-0 right-0 border-t border-r size-4 rounded-xs"></span>
        <span className="absolute bottom-0 right-0 border-b border-r size-4 rounded-xs"></span>
        <img src={gif} alt={title} className="w-full max-h-50 object-cover" />
      </div>
    </div>
  )
}