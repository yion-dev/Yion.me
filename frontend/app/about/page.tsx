import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { aboutmepictures, navLinks, yionData } from "@/data/data";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Yion, backend developer from Chiang Rai, Thailand, including skills, technologies, and development experience.",
};

export default function About () {
    return (
        <main className="bg-background text-foreground font-mono font-medium p-4 lg:px-0">
            <div className="flex flex-col w-full max-w-4xl min-h-200 mx-auto gap-4">
            
                <main className="w-full h-fit flex flex-col gap-6 lg:gap-10 text-base lg:text-xl">
                 
                    <div className="flex flex-col lg:flex-row gap-4">
                        <p className="lg:max-w-100">
                            { yionData.about_me_1 }
                        </p>
                    
                        <div className="relative w-full h-fit">
                            
                            <span className="absolute top-0 left-0 border-t border-l size-4"></span>
                            <span className="absolute bottom-0 left-0 border-b border-l size-4"></span>
                            <span className="absolute top-0 right-0 border-t border-r size-4"></span>
                            <span className="absolute bottom-0 right-0 border-b border-r size-4"></span>
                            
                            <video
                                width={400}
                                height={200}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                poster="/loading.webp"
                                className="w-full max-h-80 object-cover"
                            >
                                <source src={aboutmepictures[0].url} type="video/webm" />
                            </video>
                            
                        </div>
                    </div>
                 
                    <div className="flex flex-col lg:flex-row gap-4">
                        <p className="lg:max-w-100 lg:order-2">
                            { yionData.about_me_2 }
                        </p>
                    
                        <div className="relative w-full h-fit lg:order-1">
                            
                            <span className="absolute top-0 left-0 border-t border-l size-4"></span>
                            <span className="absolute bottom-0 left-0 border-b border-l size-4"></span>
                            <span className="absolute top-0 right-0 border-t border-r size-4"></span>
                            <span className="absolute bottom-0 right-0 border-b border-r size-4"></span>

                            <video
                                width={400}
                                height={200}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                poster="/loading.webp"
                                className="w-full max-h-70 object-cover"
                            >
                                <source src={aboutmepictures[1].url} type="video/webm" />
                            </video>

                        </div>

                    </div>

                    <div className="flex flex-col gap-4">
                        <p>
                            { yionData.about_me_3 }
                        </p>

                        <div className="grid grid-cols-2 grid-rows-2 gap-2">
                        {aboutmepictures.slice(2,6).map((e,i) => (
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

                    <p className="font-black text-center mt-4 py-4">
                         Memento Mori...
                    </p>

                </main>
                <Footer />
            
            </div>
        </main>
    )
}