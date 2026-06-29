import Container from "@/_components/container";
import Footer from "@/_components/footer";
import ProjectCard from "@/_components/project-card";
import { getProject, getProjects } from "@/_lib/api";
import { ProjectResponseInterface } from "@/_types/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects ",
    description:
        "Explore software engineering projects, web applications, backend systems, and development work created by Yion.",
};

export default async function Projects() {
    const projects: ProjectResponseInterface[] = await getProjects()
    return (

        <main className="
            h-auto min-h-screen w-full 
            flex flex-col items-center
            px-4 lg:px-0">

            <Container className="
                h-full py-6 lg:py-10 gap-6
                flex flex-col w-full">
 
                <div className="flex flex-col w-full h-auto gap-10">
                    {projects && projects.map((e, i) => (
                        <ProjectCard 
                            key={ i }
                            variant="horizontal"
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
                    ))}
                </div>

            </Container>

        </main>
    )
}