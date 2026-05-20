import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { aboutmepictures, navLinks } from "@/data/data";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Yion, backend developer from Chiang Rai, Thailand, including skills, technologies, and development experience.",
};

export default function About () {
    return (
        <div className="bg-background text-foreground font-mono font-medium p-4 lg:px-0 lg:py-20">
            <div className="flex flex-col w-full max-w-4xl min-h-200 mx-auto gap-4">
            
                <Navbar links={ navLinks } />

                <main className="w-full h-fit flex flex-col gap-6 lg:gap-10 text-base lg:text-xl">
                 
                    <div className="flex flex-col lg:flex-row gap-4">
                        <p className="lg:max-w-100">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit consequatur esse distinctio eligendi maiores doloribus cumque cupiditate quaerat illum recusandae fugiat, assumenda quis quod, iusto qui laborum magni quidem ipsum pariatur nesciunt, deleniti necessitatibus sit. Deserunt possimus, aut in voluptatem voluptate impedit labore repellendus voluptas harum officia vero aspernatur alias?
                        </p>
                    
                        <div className="relative w-full h-fit">
                            
                            <span className="absolute top-0 left-0 border-t border-l size-4"></span>
                            <span className="absolute bottom-0 left-0 border-b border-l size-4"></span>
                            <span className="absolute top-0 right-0 border-t border-r size-4"></span>
                            <span className="absolute bottom-0 right-0 border-b border-r size-4"></span>
                            
                            <img loading="lazy" src="/aboutme/aboutme1.gif" alt="" className="w-full h-60 lg:h-80 object-cover object-center p-1" />

                        </div>
                    </div>
                 
                    <div className="flex flex-col lg:flex-row gap-4">
                        <p className="lg:max-w-100 lg:order-2">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint cum consequatur dolores esse quidem magni obcaecati ex consequuntur, maiores exercitationem aut alias ad odit excepturi a placeat impedit voluptatibus est nisi? Quibusdam, illo nesciunt? Nam vitae commodi corrupti at assumenda.
                        </p>
                    
                        <div className="relative w-full h-fit lg:order-1">
                            
                            <span className="absolute top-0 left-0 border-t border-l size-4"></span>
                            <span className="absolute bottom-0 left-0 border-b border-l size-4"></span>
                            <span className="absolute top-0 right-0 border-t border-r size-4"></span>
                            <span className="absolute bottom-0 right-0 border-b border-r size-4"></span>
                            
                            <img loading="lazy" src="/aboutme/aboutme2.gif" alt="" className="w-full h-60 lg:h-80 object-cover object-center p-1" />

                        </div>

                    </div>

                    <div className="flex flex-col gap-4">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quisquam natus possimus tenetur nulla minima voluptates culpa velit aliquid voluptatem error nihil quas eaque, at quia iure maxime ipsum?
                        </p>

                        <div className="grid grid-cols-2 grid-rows-2 gap-2">
                        {aboutmepictures.map((e,i) => (
                            <div key={ i } className="relative w-full h-fit">
                                
                                <span className="absolute top-0 left-0 border-t border-l size-2"></span>
                                <span className="absolute bottom-0 left-0 border-b border-l size-2"></span>
                                <span className="absolute top-0 right-0 border-t border-r size-2"></span>
                                <span className="absolute bottom-0 right-0 border-b border-r size-2"></span>
                                
                                <Image height={400} width={400} loading="lazy" src={ e.url } alt={ e.title } className="w-full h-40 lg:h-80 object-cover object-top p-1" />

                            </div>
                        ))}

                        </div>
                    </div>

                    <p className="font-black"> Memento Mori...</p>

                </main>
                <Footer />
            
            </div>
        </div>
    )
}