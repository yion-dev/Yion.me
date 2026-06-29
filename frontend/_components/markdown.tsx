import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // pick any highlight.js theme you like

export default function ReadmeViewer({ content }: { content: string }) {

    return (
        <div className="border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b bg-zinc-900 text-xs text-foreground-mute">
                <h4>📄 README.md</h4>
            </div>
            <div className="
                p-6 prose prose-invert prose-sm lg:prose-base max-w-none font-mono readme-content
            ">

                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}

                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}