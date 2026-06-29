import { ContainerProps } from "@/_types/types";
import clsx from "clsx";

export default function Container({
    children,
    className
}:ContainerProps) {
    return (
        <section className={clsx(
            "w-full max-w-4xl h-auto",
            className)}>
            { children }
        </section>
    )
}