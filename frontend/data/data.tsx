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
    thumbnail: "https://lruzdrf7t7zl7ff6.public.blob.vercel-storage.com/Projects/project1.webm",
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
    thumbnail: "https://lruzdrf7t7zl7ff6.public.blob.vercel-storage.com/Projects/project2.webm",
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
    title: "About Me Video 1",
    url: "https://lruzdrf7t7zl7ff6.public.blob.vercel-storage.com/aboutme1.webm"
  },
  {
    title: "About Me Video 2",
    url: "https://lruzdrf7t7zl7ff6.public.blob.vercel-storage.com/aboutme2.webm"
  },
  {
    title: "About Me Pic 1",
    url: "https://lruzdrf7t7zl7ff6.public.blob.vercel-storage.com/aboutme3.webp"
  },
  {
    title: "About Me Pic 2",
    url: "https://lruzdrf7t7zl7ff6.public.blob.vercel-storage.com/aboutme4.webp"
  },
  {
    title: "About Me Pic 3",
    url: "https://lruzdrf7t7zl7ff6.public.blob.vercel-storage.com/aboutme5.webp"
  },
  {
    title: "About Me Pic 4",
    url: "https://lruzdrf7t7zl7ff6.public.blob.vercel-storage.com/aboutme6.webp"
  },
]

export const yionData = {
  small_description: "I am a Backend Developer and a Software Engineering student at Mae Fah Luang University. Currently exploring Embedded Systems and Low-Level Programming on the side.",

  about_me_1: "I am Thuta Naing but many people know me as Yion. I am a software developer originally from Myanmar, currently living in Chiang Rai, Thailand. I am currently studying in Mae Fah Luang University as a Software Engineering Student. I spend most of my time building backend systems, writing APIs, and occasionally breaking things just to fix them again. I don't just like Software Engineering — I love Technology in general.",

  about_me_2: "Outside of software, I enjoy learning about different fields within the Technology industry. Currently, I am exploring Embedded Systems and IoT using microcontrollers like Arduino and ESP32 with various modules. I am also really interested in Operating Systems and Hardware Architecture, which I plan to learn in the future.",

  about_me_3: "When I am not coding, you will find me spending time with my beloved, cooking, or taking random photos. I also play table tennis whenever I get the chance. I enjoy a quiet life without many distractions. I rather spend my time improving myself and being with my loved one. I believe that everyone is bound to die one day, but that doesn't mean we have to live in misery."
}