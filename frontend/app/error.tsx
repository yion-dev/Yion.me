"use client"

import { useEffect } from "react"
import Container from "@/_components/container"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="h-auto w-full flex flex-col items-center justify-center">
      <Container className="
        min-h-[70dvh] w-full
        flex flex-col items-center justify-center gap-8">
        <img src="/angy.gif" alt="error" className="w-1001 h-40 object-contain" />
        <h1>[ something went wrong ]</h1>
        <button onClick={reset} className="border px-4 py-2">
          [ try again ]
        </button>
      </Container>
    </main>
  )
}