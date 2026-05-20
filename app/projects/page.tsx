import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectItem";
import { navLinks, projects } from "@/data/data";

export default function Projects () {
    return (
        <div className="bg-background text-foreground font-mono font-medium p-4 lg:px-0 lg:py-20">
            <div className="flex flex-col w-full max-w-4xl min-h-screen mx-auto gap-4">
                
                <Navbar links={ navLinks } />
                
                <div className="flex flex-col w-full h-auto gap-10">
                { projects.map((e,i) => (
                    <ProjectCard 
                        key={ i }
                        index={ e.index} 
                        title={ e.title } 
                        href={ e.href } 
                        gif={ e.gif } 
                        tech={ e.tech } 
                        description={ e.description } 
                        status={"deployed"} />
                ))}
                </div>

                <Footer />
            </div>
        </div>
    )
}