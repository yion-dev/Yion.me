"use client";

import { deleteBlog, getBlogs, getProjects, getVisitors } from "@/_lib/api";
import { BlogResponseInterface, ProjectResponseInterface, VisitorResponseInterface } from "@/_types/types";
import VisitorCard from "@/_components/admin-visitor-card";
import VisitorWorldMap from "@/_components/visitor-world-map";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectResponseInterface[]>([]);
  const [blogs, setBlogs] = useState<BlogResponseInterface[]>([]);
  const [visitors, setVisitors] = useState<VisitorResponseInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getProjects(true), getBlogs(true), getVisitors(true)])
      .then(([projects, blogs, visitors]) => {
        if (active) { setProjects(projects); setBlogs(blogs); setVisitors(visitors); }
      })
      .catch(() => { if (active) setError("Could not load the dashboard. Please reload to try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function removeBlog(blog: BlogResponseInterface) {
    if (!blog.blog_id || !window.confirm(`Delete “${blog.blog_title}”? This cannot be undone.`)) return;
    setDeleting(blog.blog_id);
    setError(null);
    try {
      await deleteBlog(blog.blog_id);
      setBlogs(current => current.filter(item => item.blog_id !== blog.blog_id));
    } catch { setError("Could not delete the blog. Please try again."); }
    finally { setDeleting(null); }
  }

  const today = new Date().toISOString().slice(0, 10);
  const stats = [
    ["Visitors", visitors.length, "all time"],
    ["Unique IPs", new Set(visitors.map(v => v.visitor_ip_address)).size, "distinct addresses"],
    ["Pages recorded", visitors.reduce((sum, v) => sum + v.visitor_visited_pages.length, 0), "across visitor records"],
    ["Today", visitors.filter(v => v.visitor_visited_at.startsWith(today)).length, "new visitors · UTC"],
  ];

  return (
    <main className="admin-content" aria-busy={loading}>
      <div className="admin-heading"><h2>&gt; Overview</h2><span className="admin-eyebrow">[ your portfolio at a glance ]</span></div>
      {error && <p role="alert" className="admin-error">{error}</p>}
      {loading && <p role="status" className="admin-muted">[ loading portfolio... ]</p>}
      <section className="admin-stats" aria-label="Visitor statistics">
        {stats.map(([label, value, sub]) => <div className="admin-frame admin-stat" key={label}><span>[ {label} ]</span><strong>{loading ? "--" : value}</strong><span className="admin-muted">{sub}</span></div>)}
      </section>
      <VisitorWorldMap visitors={visitors} loading={loading} unavailable={Boolean(error)} />
      <section className="admin-section">
        <div className="admin-heading"><h2>&gt; Recent Visitors</h2><Link className="admin-action" href="/internal/manage/website-visitors">[ View all ]</Link></div>
        <div className="admin-visitors">{[...visitors].sort((a,b) => b.visitor_visited_at.localeCompare(a.visitor_visited_at)).slice(0,4).map(v => <VisitorCard key={v.visitor_id} visitor={v} />)}</div>
        {!loading && !visitors.length && <p className="admin-empty">No visitor records to display.</p>}
      </section>
      <section className="admin-section">
        <div className="admin-heading"><h2>&gt; Projects <span className="admin-eyebrow">[ {projects.length} ]</span></h2><Link className="admin-action" href="/internal/manage/projects">[ + New project ]</Link></div>
        {!loading && !projects.length && <p className="admin-empty">No projects to display. Add a project to share your work.</p>}
        {!!projects.length && <div className="admin-list">{projects.map((p, i) => <article className="admin-row" key={p.project_id ?? p.project_name}>
          <div className="admin-row-copy"><h3>[{i + 1}] {p.project_name}</h3><p className="admin-muted">{p.project_short_description}</p><div className="admin-tags">{p.project_techstack.map(tech => <span className="admin-tag" key={tech}>{tech}</span>)}</div><span className="admin-eyebrow">created: {p.project_created_at?.slice(0, 10) || "—"}</span></div>
          <div className="flex shrink-0 flex-wrap items-center gap-3 sm:flex-col sm:items-end"><span className="admin-badge">status: {p.project_status}</span><Link className="admin-action" href={`/projects/${p.project_slug || p.project_id}`} aria-label={`View ${p.project_name}`}>[ View project ]</Link></div>
        </article>)}</div>}
      </section>
      <section className="admin-section">
        <div className="admin-heading"><h2>&gt; Blogs <span className="admin-eyebrow">[ {blogs.length} ]</span></h2><Link className="admin-action" href="/internal/manage/blogs">[ + New blog ]</Link></div>
        {!loading && !blogs.length && <p className="admin-empty">No blogs to display. Write something you have been learning.</p>}
        {!!blogs.length && <div className="admin-list">{blogs.map((b, i) => <article className="admin-row" key={b.blog_id ?? i}>
          <div className="admin-blog-details">
            {b.blog_coverImage && <Image src={b.blog_coverImage} alt="" width={128} height={80} sizes="(max-width: 639px) 96px, 128px" className="admin-blog-cover" />}
            <div className="admin-row-copy"><h3>[{i + 1}] {b.blog_title}</h3><p className="admin-muted">{b.blog_smallDescription}</p><span className="admin-eyebrow">{b.blog_author} {"//"} {b.blog_createdAt?.slice(0, 10) || "—"}</span></div>
          </div>
          {b.blog_id && <div className="flex shrink-0 flex-wrap gap-2"><Link className="admin-action" href={`/blogs/${b.blog_id}`} aria-label={`Read ${b.blog_title}`}>[ Read ]</Link><button type="button" className="admin-action" disabled={deleting !== null} onClick={() => removeBlog(b)} aria-label={`Delete ${b.blog_title}`}>[ {deleting === b.blog_id ? "Deleting..." : "Delete"} ]</button></div>}
        </article>)}</div>}
      </section>
    </main>
  );
}
