import Container from "@/_components/container"
import Link from "next/link"

export default function Forbidden() {
  return (
    <main className="h-auto w-full flex flex-col items-center justify-center">
      <Container className="
        min-h-[70dvh] w-full
        flex flex-col items-center justify-center gap-20">

        <div className="w-80 lg:w-100 h-40">
          <video
            width={400}
            height={200}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/loading.svg"
            className="w-full h-full aspect-video object-fit"
          >
            <source src="https://lruzdrf7t7zl7ff6.public.blob.vercel-storage.com/angy-ezgif.com-gif-to-webm-converter.webm" type="video/webm" />
            <source src="https://lruzdrf7t7zl7ff6.public.blob.vercel-storage.com/angy-ezgif.com-gif-to-webm-converter.webm" type="video/mp4" />
          </video>
        </div>

        <h1 className="flex flex-col items-center gap-4">
          [ 403 — forbidden ]
          <span className="w-80 lg:w-100 text-center text-sm wrap-break-word">
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