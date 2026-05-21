import { LucideIcon } from "lucide-react"

export interface NavbarProps {
  links: NavLinksInterface[]
}

export interface NavLinksInterface {
  displayName: string,
  href: string,
}

export interface InformationInterface {
  displayText: string,
  icon: LucideIcon 
}

export interface ContactInterface {
  displayText: string
  icon: React.ReactElement
  href: string
}

export interface EducationInterface {
  displayName: string,
  institutionName: string,
  timestamp: string,
  href: string,
}

export interface WorkInterface {
  displayName: string,
  institutionName: string,
  workType: 'Volunteer' | 'Part-Time' | 'Full-Time'
  timestamp: string,
}

export interface KnowledgeInterface {
  displayName: string,
  learnt: boolean| 'progress'
}

export interface AboutMePictureCardInterface {
  title: string,
  url: string,
}

export interface TechCardPropsInterface {
  displayName: string,
}

export interface ProjectCardProps {
  itemId: string,
  index: number,
  title: string,
  href: string,
  gif: string,
  tech: TechCardPropsInterface[],
  description: string,
  status: 'Production' | 'Development'
  className?: string
}

