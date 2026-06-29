export default function Footer () {
    return (
        <footer className="
            flex
            w-full lg:max-w-4xl mt-4 pt-2
            border-t text-sm">
          © {new Date().getFullYear()} Yion. All rights reserved.
        </footer>
    )
}