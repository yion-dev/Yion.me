import Link from "next/link"
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
      <ul className="flex flex-wrap justify-between gap-1 sm:gap-2 md:gap-10 lg:justify-start">
        {links.map((e, i) => (
          <li key={i}>
            <Link
              href={ e.href }
              className="px-1 py-1 text-xs font-bold text-foreground-mute transition-all hover:bg-background-secondary hover:text-zinc-900 sm:text-sm md:text-base">
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
