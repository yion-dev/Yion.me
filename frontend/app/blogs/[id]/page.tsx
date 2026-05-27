import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { navLinks } from "@/data/data";
import { getBlog, getBlogs } from "@/lib/api";
import { baseUrl, blogUrl } from "@/lib/constants";
import { BlogResponseInterface } from "@/types/types";
import { MoveLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical blogs, development notes, programming insights, and software engineering articles written by Yion.",
};

export default async function Blog ({ params }: { params: Promise<{ id: string }> }) {
    const{ id } = await params;
    const blog:BlogResponseInterface = await getBlog(Number(id.split("-").pop()))
    return (
        <div className="bg-background text-foreground font-mono font-medium p-4 lg:px-0">
            <div className="flex flex-col w-full max-w-4xl mx-auto gap-4">
                
                <main className="relative flex flex-col min-h-180 px-1 gap-6">
                
                        <Link href={ baseUrl + blogUrl }>
                            <div className="relative flex justify-center items-center h-fit w-fit gap-1 opacity-80 group hover:opacity-100">
                                <MoveLeft className="size-4" />
                                Back {blog.blog_title}
                                <span className="absolute bottom-0 left-0.5 w-full h-px bg-transparent group-hover:bg-foreground"></span>
                            </div>
                        </Link>

                        <div className="flex flex-col gap-4">
                            <h1 className="text-base lg:text-2xl font-black lg:font-semibold">
                                { blog.blog_title }
                            </h1>

                            <div className="flex items-center justify-start w-full py-1 gap-4 text-sm lg:text-lg opacity-80">
                                <p>
                                {new Date(blog.blog_createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                                </p>
                                <span> • </span>
                                <span> by { blog.blog_author } </span>
                            </div>

                            <div className="flex text-sm lg:text-lg">
                                <p className="whitespace-pre-line">
                                { blog.blog_description }
                                {/* {`
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Modi a expedita veniam nesciunt reprehenderit, quas fugiat itaque nihil corrupti quaerat amet blanditiis labore animi placeat necessitatibus odio vero nam pariatur possimus, perspiciatis soluta! Velit soluta eos odio rem error ex. Repudiandae doloribus ab aut animi facilis id harum consequatur saepe.

                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint saepe natus vero doloremque maiores consequatur corrupti quos expedita pariatur, soluta sunt! Distinctio aliquid nobis, impedit omnis amet reprehenderit quos eos quas suscipit quo placeat, aperiam fugiat? Hic ea aspernatur esse consequuntur magni obcaecati ipsum doloribus recusandae! Sint, deleniti maiores? Minima temporibus iste nobis tempora at maxime doloremque, in repudiandae ab voluptatum animi asperiores recusandae modi porro, eum omnis dolorum. At possimus est, pariatur natus inventore, ex minus recusandae quasi eius labore enim officia numquam! Vero eligendi quis illum a, blanditiis porro neque possimus vitae ea consequatur ab voluptas debitis dicta!

                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, officiis deserunt doloribus ducimus, iure velit vero nam iste, ad reprehenderit et saepe veniam ab aliquid?
                                `} */}
                                </p>
                            </div>

                        </div>
                </main>
 
                <Footer />
 
            </div>
        </div>
    )
}