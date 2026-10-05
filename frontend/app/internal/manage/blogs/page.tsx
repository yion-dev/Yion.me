"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/_components/container";
import BlogArticleContent from "@/_components/blog-article-content";
import { createBlog } from "@/_lib/api";
import { BlogResponseInterface } from "@/_types/types";

type Block = { id: number; kind: "paragraph"; text: string } | { id: number; kind: "photo"; url: string; alt: string };

function toMarkdown(blocks: Block[]) {
  return blocks.map(block => block.kind === "paragraph"
    ? block.text.trim()
    : block.url ? `![${block.alt.replaceAll("]", "\\]") || "Article photo"}](${block.url})` : ""
  ).filter(Boolean).join("\n\n");
}

export default function InsertBlogPage() {
  const nextId = useRef(2);
  const previewRef = useRef<HTMLElement>(null);
  const [blocks, setBlocks] = useState<Block[]>([{ id: 1, kind: "paragraph", text: "" }]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [failed, setFailed] = useState(false);
  const photoCount = blocks.filter(block => block.kind === "photo").length + Number(Boolean(coverUrl));
  const description = toMarkdown(blocks);
  const paragraph = (): Block => ({ id: nextId.current++, kind: "paragraph", text: "" });
  const photo = (): Block => ({ id: nextId.current++, kind: "photo", url: "", alt: "" });

  function template(kind: "text" | "illustrated") {
    if (description && !window.confirm("Replace the current article content with this template?")) return;
    setBlocks(kind === "text" ? [paragraph(), paragraph(), paragraph()] : [paragraph(), photo(), paragraph(), paragraph()]);
    setFeedback("");
  }

  function addBlock(kind: "paragraph" | "photo", after: number) {
    if (kind === "photo" && photoCount >= 2) return;
    const block = kind === "photo" ? photo() : paragraph();
    setBlocks(current => {
      const index = current.findIndex(item => item.id === after);
      return [...current.slice(0, index + 1), block, ...current.slice(index + 1)];
    });
  }

  function updateBlock(id: number, field: "text" | "url" | "alt", value: string) {
    setBlocks(current => current.map(block => block.id === id ? { ...block, [field]: value } as Block : block));
  }

  function moveBlock(index: number, offset: -1 | 1) {
    setBlocks(current => {
      const next = [...current];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      return next;
    });
  }

  async function handleImage(file: File | undefined, target: "cover" | number) {
    if (!file || uploading || saving) return;
    if (file.size > 5 * 1024 * 1024) {
      setFailed(true); setFeedback("Choose an image smaller than 5 MB."); return;
    }
    if (target === "cover" && !coverUrl && photoCount >= 2) {
      setFailed(true); setFeedback("A post can have at most two photos, including the cover."); return;
    }
    setUploading(true); setFeedback(""); setFailed(false);
    try {
      const body = new FormData();
      body.append("image", file);
      const response = await fetch("/api/blog-images", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Image upload failed");
      if (target === "cover") setCoverUrl(result.url);
      else setBlocks(current => current.map(block => block.id === target ? { ...block, url: result.url, alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") } as Block : block));
      setFeedback("Photo uploaded.");
    } catch (error) {
      setFailed(true); setFeedback(error instanceof Error ? error.message : "Image upload failed.");
    } finally { setUploading(false); }
  }

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || uploading) return;
    if (!blocks.some(block => block.kind === "paragraph" && block.text.trim())) {
      setFailed(true); setFeedback("Add at least one paragraph before publishing."); return;
    }
    const form = event.currentTarget;
    const values = new FormData(form);
    const data: BlogResponseInterface = {
      blog_title: title.trim(),
      blog_smallDescription: String(values.get("blog_smallDescription") || "").trim(),
      blog_description: description,
      blog_author: author.trim(),
      blog_coverImage: coverUrl || null,
    };
    setSaving(true); setFailed(false); setFeedback("");
    try {
      await createBlog(data);
      form.reset(); setTitle(""); setAuthor(""); setCoverUrl(""); setBlocks([paragraph()]); setPreviewOpen(false);
      setFeedback("Blog created successfully.");
    } catch {
      setFailed(true); setFeedback("Could not create the blog. Your entries are preserved. Please try again.");
    } finally { setSaving(false); }
  }

  return <main className="flex min-h-screen w-full flex-col items-center">
    <Container className="flex h-full w-full flex-col py-6 lg:py-10">
      <form className="flex w-full flex-col gap-10" onSubmit={submit}>
        <section className="flex flex-col gap-4">
          <h2>&gt; New Blog</h2>
          <label className="flex flex-col gap-1">[ Title ]<input required name="blog_name" value={title} onChange={event => setTitle(event.target.value)} placeholder="What building a CHIP-8 emulator taught me" /></label>
          <label className="flex flex-col gap-1">[ Short description ]<input required name="blog_smallDescription" placeholder="A sentence shown on the blogs page..." /></label>
          <label className="flex flex-col gap-1">[ Author ]<input required name="blog_author" value={author} onChange={event => setAuthor(event.target.value)} placeholder="yion..." /></label>
          <label className="flex flex-col gap-1">[ Cover / listing thumbnail · optional ]<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" disabled={uploading || saving || (!coverUrl && photoCount >= 2)} onChange={event => { void handleImage(event.target.files?.[0], "cover"); event.target.value = ""; }} /></label>
          {coverUrl && <div className="admin-cover-preview"><Image src={coverUrl} alt="Cover preview" fill sizes="(max-width: 639px) 100vw, 400px" className="object-cover" /><button type="button" className="admin-action" onClick={() => setCoverUrl("")}>[ Remove cover ]</button></div>}
          <p className="admin-form-note">Two photos maximum per post, including the cover. Maximum 5 MB each.</p>
        </section>

        <section className="flex flex-col gap-4">
          <div className="admin-heading"><div><h3>&gt; Article</h3><p className="admin-form-note">Start with a layout, then add as many paragraphs as you need.</p></div><span className="admin-eyebrow">[ {photoCount}/2 photos ]</span></div>
          <div className="flex flex-wrap gap-2"><button type="button" className="admin-action" onClick={() => template("text")}>[ Text article ]</button><button type="button" className="admin-action" disabled={uploading || (Boolean(coverUrl) && photoCount >= 2)} onClick={() => template("illustrated")}>[ Illustrated article ]</button></div>
          <div className="admin-article-blocks">{blocks.map((block, index) => <div className="admin-article-block" key={block.id}>
            <div className="admin-heading"><span className="admin-eyebrow">[ {String(index + 1).padStart(2, "0")} · {block.kind} ]</span><div className="admin-block-actions">
              <button type="button" className="admin-action" aria-label={`Move block ${index + 1} up`} disabled={index === 0} onClick={() => moveBlock(index, -1)}>↑</button>
              <button type="button" className="admin-action" aria-label={`Move block ${index + 1} down`} disabled={index === blocks.length - 1} onClick={() => moveBlock(index, 1)}>↓</button>
              <button type="button" className="admin-action" aria-label={`Remove block ${index + 1}`} disabled={blocks.length === 1} onClick={() => setBlocks(current => current.filter(item => item.id !== block.id))}>[ Remove ]</button>
            </div></div>
            {block.kind === "paragraph" ? <label className="flex flex-col gap-1">Paragraph<textarea rows={5} value={block.text} disabled={saving} onChange={event => updateBlock(block.id, "text", event.target.value)} placeholder="Write a paragraph. Markdown formatting works here." /></label> : <div className="flex flex-col gap-2">
              <label className="flex flex-col gap-1">Photo<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" disabled={uploading || saving} onChange={event => { void handleImage(event.target.files?.[0], block.id); event.target.value = ""; }} /></label>
              {block.url && <Image src={block.url} alt={block.alt || "Article photo preview"} width={800} height={450} className="max-h-64 w-full object-contain object-left" />}
              <label className="flex flex-col gap-1">Photo description<input value={block.alt} onChange={event => updateBlock(block.id, "alt", event.target.value)} placeholder="Describe what the photo shows" /></label>
            </div>}
            <div className="admin-block-actions"><button type="button" className="admin-action" onClick={() => addBlock("paragraph", block.id)}>[ + Paragraph below ]</button><button type="button" className="admin-action" disabled={photoCount >= 2} onClick={() => addBlock("photo", block.id)}>[ + Photo below ]</button></div>
          </div>)}</div>
        </section>

        {(feedback || uploading) && <p role={failed ? "alert" : "status"} className={failed ? "admin-error" : "admin-frame"}>{uploading ? "Uploading photo..." : feedback}</p>}
        <div className="flex flex-wrap items-center justify-end gap-4">
          <button type="button" className="admin-action" aria-expanded={previewOpen} aria-controls="blog-draft-preview" onClick={() => { setPreviewOpen(open => !open); if (!previewOpen) requestAnimationFrame(() => previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })); }}>[ {previewOpen ? "Hide preview" : "Preview post"} ]</button>
          <Link href="/internal/manage/dashboard" className="admin-action">[ Cancel ]</Link>
          <button type="submit" disabled={saving || uploading} className="admin-action admin-primary">{saving ? "[ Creating... ]" : "[ Create blog ]"}</button>
        </div>
        {previewOpen && <section id="blog-draft-preview" ref={previewRef} className="admin-blog-preview" aria-label="Unpublished blog preview">
          <span className="admin-eyebrow">[ preview · unpublished ]</span>
          <h2 className="text-xl font-black lg:text-2xl lg:font-semibold">{title || "Untitled draft"}</h2>
          <p className="text-sm opacity-80 lg:text-lg">by {author || "Author"}</p>
          <BlogArticleContent title={title || "Untitled draft"} coverUrl={coverUrl} description={description} />
          {!description && <p className="admin-muted">Write some content to see the article preview.</p>}
        </section>}
      </form>
    </Container>
  </main>;
}
