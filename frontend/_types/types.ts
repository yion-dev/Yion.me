import { LucideIcon } from "lucide-react"
import { ComponentPropsWithoutRef } from "react"

export interface NavbarProps {
  links: NavLinksInterface[],
  websiteVisitorCount: number
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
  thumbnail: string,
  tech: string[],
  description: string,
  status: 'Production' | 'Development'
  className?: string
}

export interface VisitorResponseInterface {
    visitor_id: number
    visitor_visited_pages: string[]
    visitor_ip_address: string
    visitor_visited_at: string
}

export interface BlogResponseInterface{
    blog_id?: string
    blog_title: string
    blog_smallDescription: string
    blog_description: string
    blog_author: string
    blog_createdAt?: string
    blog_updatedAt?: string
}

export interface ProjectResponseInterface {
    project_id?: number
    project_name: string
    project_slug?: string
    project_short_description: string
    project_description: string
    project_githubUrl: string
    project_liveUrl: string
    project_thumbnailUrl: string
    project_techstack: string[]
    project_status: string
    project_pictures: string[]
    project_created_at?: string
    project_updated_at?: string
}

export interface ContainerProps extends ComponentPropsWithoutRef<"section"> {}

export interface GithubRepoInterface {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
}

export interface GithubReadmeInterface {
  name: string;
  path: string;
  sha: string;
  size: number;
  content: string;
  encoding: "base64";
  html_url: string;
  download_url: string;
}

export interface GithubProjectDataInterface {
  repo: GithubRepoInterface;
  readme: string;
  languages: GithubLanguagesInterface;
}

export interface GithubLanguagesInterface {
  [language: string]: number;
}