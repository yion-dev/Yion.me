"use client"

import { loginGithub } from "@/_lib/api"
import GithubIcon from "./icons/github"

export function GithubLoginButton() {
  return (
    <button
      onClick={() => loginGithub()}
      className="border px-4 py-2 flex items-center justify-center gap-2"
    >
      [ <GithubIcon strokeWidth={1.8} className="size-4 fill-foreground" />
       login with github ]
    </button>
  )
}