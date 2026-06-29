export default function Footer () {
    return (
        <footer className="
            flex
            w-full max-w-4xl my-4 pt-2
            border-t text-sm">
          © {new Date().getFullYear()} Yion. All rights reserved.
        </footer>
    )
}