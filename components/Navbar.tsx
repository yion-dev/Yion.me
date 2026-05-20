import Link from "next/link"
import { baseUrl } from "../lib/constants"
import { NavbarProps } from "../types/types"

export default function Navbar({ links}: NavbarProps) {
  return (
    <nav className="flex flex-col my-4 gap-2">
      <h1 className="text-2xl lg:text-3xl">
        _Yion
        <span className="text-xl text-foreground-mute">.me</span>
      </h1>
      <ul className="flex gap-2 md:gap-10">
        {links.map((e, i) => (
          <li key={i}>
            <Link
              href={ baseUrl + e.href }
              className="text-sm md:text-base font-bold text-foreground-mute hover:bg-background-secondary hover:text-zinc-900 transition-all px-2 py-1">
              [ {e.displayName} ]
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}