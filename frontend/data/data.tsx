import EmailIcon from "../components/icons/email"
import GithubIcon from "../components/icons/github"
import LinkedinIcon from "../components/icons/linkedin"
import ResumeIcon from "../components/icons/resume"
import { GraduationCap, PinIcon } from "lucide-react"
import { 
  InformationInterface, 
  ContactInterface, 
  EducationInterface, 
  WorkInterface, 
  KnowledgeInterface, 
  NavLinksInterface, 
  AboutMePictureCardInterface,
  ProjectCardProps} from "../types/types"

export const navLinks:NavLinksInterface[] = [
  {
    displayName: "Home",
    href: "/"
  },
  {
    displayName: "Projects",
    href: "/projects"
  },
  {
    displayName: "Blogs",
    href: "/blogs"
  },
  {
    displayName: "About",
    href: "/about"
  },
]

export const information: InformationInterface[] = [
  {
    displayText: "Software Engineering Student",
    icon: GraduationCap
  },
  {
    displayText: "Mae Fah Luang, Chiang Rai",
    icon: PinIcon
  },
   
]

export const contact: ContactInterface[] = [
  {
    displayText: "Resume",
    icon: <ResumeIcon strokeWidth={ 1.8 } className="size-4 fill-foreground" />,
    href: "https://drive.google.com/file/d/1RCkL5hu20gUZwd_GKLRKv9XPTM_OaQfX/view?usp=sharing"
  },
  {
    displayText: "Github",
    icon: <GithubIcon strokeWidth={ 1.8 } className="size-4 fill-foreground" />,
    href: "https://github.com/yion-dev"
  },
  {
    displayText: "Linkedin",
    icon: <LinkedinIcon strokeWidth={ 1 } className="size-4 fill-foreground" />,
    href: "https://linkedin.com/in/thutanaing"
  },
  {
    displayText: "thutanaing.personal@gmail.com",
    icon: <EmailIcon strokeWidth={ 1 } className="size-4 fill-foreground" />,
    href: "mailto:thutanaing.personal@gmail.com"
  },

]

export const education: EducationInterface[] = [
  {
    displayName: "Software Engineering (B.ENG.)",
    institutionName: "Mae Fah Luang University, Thailand",
    timestamp: "Current",
    href: "https://en.mfu.ac.th/home.html"
  },
  {
    displayName: "High School Diploma Equivalent",
    institutionName: "General Education Development (GED)",
    timestamp: "MAR 2025",
    href: "https://www.ged.com/en/"
  },
  {
    displayName: "Higher National Diploma in Infocomms Technology",
    institutionName: "TMC Academy, Singapore",
    timestamp: "FEB 2025",
    href: "https://www.tmc.edu.sg/"
  },
  {
    displayName: "Foundation Year",
    institutionName: "British University College, Myanmar",
    timestamp: "MAR 2023",
    href: "https://buc.edu.mm/"
  },
  {
    displayName: "High School Year 11",
    institutionName: "Yangon Adventist Seminary International School, Myanmar",
    timestamp: "MAR 2021",
    href: "https://yasis.education/"
  },
]

export const work: WorkInterface[] = [
  {
    displayName: "Office Assistant",
    institutionName: "ADT Office, Mae Fah Luang",
    timestamp: "Current",
    workType: 'Part-Time'
  },
  {
    displayName: "Full-Stack Developer",
    institutionName: "Student Union, Mae Fah Luang",
    timestamp: "Current",
    workType: 'Volunteer'
  },
]

export const knowledge: KnowledgeInterface[] = [
  {
    displayName: "HTML/CSS",
    learnt: true,
  },
  {
    displayName: "JavaScript",
    learnt: true,
  },
  {
    displayName: "TypeScript",
    learnt: true,
  },
  {
    displayName: "React",
    learnt: true,
  },
  {
    displayName: "Nextjs",
    learnt: true,
  },
  {
    displayName: "Python",
    learnt: 'progress',
  },
  {
    displayName: "C",
    learnt: 'progress',
  },
  {
    displayName: "Databases",
    learnt: true,
  },
  {
    displayName: "Git/Github",
    learnt: true,
  },
  {
    displayName: "Bash",
    learnt: false,
  },
  {
    displayName: "C++",
    learnt: false,
  },
  {
    displayName: "Arduino",
    learnt: 'progress',
  },
  {
    displayName: "Data Structure",
    learnt: 'progress',
  },
  {
    displayName: "Algorithm",
    learnt: 'progress',
  },
  {
    displayName: "Cloud Architecture",
    learnt: false,
  },
  {
    displayName: "Rust",
    learnt: false,
  }, 
]

export const projects: ProjectCardProps[] = [
  {
    title: "Juan Discord Bot",
    itemId: "4228-01", 
    href: "github.com/yion-dev/juan-discord-bot",
    gif: "/project1.gif",
    tech: [
      {
        displayName: "Rust",
      }, 
      {
        displayName: "Serenity",
      }
    ],
    description: "Discord bot created with Rust and Serenity Crate that uses Weather API fetch data and return back to users.",
    index: 0,
    status: 'Production'
  },
  {
    title: "Stargazer",
    itemId: "4228-02", 
    href: "github.com/yion-dev/stargazer",
    gif: "/project2.gif",
    tech: [
      {
        displayName: "React",
      }, 
      {
        displayName: "Python",
      },
      {
        displayName: "Flask",
      }
    ],
    description: "Clothing website created with React for the frontend and Python + Flask for the backend",
    index: 1,
    status: 'Production'
  },
]

export const aboutmepictures: AboutMePictureCardInterface[] = [
  {
    title: "...",
    url: "/aboutme/aboutme3.webp"
  },
  {
    title: "...",
    url: "/aboutme/aboutme4.webp"
  },
  {
    title: "...",
    url: "/aboutme/aboutme5.webp"
  },
  {
    title: "...",
    url: "/aboutme/aboutme6.webp"
  },
]