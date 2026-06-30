import Container from "@/_components/container"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { GithubLoginButton } from "@/_components/github-button"

export default async function Authentication({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  const loginAction = async (formData: FormData) => {
    "use server"

    const username = formData.get("username") as string
    const password = formData.get("password") as string

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_SECRET
    ) {
      redirect("/internal/manage/login?error=invalid")
    }

    const cookieStore = await cookies()
    cookieStore.set("admin_token", process.env.ADMIN_SECRET!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    })

    redirect("/internal/manage/dashboard")
  }

  return (
    <main className="
      h-auto min-h-[70dvh] w-full px-4 lg:px-0
      flex flex-col items-center justify-center">

      <Container className="
        h-full w-full py-6 lg:py-10 gap-6
        flex flex-col">

        <div className="flex flex-col lg:flex-row items-center w-full h-auto gap-10">

          <div className="w-full lg:w-100 h-80 lg:h-100">
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
              <source src="https://lruzdrf7t7zl7ff6.public.blob.vercel-storage.com/lain-ezgif.com-gif-to-webm-converter.webm" type="video/webm" />
              <source src="https://lruzdrf7t7zl7ff6.public.blob.vercel-storage.com/lain-ezgif.com-gif-to-webm-converter.webm" type="video/mp4" />
            </video>
          </div>

          <div className="flex flex-col gap-5">

            <div className="flex flex-col gap-1">
              <h1>[ admin login ]</h1>
              <p>restricted — yiondev.me</p>
            </div>

            <div className="border-t" />

            <form action={loginAction} className="flex flex-col gap-5">

              <div className="flex flex-col gap-1">
                <label>[ username ]</label>
                <input
                  name="username"
                  type="text"
                  placeholder="yion"
                  className="bg-transparent border px-3 py-2 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label>[ password ]</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-transparent border px-3 py-2 outline-none"
                />
              </div>

              {error === "invalid" && (
                <p className="border px-3 py-2">invalid credentials</p>
              )}

              <button type="submit" className="border px-4 py-2">
                [ login ]
              </button>

            </form>

            <div className="flex items-center gap-3">
              <span className="flex-1 border-t" />
              or
              <span className="flex-1 border-t" />
            </div>

            <GithubLoginButton />

            <p className="text-center px-10">
              only authorized users can access this page
            </p>

          </div>

        </div>
      </Container>
    </main>
  )
}