"use client"

import Container from "@/_components/container"
import { createProject } from "@/_lib/api";
import { ProjectResponseInterface } from "@/_types/types";

export default function InsertProjectPage() {

  const handleOnSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()  // prevent page reload

    const form = new FormData(e.currentTarget)

    const data: ProjectResponseInterface = {
      project_name: form.get("project_name") as string,
      project_short_description: form.get("project_short_description") as string,
      project_description: form.get("project_description") as string,
      project_status: form.get("project_status") as string,
      project_githubUrl: form.get("project_githubUrl") as string,
      project_liveUrl: form.get("project_liveUrl") as string,
      project_thumbnailUrl: form.get("project_thumbnailUrl") as string,
      project_pictures: (form.get("project_pictures") as string).split(",").map(s => s.trim()),
      project_techstack: (form.get("project_techstack") as string).split(",").map(s => s.trim()),
    }

    try {
      await createProject(data)
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
              <h2>New Project</h2>
              <span className="text-xs lg:text-sm border px-2 py-1 w-fit h-fit whitespace-nowrap">
                project_status: draft
              </span>
            </div>

            <h3>Basic Info</h3>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_name" className="text-xs text-zinc-400">[ project_name ]</label>
              <input
                id="project_name"
                name="project_name"
                type="text"
                placeholder="Book Vision TUI"
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_short_description" className="text-xs text-zinc-400">[ project_short_description ]</label>
              <input
                id="project_short_description"
                name="project_short_description"
                type="text"
                placeholder="A terminal app that scans books and fetches their info using AI."
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_description" className="text-xs text-zinc-400">[ project_description ]</label>
              <textarea
                id="project_description"
                name="project_description"
                rows={6}
                placeholder="Full project description..."
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground resize-y"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_status" className="text-xs text-zinc-400">[ project_status ]</label>
              <select
                id="project_status"
                name="project_status"
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              >
                <option value="draft">draft</option>
                <option value="in_progress">in_progress</option>
                <option value="completed">completed</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </div>
          </section>

          {/* Links */}
          <section className="relative flex flex-col w-full h-fit min-h-20 gap-4">

            <h3>Links</h3>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_githubUrl" className="text-xs text-zinc-400">[ project_githubUrl ]</label>
              <input
                id="project_githubUrl"
                name="project_githubUrl"
                type="text"
                placeholder="https://github.com/yion-dev/book-vision-tui"
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_liveUrl" className="text-xs text-zinc-400">[ project_liveUrl ]</label>
              <input
                id="project_liveUrl"
                name="project_liveUrl"
                type="text"
                placeholder="https://bookvision.com"
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_thumbnailUrl" className="text-xs text-zinc-400">[ project_thumbnailUrl ]</label>
              <input
                id="project_thumbnailUrl"
                name="project_thumbnailUrl"
                type="text"
                placeholder="https://.../demo.mp4"
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              />
            </div>
          </section>

          {/* Media & tech */}
          <section className="relative flex flex-col w-full h-fit min-h-20 gap-4">

            <h3>Media &amp; Stack</h3>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_pictures" className="text-xs text-zinc-400">[ project_pictures ] (comma separated URLs)</label>
              <input
                id="project_pictures"
                name="project_pictures"
                type="text"
                placeholder="https://.../1.webp, https://.../2.webp"
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_techstack" className="text-xs text-zinc-400">[ project_techstack ] (comma separated)</label>
              <input
                id="project_techstack"
                name="project_techstack"
                type="text"
                placeholder="Python, Textual, OpenCV, YOLO"
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
              [ Create Project ]
            </button>
          </div>

        </form>

      </Container>
    </main>
  );
}