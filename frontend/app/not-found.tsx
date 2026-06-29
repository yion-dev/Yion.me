import Container from "@/_components/container";

export default function NotFound() {
  return (
    <main className="h-auto w-full flex flex-col items-center justify-center">
      <Container className="
        min-h-[70dvh] w-full
        flex flex-col items-center justify-center gap-8">
        <img src="/notfound.gif" alt="error404" className="w-60 lg:w-100 h-20 lg:h-50 object-contain" />
        <h1>[ 404 — page not found ]</h1>
      </Container>
    </main>
  )
}