import Footer from "@/_components/footer";
import { getBlog } from "@/_lib/api";
import { baseUrl, blogUrl } from "@/_lib/constants";
import { BlogResponseInterface } from "@/_types/types";
import { MoveLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Technical blogs, development notes, programming insights, and software engineering articles written by Yion.",
};

export default async function Blog({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const blog: BlogResponseInterface = await getBlog(id)
    return (
        <div className="w-full bg-background text-foreground font-mono font-medium p-4 lg:px-0">
            <div className="flex flex-col w-full max-w-4xl mx-auto gap-4">

                <main className="w-full relative flex flex-col min-h-180 px-1 gap-6">

                    <Link href={baseUrl + blogUrl}>
                        <div className="relative flex justify-center items-center h-fit w-fit gap-1 opacity-80 group hover:opacity-100">
                            <MoveLeft className="size-4" />
                            Back {blog.blog_title}
                            <span className="absolute bottom-0 left-0.5 w-full h-px bg-transparent group-hover:bg-foreground"></span>
                        </div>
                    </Link>

                    <div className="flex flex-col gap-4">
                        <h1 className="text-base lg:text-2xl font-black lg:font-semibold">
                            {blog.blog_title}
                        </h1>

                        <div className="flex items-center justify-start w-full py-1 gap-4 text-sm lg:text-lg opacity-80">
                            <p>
                                {blog.blog_createdAt && new Date(blog.blog_createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </p>
                            <span> • </span>
                            <span> by {blog.blog_author} </span>
                        </div>

                        <div className="flex text-sm lg:text-lg">
                            <p className="whitespace-pre-line">
                                {blog.blog_description}
                            </p>
                        </div>

                    </div>
                </main>

            </div>
        </div>
    )
}