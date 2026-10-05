import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  title: string;
  description: string;
  coverUrl?: string | null;
  preloadCover?: boolean;
};

export default function BlogArticleContent({ title, description, coverUrl, preloadCover = false }: Props) {
  return <>
    {coverUrl && <div className="relative aspect-video w-full overflow-hidden border border-zinc-700 bg-zinc-900">
      <Image src={coverUrl} alt={`${title} cover`} fill sizes="(max-width: 896px) 100vw, 896px" preload={preloadCover} className="object-contain" />
    </div>}
    <div className="blog-article w-full min-w-0 text-sm lg:text-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => typeof src === "string" ? <Image unoptimized src={src} alt={alt || "Blog image"} width={1200} height={675} className="my-5 h-auto max-w-full object-contain" /> : null,
        }}
      >{description}</ReactMarkdown>
    </div>
  </>;
}
