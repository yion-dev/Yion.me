import ProjectCard from "@/_components/project-card";
import { information, contact, knowledge, education, yionData } from "@/_data/data";
import { getProjects } from "@/_lib/api";
import { ProjectResponseInterface } from "@/_types/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home | Yion Dev",
  description:
    "Software Engineering student at Mae Fah Luang University. Full-Stack Developer focused on backend architectures, IoT ecosystems, and low-level programming.",
};

const experience = [
  {
    role: "Software Engineer",
    organization: "Student Union, Mae Fah Luang University",
    dates: "Jan 2026 – Present",
    details: [
      "Built event backend services supporting more than 2,500 users and two Android apps used by approximately 2,500–2,800 participants.",
      "Developed student voting, event registration, and landing pages; set up Linux servers for applications and databases.",
    ],
  },
  {
    role: "Office Assistant",
    organization: "School of Applied Digital Technology, Mae Fah Luang University",
    dates: "May 2026 – Present",
    details: ["Support office operations and coordinate documents and requests between departments."],
  },
];

export default async function Home() {

  const projects: ProjectResponseInterface[] = await getProjects();

  return (
    <main className="flex w-full min-w-0 flex-col lg:py-4">
      <div className="mx-auto flex h-auto w-full min-w-0 max-w-4xl flex-col gap-4">

        <section className="relative w-full px-4 py-4 lg:flex lg:items-stretch lg:gap-6 lg:p-0">
          <div className="flow-root lg:contents">
            <div className="float-left mb-2 mr-3 w-32 min-[380px]:w-34 sm:w-36 lg:float-none lg:mb-0 lg:mr-0 lg:flex lg:size-52 lg:shrink-0 lg:items-center lg:justify-center lg:border">
              <Image
                priority
                width={843}
                height={843}
                src="/yion-transparent.png"
                alt="Yion profile illustration"
                className="h-auto w-full lg:size-48" />
            </div>
            <div className="pt-14 lg:relative lg:flex lg:w-full lg:min-w-0 lg:min-h-52 lg:flex-col lg:gap-3 lg:px-5 lg:py-4">

            <span className="absolute top-0 left-0 border-t border-l size-4"></span>
            <span className="absolute bottom-0 left-0 border-b border-l size-4"></span>
            <span className="absolute top-0 right-0 border-t border-r size-4"></span>
            <span className="absolute bottom-0 right-0 border-b border-r size-4"></span>

            <div className="mb-3 flex min-w-0 flex-col gap-1 lg:mb-0">
              <h1 className="text-base leading-tight lg:text-xl">
                hello, i am <span className="font-black">yion</span>
              </h1>
              <span className="text-xs">pronounced &quot;Yee On&quot;</span>
            </div>
            <p className="text-sm leading-relaxed lg:text-base">
              {yionData.small_description}
            </p>
            <div className="clear-both mt-3 grid w-full grid-cols-2 gap-4 border-t border-zinc-700/60 pt-3 lg:mt-0 lg:flex lg:justify-between">
              {information.map((e, i) => (
                <div key={i} className="flex min-w-0 flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400">{e.label}</span>
                  <span className="text-xs lg:text-sm">{e.displayText}</span>
                </div>
              ))
              }

            </div>
          </div>
          </div>
        </section>

        <section className="flex relative w-full">
          <div className="flex flex-wrap items-center w-full min-h-10 px-4 py-2 lg:py-0 gap-x-10 gap-y-2 lg:gap-14 border">
            {contact.map((e, i) => (
              <Link key={i} href={e.href} rel="noopener" target="_blank" className="min-w-0 max-w-full">
                <div className="flex h-fit min-w-0 items-center gap-2 text-sm lg:text-base">
                  {e.icon}
                  <span className="min-w-0 break-all">{e.displayText}</span>
                </div>
              </Link>
            ))
            }
          </div>
        </section>

        <section className="relative flex flex-col w-full h-fit min-h-20 mt-3 px-4 py-4 lg:mt-5 lg:py-6 gap-4">

          <span className="absolute top-0 left-0 border-t border-l w-full h-3"></span>
          <span className="absolute top-0 right-0 border-t border-r w-full h-3"></span>
          <span className="absolute bottom-0 left-0 border-b border-l w-full h-3"></span>
          <span className="absolute bottom-0 right-0 border-b border-r w-full h-3"></span>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-1 lg:gap-4">
            <h2 className="text-xl lg:text-2xl"> &gt; Knowledge</h2>
            <div className="flex gap-4 text-xs lg:text-sm font-black">
              <span>[x] = Learnt</span>
              <span>[~] = Learning</span>
            </div>
          </div>

          <div className="grid w-full min-w-0 grid-cols-1 gap-x-3 gap-y-2 text-xs min-[360px]:grid-cols-2 sm:gap-x-6 sm:text-sm lg:grid-cols-3 lg:text-base">
            {knowledge.map((e, i) => (
              <div key={i} className="flex min-w-0 items-start gap-2 sm:gap-4">
                <span className="shrink-0 font-bold">
                  [{e.learnt === true ? <>x</> : e.learnt === 'progress' ? <>~</> : ' '}]
                </span>
                <p className="min-w-0 break-words">{e.displayName}</p>
              </div>
            ))
            }
          </div>

        </section>

        <section className="flex flex-col w-full mt-3 gap-2 lg:mt-5">
          <h2 className="text-xl lg:text-2xl">&gt; Experience</h2>
          <div className="flex flex-col gap-5">
            {experience.map(item => <article key={item.role}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base lg:text-lg">{item.role}</h3>
                <span className="text-xs text-zinc-400 lg:text-sm">{item.dates}</span>
              </div>
              <p className="text-sm text-zinc-400">{item.organization}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed lg:text-base">
                {item.details.map(detail => <li key={detail}>{detail}</li>)}
              </ul>
            </article>)}
          </div>
        </section>

        <span className="w-full h-px my-4 bg-background-secondary lg:my-6"></span>

        <section className="flex flex-col w-full min-h-60 gap-4">

          <h2 className="text-xl lg:text-2xl"> &gt; Projects</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 w-full min-h-60 gap-6 lg:gap-10">
            {
              projects && projects.map((e, i) => (

                <ProjectCard
                  key={ i }
                  project_id={ (i+1) }
                  project_name={e.project_name}
                  project_slug={e.project_slug}
                  project_short_description={e.project_short_description}
                  project_description={e.project_description}
                  project_githubUrl={e.project_githubUrl}
                  project_liveUrl={e.project_liveUrl}
                  project_thumbnailUrl={e.project_thumbnailUrl}
                  project_thumbnailImageUrl={e.project_thumbnailImageUrl}
                  project_techstack={e.project_techstack}
                  project_status={e.project_status}
                  project_pictures={e.project_pictures} />
              ))
            }
          </div>

        </section>

        <span className="w-full h-px my-6 bg-background-secondary"></span>

        <section className="flex flex-col w-full gap-2">
          <h2 className="text-lg lg:text-2xl">&gt; Education</h2>
          <div className="flex w-full flex-col gap-5">

            {education.map((e, i) => (
              <Link key={i} href={e.href} className="group block min-w-0 py-1 focus-visible:outline focus-visible:outline-offset-2">
                <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                  <div className="order-2 flex min-w-0 flex-col sm:order-1">
                    <h3 className="text-base group-hover:underline lg:text-lg">{e.displayName}</h3>
                    <p className="text-xs lg:text-sm">{e.institutionName}</p>
                  </div>
                  <span className="order-1 shrink-0 text-xs opacity-70 sm:order-2 sm:text-sm lg:text-base">
                    {e.timestamp}
                  </span>
                </div>
              </Link>
            ))
            }

          </div>
        </section>

        <span className="w-full h-px my-6 bg-background-secondary"></span>

        <section className="flex flex-col w-full gap-4 pb-4">
          <h2 className="text-lg lg:text-2xl">&gt; Contact</h2>
          <div className="flex flex-col gap-4 max-w-full">
            {
              contact.map((e, i) => (
                <Link key={i} href={e.href} target="_blank" rel="noopener" className="min-w-0">
                  <div className="group relative flex min-w-0 flex-col justify-between gap-1 p-3 transition-all lg:flex-row">
                    <span className="absolute top-0 left-0 border-t border-l size-2 group-hover:w-full group-hover:h-ful"></span>
                    <span className="absolute bottom-0 left-0 border-b border-l size-2 group-hover:w-full group-hover:h-full"></span>
                    <span className="absolute top-0 right-0 border-t border-r size-2 group-hover:w-full group-hover:h-full"></span>
                    <span className="absolute bottom-0 right-0 border-b border-r size-2 group-hover:w-full group-hover:h-full"></span>

                    <h3 className="flex min-w-0 items-center gap-2 break-all">{e.icon}{e.displayText}</h3>
                    <p className="min-w-0 break-all text-sm">{e.href}</p>

                  </div>
                </Link>
              ))

            }
          </div>
        </section>

      </div>

    </main>

  );
}
