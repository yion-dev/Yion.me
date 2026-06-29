import Container from "@/_components/container"
import Link from "next/link"

export default function Forbidden() {
  return (
    <main className="h-auto w-full flex flex-col items-center justify-center">
      <Container className="
        min-h-[70dvh] w-full
        flex flex-col items-center justify-center gap-20">
        <img src="/angy.gif" alt="403" className="w-100 h-40 object-contain" />
        <h1 className="flex flex-col items-center gap-4">
          [ 403 — forbidden ]
          <span className="w-100 text-center text-sm wrap-break-word">
            This area is monitored — unauthorized access will be reported and
            repeated failed attempts will result in your ip being blocked
          </span>
        </h1>
        <Link href="/" className="border px-4 py-2">
          [ go back ]
        </Link>
      </Container>
    </main>
  )
}