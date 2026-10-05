"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type LibraryImage = {
  pathname: string;
  url: string;
  size: number;
  uploadedAt: string;
  references: string[];
};

type LibraryResponse = { images: LibraryImage[]; usageAvailable: boolean; error?: string };

function category(pathname: string) {
  if (pathname.startsWith("blog-images/")) return "blogs";
  if (pathname.startsWith("project-images/")) return "projects";
  return "other";
}

async function fetchLibrary(): Promise<LibraryResponse> {
  const response = await fetch("/api/admin/images", { cache: "no-store" });
  const result: LibraryResponse = await response.json();
  if (!response.ok) throw new Error(result.error || "Could not load images");
  return result;
}

export default function ImageLibraryPage() {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [usageAvailable, setUsageAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const result = await fetchLibrary();
      setImages(result.images);
      setUsageAvailable(result.usageAvailable);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load images");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    fetchLibrary().then(result => {
      if (active) { setImages(result.images); setUsageAvailable(result.usageAvailable); }
    }).catch(cause => {
      if (active) setError(cause instanceof Error ? cause.message : "Could not load images");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function deleteImage(image: LibraryImage) {
    const inUse = image.references.length > 0;
    const warning = inUse
      ? `This image is used by ${image.references.join(", ")}. Deleting it will break those pages. Delete it anyway?`
      : `Permanently delete ${image.pathname}?`;
    if (!window.confirm(warning)) return;

    setDeleting(image.url);
    setError("");
    setMessage("");
    try {
      const send = (force: boolean) => fetch("/api/admin/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: image.url, force }),
      });
      let response = await send(inUse);
      let result = await response.json();
      if (response.status === 409 && Array.isArray(result.references)) {
        if (!window.confirm(`This image is now used by ${result.references.join(", ")}. Deleting it will break those pages. Delete it anyway?`)) return;
        response = await send(true);
        result = await response.json();
      }
      if (!response.ok) throw new Error(result.error || "Could not delete image");
      setImages(current => current.filter(item => item.url !== image.url));
      setMessage("Image deleted from Vercel Blob.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete image");
    } finally {
      setDeleting(null);
    }
  }

  const visible = images.filter(image =>
    (filter === "all" || category(image.pathname) === filter)
    && image.pathname.toLowerCase().includes(query.trim().toLowerCase())
  );

  return <main className="admin-content">
    <section className="admin-section">
      <div className="admin-heading">
        <div><span className="admin-eyebrow">[ media library ]</span><h2>&gt; Images <span className="admin-eyebrow">[ {images.length} ]</span></h2></div>
        <button type="button" className="admin-action" onClick={() => void refresh()} disabled={loading}>[ Refresh ]</button>
      </div>
      <p className="admin-muted">Images in your Vercel Blob store. Open the original, copy its URL, or delete it.</p>
      {!usageAvailable && <p className="admin-error">Could not check where images are used. Deletion is unavailable until the backend responds.</p>}
      {error && <p role="alert" className="admin-error">{error}</p>}
      {message && <p role="status" className="admin-muted">{message}</p>}
      <div className="admin-image-controls">
        <label>Type <select value={filter} onChange={event => setFilter(event.target.value)}><option value="all">All images</option><option value="blogs">Blog images</option><option value="projects">Project images</option><option value="other">Other images</option></select></label>
        <label>Search <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Filename or folder" /></label>
      </div>
      {loading ? <p role="status" className="admin-muted">[ loading images... ]</p>
        : !visible.length ? <p className="admin-empty">{images.length ? "No images match this filter." : "No images found in this Blob store."}</p>
        : <div className="admin-image-grid">{visible.map(image => <article key={image.url} className="admin-frame admin-image-card">
          <a href={image.url} target="_blank" rel="noopener noreferrer" className="admin-image-preview" aria-label={`View ${image.pathname}`}>
            <Image src={image.url} alt={image.pathname.split("/").pop() || "Uploaded image"} fill sizes="(max-width: 639px) 100vw, (max-width: 1024px) 50vw, 280px" className="object-contain" />
          </a>
          <div className="admin-image-details">
            <span className="admin-eyebrow">[ {category(image.pathname)} ]</span>
            <strong title={image.pathname}>{image.pathname.split("/").pop()}</strong>
            <small className="admin-muted">{(image.size / 1024).toFixed(0)} KB · {new Date(image.uploadedAt).toLocaleDateString()}</small>
            {image.references.length > 0 && <small className="admin-muted">Used by {image.references.join(", ")}</small>}
          </div>
          <div className="admin-image-actions">
            <a className="admin-action" href={image.url} target="_blank" rel="noopener noreferrer">[ View ]</a>
            <button type="button" className="admin-action" onClick={() => {
              void navigator.clipboard.writeText(image.url).then(() => setMessage("Image URL copied.")).catch(() => setError("Could not copy image URL."));
            }}>[ Copy URL ]</button>
            <button type="button" className="admin-action" disabled={!usageAvailable || deleting !== null} onClick={() => void deleteImage(image)}>[ {deleting === image.url ? "Deleting..." : "Delete"} ]</button>
          </div>
        </article>)}</div>}
    </section>
  </main>;
}
