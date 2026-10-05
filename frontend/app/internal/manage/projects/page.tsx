"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/_components/container"
import { createProject } from "@/_lib/api";
import { ProjectResponseInterface } from "@/_types/types";

export default function InsertProjectPage() {

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [failed, setFailed] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [pictureUrls, setPictureUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingMessage, setUploadingMessage] = useState("");

  const uploadProjectImage = async (file: File): Promise<string> => {
    const body = new FormData();
    body.append("image", file);
    const response = await fetch("/api/project-images", { method: "POST", body });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Image upload failed");
    return result.url as string;
  };

  const handleThumbnail = async (file?: File) => {
    if (!file || uploading) return;
    if (file.size > 5 * 1024 * 1024) {
      setFailed(true);
      setFeedback("Choose an image smaller than 5 MB.");
      return;
    }
    setUploading(true);
    setUploadingMessage("Uploading thumbnail...");
    setFeedback("");
    setFailed(false);
    try {
      setThumbnailUrl(await uploadProjectImage(file));
      setFeedback("Thumbnail uploaded.");
    } catch (error) {
      setFailed(true);
      setFeedback(error instanceof Error ? error.message : "Thumbnail upload failed.");
    } finally {
      setUploading(false);
      setUploadingMessage("");
    }
  };

  const handlePictures = async (files: File[]) => {
    if (!files.length || uploading) return;
    if (files.some(file => !file.size || file.size > 5 * 1024 * 1024)) {
      setFailed(true);
      setFeedback("Each picture must be smaller than 5 MB.");
      return;
    }
    setUploading(true);
    setFeedback("");
    setFailed(false);
    let completed = 0;
    try {
      for (const file of files) {
        setUploadingMessage(`Uploading picture ${completed + 1} of ${files.length}...`);
        const url = await uploadProjectImage(file);
        setPictureUrls(current => [...current, url]);
        completed += 1;
      }
      setFeedback(`${completed} ${completed === 1 ? "picture" : "pictures"} uploaded.`);
    } catch (error) {
      setFailed(true);
      setFeedback(`${completed} uploaded. ${error instanceof Error ? error.message : "Picture upload failed."}`);
    } finally {
      setUploading(false);
      setUploadingMessage("");
    }
  };

  const handleOnSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()  // prevent page reload

    if (saving || uploading) return;
    const formElement = e.currentTarget;
    const form = new FormData(formElement)

    const data: ProjectResponseInterface = {
      project_name: form.get("project_name") as string,
      project_short_description: form.get("project_short_description") as string,
      project_description: form.get("project_description") as string,
      project_status: form.get("project_status") as string,
      project_githubUrl: form.get("project_githubUrl") as string,
      project_liveUrl: form.get("project_liveUrl") as string,
      project_thumbnailUrl: (form.get("project_thumbnailUrl") as string).trim() || null,
      project_thumbnailImageUrl: thumbnailUrl || null,
      project_pictures: pictureUrls,
      project_techstack: (form.get("project_techstack") as string).split(",").map(s => s.trim()).filter(Boolean),
    }

    setSaving(true);
    setFeedback("");
    setFailed(false);
    try {
      await createProject(data);
      setFeedback("Project created successfully.");
      formElement.reset();
      setThumbnailUrl("");
      setPictureUrls([]);
    } catch {
      setFailed(true);
      setFeedback("Could not create the project. Your entries are preserved. Please try again.");
    } finally {
      setSaving(false);
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
              <h2>&gt; New Project</h2>

            </div>

            <h3>01 / Basic Info</h3>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_name" className="text-xs text-zinc-400">[ Project name ]</label>
              <input
                required
                id="project_name"
                name="project_name"
                type="text"
                placeholder="Book Vision TUI"
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_short_description" className="text-xs text-zinc-400">[ Short description ]</label>
              <input
                required
                id="project_short_description"
                name="project_short_description"
                type="text"
                placeholder="A terminal app that scans books and fetches their info using AI."
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_description" className="text-xs text-zinc-400">[ Description ]</label>
              <textarea
                required
                id="project_description"
                name="project_description"
                rows={6}
                placeholder="Full project description..."
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground resize-y"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_status" className="text-xs text-zinc-400">[ Status ]</label>
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

            <h3>02 / Links</h3>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_githubUrl" className="text-xs text-zinc-400">[ GitHub URL ]</label>
              <input
                id="project_githubUrl"
                name="project_githubUrl"
                type="text"
                placeholder="https://github.com/yion-dev/book-vision-tui"
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_liveUrl" className="text-xs text-zinc-400">[ Live URL ]</label>
              <input
                id="project_liveUrl"
                name="project_liveUrl"
                type="text"
                placeholder="https://bookvision.com"
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_thumbnailUrl" className="text-xs text-zinc-400">[ Demo video URL ]</label>
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

            <h3>03 / Media &amp; Stack</h3>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_thumbnail_image" className="text-xs text-zinc-400">[ Thumbnail image ] (optional)</label>
              <input
                id="project_thumbnail_image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                disabled={uploading || saving}
                onChange={event => {
                  void handleThumbnail(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              {thumbnailUrl && <Image unoptimized src={thumbnailUrl} alt="Project thumbnail preview" width={800} height={450} className="mt-2 max-h-64 w-full object-contain object-left" />}
              <p className="admin-form-note">JPEG, PNG, WebP, GIF or AVIF · maximum 5 MB.</p>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_pictures" className="text-xs text-zinc-400">[ Project pictures ] (optional)</label>
              <input
                id="project_pictures"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                multiple
                disabled={uploading || saving}
                onChange={event => {
                  void handlePictures(Array.from(event.target.files ?? []));
                  event.target.value = "";
                }}
              />
              <p className="admin-form-note">Choose multiple images. Each image can be up to 5 MB.</p>
              {!!pictureUrls.length && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {pictureUrls.map((url, index) => <div key={url} className="flex min-w-0 flex-col gap-1">
                  <Image unoptimized src={url} alt={`Project picture ${index + 1} preview`} width={400} height={225} className="aspect-video w-full border border-zinc-700 bg-zinc-900 object-contain" />
                  <button type="button" className="admin-action" disabled={uploading || saving} onClick={() => setPictureUrls(current => current.filter(item => item !== url))}>[ Remove ]</button>
                </div>)}
              </div>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="project_techstack" className="text-xs text-zinc-400">[ Tech stack ] (comma separated)</label>
              <input
                id="project_techstack"
                name="project_techstack"
                type="text"
                placeholder="Python, Textual, OpenCV, YOLO"
                className="border px-3 py-2 bg-transparent text-sm lg:text-base outline-none focus:border-foreground"
              />
            </div>
          </section>

          {(feedback || uploading) && <p role={failed ? "alert" : "status"} className={failed ? "admin-error" : "admin-frame"}>{uploading ? uploadingMessage : feedback}</p>}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-4">
            <Link href="/internal/manage/dashboard" className="admin-action">[ Cancel ]</Link>
            <button
              type="submit"
              disabled={saving || uploading}
              className="admin-action admin-primary"
            >
              {saving ? "[ Creating... ]" : "[ Create project ]"}
            </button>
          </div>

        </form>

      </Container>
    </main>
  );
}
