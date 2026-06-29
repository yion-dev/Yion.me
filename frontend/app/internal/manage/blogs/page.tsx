"use client"

import Container from "@/_components/container"
import { createBlog } from "@/_lib/api";
import { BlogResponseInterface } from "@/_types/types";

export default function InsertBlogPage() {

  const handleOnSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = new FormData(e.currentTarget)

    const data: BlogResponseInterface = {
        blog_title: form.get("blog_name") as string,
        blog_smallDescription: form.get("blog_smallDescription") as string,
        blog_description: form.get("blog_description") as string,
        blog_author: form.get("blog_author") as string,
    }

    try {
      await createBlog(data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="
        h-auto min-h-screen w-full 
        flex flex-col items-center
        lg:px-0">

      <Container className="
        h-full py-6 lg:py-10
        flex flex-col w-full">

        <form className="flex flex-col w-full gap-10" onSubmit={handleOnSubmit}>

          <section className="relative flex flex-col w-full h-fit min-h-20 gap-4">

            <div className="flex items-center justify-between">
              <h2>New Blog</h2>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="blog_name" className="text-xs text-zinc-400">[ Blog Title ]</label>
              <input
                id="blog_name"
                name="blog_name"
                type="text"
                placeholder="Lorem Ipsum..."
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="blog_smallDescription" className="text-xs text-zinc-400">
                [ blog Short Description ]
              </label>
              <input
                id="blog_smallDescription"
                name="blog_smallDescription"
                type="text"
                placeholder="Short description..."
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="blog_description" className="text-xs text-zinc-400">[ blog_description ]</label>
              <textarea
                id="blog_description"
                name="blog_description"
                rows={6}
                placeholder="Full blog description..."
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground resize-y"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="blog_author" className="text-xs text-zinc-400">[ Blog Author(s) ]</label>
              <input
                id="blog_author"
                name="blog_author"
                type="text"
                placeholder="yion..."
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-4">
            <button
              type="button"
              className="text-sm lg:text-base border px-4 py-2 hover:bg-background-secondary hover:text-zinc-900"
            >
              [ Cancel ]
            </button>
            <button
              type="submit"
              className="text-sm lg:text-base border px-4 py-2 hover:bg-background-secondary hover:text-zinc-900"
            >
              [ Create blog ]
            </button>
          </div>

        </form>

      </Container>
    </main>
  );
}