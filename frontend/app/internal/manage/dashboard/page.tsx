"use client";

import Container from "@/_components/container"
import { deleteBlog, getBlogs, getProjects, getVisitors } from "@/_lib/api"
import { BlogResponseInterface, ProjectResponseInterface, VisitorResponseInterface } from "@/_types/types"
import Link from "next/link";
import { useState, useEffect } from "react"

export default function DashboardPage() {

    const [projects, setProjects] = useState<ProjectResponseInterface[]>([])
    const [blogs, setBlogs] = useState<BlogResponseInterface[]>([])
    const [visitors, setVisitors] = useState<VisitorResponseInterface[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchVisitors = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getVisitors()
            setVisitors(data)
        } catch (err) {
            setError("failed to fetch visitors")
        } finally {
            setLoading(false)
        }
    }

    const fetchProjects = async () => {
        setLoading(true)
        setError(null)
        try {
            const data: ProjectResponseInterface[] = await getProjects()
            setProjects(data)
        } catch (err) {
            setError("failed to fetch visitors")
        } finally {
            setLoading(false)
        }
    }

    const fetchBlogs = async () => {
        setLoading(true)
        setError(null)
        try {
            const data: BlogResponseInterface[] = await getBlogs()
            setBlogs(data)
        } catch (err) {
            setError("failed to fetch visitors")
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        fetchVisitors()
        fetchProjects()
        fetchBlogs()
    }, [])

    const totalVisitors = visitors.length
    const uniqueIps = new Set(visitors.map((v) => v.visitor_ip_address)).size
    const totalPageHits = visitors.reduce((acc, v) => acc + v.visitor_visited_pages.length, 0)
    const today = new Date().toISOString().slice(0, 10)
    const todayCount = visitors.filter((v) => v.visitor_visited_at.slice(0, 10) === today).length

    return (
        <main className="h-auto min-h-screen w-full flex flex-col items-center">
            <Container className="h-full py-6 lg:py-10 flex flex-col w-full gap-10">

                {/* Visitor stats */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    <StatCard label="total_visitors" value={totalVisitors} sub="all time" />
                    <StatCard label="unique_ips" value={uniqueIps} sub="distinct addresses" />
                    <StatCard label="pages_visited" value={totalPageHits} sub="total page hits" />
                    <StatCard label="today" value={todayCount} sub="visitors today" />
                </section>

                {/* Recent visitors */}
                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h3>recent visitors</h3>
                        <Link href={"/internal/manage/website-visitors"} className="text-xs border px-3 py-1 hover:border-zinc-600">
                            [ more ]
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 border divide-x divide-y divide-zinc-800">
                        {visitors.slice(0,5).map((v) => (
                            <VisitorCard key={v.visitor_id} visitor={v} />
                        ))}
                    </div>
                </section>

                <div className="border-t" />

                {/* Projects table */}
                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h3>projects</h3>
                        <Link href={"/internal/manage/projects"} className="text-xs border px-3 py-1 hover:border-zinc-600">
                            [ + new project ]
                        </Link>
                    </div>
                    <div className="border overflow-x-auto">
                        <table className="w-full border-collapse text-xs table-fixed" style={{ minWidth: "700px" }}>
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left font-normal px-3 py-2 w-10">id</th>
                                    <th className="text-left font-normal px-3 py-2 w-40">project_name</th>
                                    <th className="text-left font-normal px-3 py-2">project_short_description</th>
                                    <th className="text-left font-normal px-3 py-2 w-28">project_status</th>
                                    <th className="text-left font-normal px-3 py-2 w-28">project_created_at</th>
                                    <th className="text-left font-normal px-3 py-2 w-28">actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((p) => (
                                    <tr key={p.project_id} className="border-b hover:bg-zinc-900/50 group">
                                        <td className="px-3 py-2">{p.project_id}</td>
                                        <td className="px-3 py-2  max-w-40 truncate">{p.project_name}</td>
                                        <td className="px-3 py-2 truncate max-w-xs">{p.project_short_description}</td>
                                        <td className="px-3 py-2">
                                            <StatusBadge status={p.project_status} />
                                        </td>
                                        <td className="px-3 py-2">{p.project_created_at?.slice(0, 10)}</td>
                                        <td className="px-3 py-2">
                                            <div className="flex gap-2">
                                                <button className="w-fit border px-2 py-1 hover:border-zinc-500 hover:text-zinc-200">
                                                    ~
                                                </button>
                                                <button className="border px-2 py-1 hover:border-red-900 hover:text-red-500">
                                                    -
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="border-t" />

                {/* Blogs table */}
                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h3>blogs</h3>
                        <Link href={"/internal/manage/blogs"} className="text-xs border px-3 py-1 hover:border-zinc-600 hover:">
                            [ + new blog ]
                        </Link>
                    </div>
                    <div className="border overflow-x-auto">
                        <table className="w-full border-collapse text-xs" style={{ minWidth: "600px" }}>
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left font-normal px-3 py-2 w-10">id</th>
                                    <th className="text-left font-normal px-3 py-2 w-48">blog_title</th>
                                    <th className="text-left font-normal px-3 py-2">blog_smallDescription</th>
                                    <th className="text-left font-normal px-3 py-2 w-32">blog_author</th>
                                    <th className="text-left font-normal px-3 py-2 w-28">actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.map((b, i) => (
                                    <tr key={i} className="border-b hover:bg-zinc-900/50">
                                        <td className="px-3 py-2">{(i+1)}</td>
                                        <td className="px-3 py-2  truncate max-w-48">{b.blog_title}</td>
                                        <td className="px-3 py-2 truncate">{b.blog_smallDescription}</td>
                                        <td className="px-3 py-2">{b.blog_author}</td>
                                        <td className="px-3 py-2">
                                            <div className="flex gap-2">
                                                <button  className="text-[10px] border px-2 py-1 hover:border-zinc-500 hover:text-zinc-200">
                                                    ~
                                                </button>

                                                {b.blog_id &&
                                                    <button
                                                        onClick={() => deleteBlog(b.blog_id!)} 
                                                        className="text-[10px] border px-2 py-1 hover:border-red-900 hover:text-red-500">
                                                        -
                                                    </button>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </Container>
        </main>
    )
}

function StatCard({ label, value, sub }: { label: string; value: number; sub: string }) {
    return (
        <div className="flex flex-col gap-1 px-5 py-4 border">
            <span className="text-sm tracking-wide">[ {label} ]</span>
            <span className="text-2xl font-medium text-zinc-100">{value}</span>
            <span className="text-xs text-zinc-400">{sub}</span>
        </div>
    )
}

export function VisitorCard({ visitor }: { visitor: VisitorResponseInterface }) {
    return (
        <div className="flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-xs">visitor_id: #{visitor.visitor_id}</span>
                <span className="text-xs text-zinc-400">{visitor.visitor_visited_at.slice(0, 16).replace("T", " ")}</span>
            </div>
            <span className="text-base">{visitor.visitor_ip_address}</span>
            <div className="flex flex-wrap gap-1">
                {[...new Set(visitor.visitor_visited_pages)].map((page, i) => (
                    <span key={i} className="text-xs border px-1.5 py-0.5">
                        {page}
                    </span>
                ))}
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`text-xs border px-1.5 py-0.5`}>
            {status}
        </span>
    )
}
