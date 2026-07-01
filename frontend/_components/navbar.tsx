import Link from "next/link"
import { baseUrl } from "../_lib/constants"
import { NavbarProps } from "../_types/types"

export default function Navbar({ links, websiteVisitorCount }: NavbarProps) {
  return (
    <nav className="lg:relative flex flex-col w-full max-w-4xl my-10 lg:my-4 gap-2">
      <Link href={ "/" }>
        <h1 className="text-2xl lg:text-3xl">
          _Yiondev
          <span className="text-xl text-foreground-mute">.me</span>
        </h1>
      </Link>
      <ul className="flex justify-between lg:justify-start gap-2 md:gap-10">
        {links.map((e, i) => (
          <li key={i}>
            <Link
              href={ e.href }
              className="text-sm md:text-base font-bold text-foreground-mute hover:bg-background-secondary hover:text-zinc-900 transition-all px-1 py-1">
              [ {e.displayName} ]
            </Link>
          </li>
        ))}
      </ul>
        <div className="absolute right-2 top-1 lg:right-0 lg:top-0 text-sm">
          [{websiteVisitorCount} visitors]
        </div>
    </nav>
  )
}