import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { navLinks } from "@/data/data";
import { baseUrl, blogUrl } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blogs | Yion Dev",
  description:
    "Technical blogs, development notes, programming insights, and software engineering articles written by Yion.",
};

export default function Blogs () {
    return (
        <main className="bg-background text-foreground font-mono font-medium p-4 lg:px-0 lg:py-20">
            <div className="flex flex-col w-full max-w-4xl mx-auto gap-4">
                
 
                <Navbar links={ navLinks } />
                
                
                <main className="relative flex flex-col px-1 py-6 gap-10 ">
                
                    <span className="absolute top-0 left-0 border-t border-l w-full h-2"></span>
                    <span className="absolute top-0 right-0 border-t border-r w-full h-2"></span>
                
                { [...Array(5)].map((e,i) => (
                    <Link key={ i } href={ baseUrl + blogUrl + "/849292-0" + i }>
                        <div className="flex flex-col group cursor-pointer">
                            <h1 className="text-base lg:text-xl font-black lg:font-semibold group-hover:underline">
                                <span className="text-sm lg:text-lg">[{ i+1 }] </span>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis adipisci sequi ut? Quasi ullam dicta voluptates, voluptatum nobis illo quaerat.
                            </h1>

                            
                                <div className="flex items-center justify-between w-full py-2 lg:py-4 font-bold text-sm lg:text-lg ">
                                    <p className="opacity-80">
                                        25-06-2026
                                    </p>
                                    <span>[Read More]</span>
                                </div>
                        </div>
                    </Link>
                ))}
                </main>
 
                <Footer />
 
            </div>
        </main>
    )
}