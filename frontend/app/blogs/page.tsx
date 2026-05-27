import Footer from "@/components/Footer";
import { getBlogs } from "@/lib/api";
import { baseUrl, blogUrl } from "@/lib/constants";
import { BlogResponseInterface } from "@/types/types";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Technical blogs, development notes, programming insights, and software engineering articles written by Yion.",
};

export default async function Blogs () {
    const blogs:BlogResponseInterface[] = await getBlogs();
    return (
        <main className="w-full h-auto bg-background text-foreground font-mono font-medium px-4 lg:px-0">
            <div className="flex flex-col w-full max-w-4xl mx-auto gap-">
 
                <main className="relative flex flex-col w-full h-auto min-h-180 px-1 py-6 gap-10 ">
                
                { blogs.map((e,i) => (
                    <Link key={ i } href={ baseUrl + blogUrl + "/849292-" + (e.blog_id) }>
                        <div className="flex flex-col group cursor-pointer">
                            <h1 className="text-base lg:text-xl font-black lg:font-semibold group-hover:underline">
                                <span className="text-sm lg:text-lg">[{ i+1 }] </span>
                                { e.blog_title }
                            </h1>
                                <div className="flex items-center justify-between w-full py-2 lg:py-4 font-bold text-sm lg:text-lg ">
                                    <div className="flex gap-2">
                                        <p className="opacity-80">{ e.blog_author }</p>
                                        <span> { "//" } </span>
                                    <p className="opacity-80">
                                        {new Date(e.blog_createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}
                                    </p>
                                    </div>
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