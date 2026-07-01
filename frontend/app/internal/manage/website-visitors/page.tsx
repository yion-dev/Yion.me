'use client'
import Container from "@/_components/container";
import { useEffect, useState } from "react";
import { VisitorCard } from "../dashboard/page";
import { VisitorResponseInterface } from "@/_types/types";
import { getVisitors } from "@/_lib/api";

export default function WebsiteVisitors() {

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

    useEffect(() => {
        fetchVisitors()
    }, [])

    return (
        <main className="h-auto min-h-screen w-full flex flex-col items-center">
            <Container className="h-full py-6 lg:py-10 flex flex-col w-full gap-10">
                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h3>Website Visitors</h3>
                        <button className="text-xs border px-3 py-1 hover:border-zinc-600">
                            [ refresh ]
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 border divide-x divide-y divide-zinc-800">
                        {visitors.map((v) => (
                            <VisitorCard key={v.visitor_id} visitor={v} />
                        ))}
                    </div>
                </section>
            </Container>
        </main>
    )
}