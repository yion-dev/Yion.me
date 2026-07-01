import Container from "@/_components/container";
import { getBlog } from "@/_lib/api";
import { BlogResponseInterface } from "@/_types/types";
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
        <div className="w-full h-full flex items-center justify-center">

            <Container className="
                h-full min-h-[80dvh] w-full lg:py-10 gap-6
                flex flex-col justify-start">

                <Link href={"/blogs"}>
                    <div className="relative flex justify-center items-center h-fit w-fit gap-1 opacity-80 group hover:opacity-100">
                        &lt; Back
                        <span className="absolute bottom-0 left-0.5 w-full h-px bg-transparent group-hover:bg-foreground"></span>
                    </div>
                </Link>

                <div className="flex flex-col w-full gap-4">
                    <h1 className="text-xl lg:text-2xl font-black lg:font-semibold">
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

                    <div className="flex w-full text-sm lg:text-lg">
                        <p className="whitespace-pre-line  wrap-break-word truncate">
                            {blog.blog_description}
                        </p>
                    </div>

                </div>
            </Container>
        </div>
    )
}