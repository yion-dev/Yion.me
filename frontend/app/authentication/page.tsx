"use client"

import Container from "@/_components/container"
import { GithubLoginButton } from "@/_components/github-button"
import { login } from "@/_lib/api"
import { useState } from "react"

export default function Authentication() {
  const [error, setError] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const res = await login(username, password);
    if (res.success) {
      window.location.href = "/internal/manage/dashboard";
    } else {
      setError(res.message);
    }
  };

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

            <div className="w-full h-full font-mono text-base lg:text-lg">
              <p className="text-zinc-500">$ admin login</p>
              <div className="flex flex-col gap-2 mt-2">
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="bg-transparent border border-zinc-700 px-2 py-1 outline-none"
                />
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-transparent border border-zinc-700 px-2 py-1 outline-none"
                />
                {error && <p className="text-red-500">&gt; {error}</p>}
                <button
                  onClick={handleSubmit}
                  className="border border-zinc-700 px-2 py-1 text-center hover:bg-zinc-800 transition-all"
                >
                  [ login ]
                </button>
              </div>
            </div>

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