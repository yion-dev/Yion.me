import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectItem";
import { projects } from "@/data/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects ",
  description:
    "Explore software engineering projects, web applications, backend systems, and development work created by Yion.",
};

export default function Projects () {
    return (
        <main className="bg-background text-foreground font-mono font-medium p-4 lg:px-0">
            <div className="flex flex-col w-full max-w-4xl min-h-screen mx-auto gap-4">
                
                <div className="flex flex-col w-full h-auto gap-10">
                { projects.map((e,i) => (
                    <ProjectCard 
                        key={ i }
                        itemId={ e.itemId }
                        index={ e.index+1 } 
                        title={ e.title } 
                        href={ e.href } 
                        thumbnail={ e.thumbnail } 
                        tech={ e.tech } 
                        description={ e.description } 
                        status={ e.status } />
                ))}
                </div>

                <Footer />
            </div>
        </main>
    )
}