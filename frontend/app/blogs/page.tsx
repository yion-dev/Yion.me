import Container from "@/_components/container";
import Footer from "@/_components/footer";
import { getBlogs } from "@/_lib/api";
import { baseUrl, blogUrl } from "@/_lib/constants";
import { BlogResponseInterface } from "@/_types/types";
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
        <main className="w-full h-full flex items-center justify-center">
            <Container className="
                h-full min-h-[80dvh] w-full py-4 lg:py-10 gap-6
                flex flex-col justify-start">
                
                { blogs.map((e,i) => (
                    <Link key={ i } href={`/blogs/${e.blog_id}`}>
                        <div className="flex flex-col w-full h-fit group cursor-pointer">
                            <h1 className="text-base lg:text-xl font-black lg:font-semibold group-hover:underline">
                                <span className="text-sm lg:text-lg">[{ i+1 }] </span>
                                { e.blog_title }
                            </h1>
                                <div className="flex items-center justify-between w-full py-2 lg:py-4 font-bold text-sm lg:text-lg ">
                                    <div className="flex gap-2">
                                        <p className="opacity-80">{ e.blog_author }</p>
                                        <span> { "//" } </span>
                                    <p className="opacity-80">
                                        {e.blog_createdAt && new Date(e.blog_createdAt).toLocaleDateString("en-US", {
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
            </Container>
        </main>
    )
}