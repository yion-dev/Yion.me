import Container from "@/_components/container";

export default function NotFound() {
  return (
    <main className="h-auto w-full flex flex-col items-center justify-center">
      <Container className="
        min-h-[70dvh] w-full
        flex flex-col items-center justify-center gap-8">

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
            <source src="https://lruzdrf7t7zl7ff6.public.blob.vercel-storage.com/notfound-ezgif.com-gif-to-webm-converter.webm" type="video/webm" />
            <source src="https://lruzdrf7t7zl7ff6.public.blob.vercel-storage.com/notfound-ezgif.com-gif-to-webm-converter.webm" type="video/mp4" />
          </video>
        </div>
        <h1>[ 404 — page not found ]</h1>
      </Container>
    </main>
  )
}