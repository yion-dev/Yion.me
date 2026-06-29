import Footer from "@/_components/footer";
import ProjectCard from "@/_components/project-card";
import { information, contact, knowledge, work, education, yionData } from "@/_data/data";
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

export default async function Home() {

  const projects: ProjectResponseInterface[] = await getProjects()

  return (
    <main className="flex flex-col p-4 lg:px-0">
      <div className="flex flex-col w-full h-auto max-w-4xl mx-auto gap-4">

        <section className="flex flex-col lg:flex-row w-full gap-6">
          <div className="h-full w-fit min-w-35 box-border overflow-hidden">
            <Image
              priority
              width={200}
              height={200}
              src="/yion-square.webp"
              alt="yion"
              className="h-25 lg:h-35 w-auto min-w-25 lg:min-w-35 opacity-80 overflow-hidden border-2 border-foreground" />
          </div>
          <div className="relative flex flex-col justify-between h-full min-h-35 w-full px-4 py-3">

            <span className="absolute top-0 left-0 border-t border-l size-4"></span>
            <span className="absolute bottom-0 left-0 border-b border-l size-4"></span>
            <span className="absolute top-0 right-0 border-t border-r size-4"></span>
            <span className="absolute bottom-0 right-0 border-b border-r size-4"></span>

            <div className="flex flex-col w-full h-full gap-2">
              <h1 className="text-base lg:text-xl">
                hello, i am
                <span className="w-full font-black"> yion</span>
                <span className=" text-xs"> - pronounced &quot;Yee On&quot;</span>
              </h1>
              <p className="text-sm lg:text-base">
                {yionData.small_description}
              </p>
            </div>
            <div className="flex w-full min-h-fit mt-4 lg:mt-0 lg:-mb text-xs lg:text-sm gap-4 lg:gap-10">
              {information.map((e, i) => (
                <div key={i} className="flex justify-center w-auto h-fit gap-2">
                  <e.icon strokeWidth={1.8} className="size-4.5" />
                  {e.displayText}
                </div>
              ))
              }

            </div>
          </div>
        </section>

        <section className="flex relative w-full">
          <div className="flex flex-wrap items-center w-full min-h-10 px-4 py-2 lg:py-0 gap-x-10 gap-y-2 lg:gap-14 border">
            {contact.map((e, i) => (
              <Link key={i} href={e.href} rel="noopener" target="_blank">
                <div className="flex items-center lg:justify-center w-fit lg:min-w-0 h-fit gap-2 text-sm lg:text-base">
                  {e.icon}
                  {e.displayText}
                </div>
              </Link>
            ))
            }
          </div>
        </section>

        <section className="relative flex flex-col w-full h-fit min-h-20 mt-5 px-4 py-4 lg:py-6 gap-4">

          <span className="absolute top-0 left-0 border-t border-l w-full h-3"></span>
          <span className="absolute top-0 right-0 border-t border-r w-full h-3"></span>
          <span className="absolute bottom-0 left-0 border-b border-l w-full h-3"></span>
          <span className="absolute bottom-0 right-0 border-b border-r w-full h-3"></span>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-1 lg:gap-4">
            <h2 className="text-xl lg:text-2xl"> &gt; Knowledge</h2>
            <div className="flex gap-4 text-xs lg:text-sm font-black">
              <span>[ ] = Not Learnt</span>
              <span>[x] = Learnt</span>
              <span>[~] = Learning</span>
            </div>
          </div>

          <div className="flex flex-col flex-wrap w-full h-full max-h-60 lg:max-h-40 gap-y-2  gap-x-6 lg:gap-x-1 lg:gap-y-1 text-sm lg:text-base">
            {knowledge.map((e, i) => (
              <div key={i} className="flex items-ceenter gap-4 ">
                <span className="font-bold">
                  [{e.learnt === true ? <>x</> : e.learnt === 'progress' ? <>~</> : ' '}]
                </span>
                <p>{e.displayName}</p>
              </div>
            ))
            }
          </div>

        </section>

        <section className="flex flex-col  realtive w-full mt-5 gap-2">
          <h2 className="text-xl lg:text-2xl">&gt; Work Experience</h2>
          <div className="flex flex-col w-full h-auto gap-4">

            {work.map((e, i) => (
              <div key={i} className="flex justify-between w-full h-fit min-h-10 py-1">
                <div className="flex flex-col w-auto h-fit gap-0">
                  <h2 className="text-sm lg:text-lg">{e.displayName} [ {e.workType} ]</h2>
                  <p className="-mt-1 text-xs lg:text-sm">{e.institutionName}</p>
                </div>
                <div >
                  {e.timestamp}
                </div>

              </div>
            ))
            }

          </div>
        </section>

        <span className="w-full h-px my-6 bg-background-secondary"></span>

        <section className="flex flex-col w-full min-h-60 gap-4">

          <h2 className="text-xl lg:text-2xl"> &gt; Projects</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 w-full min-h-60 gap-10">
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
          <div className="flex flex-col w-full h-auto gap-4">

            {education.map((e, i) => (
              <Link key={i} href={e.href}>
                <div className="flex justify-between w-full h-fit min-h-10 py-1 hover:bg-background-secondary hover:text-zinc-900 hover:ps-2">
                  <div className="flex flex-col w-auto max-w-70 lg:max-w-200 h-fit gap-0">
                    <h2 className="text-base lg:text-lg">{e.displayName}</h2>
                    <p className="-mt-1 text-xs lg:text-sm">{e.institutionName}</p>
                  </div>
                  <div className="text-sm lg:text-base">
                    {e.timestamp}
                  </div>

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
                <Link key={i} href={e.href} target="_blank" rel="noopener">
                  <div className="relative flex flex-col lg:flex-row justify-between p-3 group transition-all">
                    <span className="absolute top-0 left-0 border-t border-l size-2 group-hover:w-full group-hover:h-ful"></span>
                    <span className="absolute bottom-0 left-0 border-b border-l size-2 group-hover:w-full group-hover:h-full"></span>
                    <span className="absolute top-0 right-0 border-t border-r size-2 group-hover:w-full group-hover:h-full"></span>
                    <span className="absolute bottom-0 right-0 border-b border-r size-2 group-hover:w-full group-hover:h-full"></span>

                    <h3 className="flex items-center gap-2 ">{e.icon}{e.displayText}</h3>
                    <p className="min-w-0 wrap-break-word text-sm">{e.href}</p>

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

