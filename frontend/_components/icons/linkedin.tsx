import { IconProps } from "./IconInterface";

export default function LinkedinIcon ({
    size,
    className,
    strokeWidth
}:IconProps) {
    return (
        <svg
            role="img"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={ className }
            fill="none"
            stroke="currentColor"
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round">
                <title>LinkedIn</title>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
        </svg>
    )
}