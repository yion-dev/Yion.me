'use client'
import Container from "@/_components/container";
import { useEffect, useState } from "react";
import { VisitorCard } from "../dashboard/page";
import { VisitorResponseInterface } from "@/_types/types";
import { getVisitors } from "@/_lib/api";

const PER_PAGE = 20

export default function WebsiteVisitors() {
    const [visitors, setVisitors] = useState<VisitorResponseInterface[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)

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

    useEffect(() => {
        fetchVisitors()
    }, [])

    const totalPages = Math.ceil(visitors.length / PER_PAGE)
    const paginated = visitors.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    return (
        <main className="h-auto min-h-screen w-full flex flex-col items-center">
            <Container className="h-full py-6 lg:py-10 flex flex-col w-full gap-10">
                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h3>Website Visitors</h3>
                        <button
                            onClick={fetchVisitors}
                            className="text-xs border px-3 py-1 hover:border-zinc-600"
                        >
                            [ refresh ]
                        </button>
                    </div>

                    {loading && <p className="text-xs text-zinc-500">[ loading... ]</p>}
                    {error && <p className="text-xs text-red-500">[ {error} ]</p>}

                    <div className="grid grid-cols-1 lg:grid-cols-2 border divide-x divide-y divide-zinc-800">
                        {paginated.map((v) => (
                            <VisitorCard key={v.visitor_id} visitor={v} />
                        ))}
                    </div>

                    {/* pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between text-xs text-zinc-500">
                            <span>
                                [ {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, visitors.length)} of {visitors.length} ]
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="border px-3 py-1 hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    [ prev ]
                                </button>

                                {/* page number pills */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                    .reduce<(number | string)[]>((acc, p, i, arr) => {
                                        if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...')
                                        acc.push(p)
                                        return acc
                                    }, [])
                                    .map((p, i) =>
                                        p === '...'
                                            ? <span key={`ellipsis-${i}`} className="px-1">...</span>
                                            : <button
                                                key={p}
                                                onClick={() => setPage(p as number)}
                                                className={`border px-3 py-1 hover:border-zinc-600 ${page === p ? 'border-zinc-400 text-zinc-100' : ''}`}
                                            >
                                                {p}
                                            </button>
                                    )
                                }

                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="border px-3 py-1 hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    [ next ]
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </Container>
        </main>
    )
}