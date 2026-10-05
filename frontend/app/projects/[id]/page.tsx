import Container from "@/_components/container";
import ReadmeViewer from "@/_components/markdown";
import { TechCard } from "@/_components/project-card";
import { getGithubProjectData, getProject } from "@/_lib/api";
import { GithubProjectDataInterface, ProjectResponseInterface } from "@/_types/types";
import Image from "next/image";

export default async function ProjectPage({
    params
}: {
    params: Promise<{ id: string }>
}) {

    const { id } = await params

    const response: ProjectResponseInterface = await getProject(id)

    const githubResponse: GithubProjectDataInterface = await getGithubProjectData(
        "yion-dev",
        response.project_name
    );

    return (
        <main className="
            h-auto min-h-screen w-full 
            flex flex-col items-center">

            <Container className="
                h-full lg:py-10 gap-6
                flex flex-col w-full">

                <section className="relative flex flex-col w-full h-fit min-h-20 gap-4">

                    <div className="flex flex-row lg:items-start justify-between gap-2">
                        <div className="flex flex-col gap-1 min-w-0">
                            <h1 className="wrap-break-word">
                                <span className="font-medium">#</span> {response.project_name}
                            </h1>
                            <p className="text-zinc-400 text-sm">{response.project_short_description}</p>
                        </div>
                        <span className="text-xs lg:text-sm border px-2 py-1 w-fit h-fit whitespace-nowrap">
                            status: {response.project_status}
                        </span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">

                        <div className="flex flex-wrap gap-2">
                            {response.project_techstack && response.project_techstack.map((e, i) => (

                                <TechCard key={i} displayName={e} />

                            ))
                            }
                        </div>

                        <div className="flex flex-col text-xs text-foreground-mute lg:text-right">
                            <span>created: {response.project_created_at}</span>
                            <span>updated: {response.project_updated_at}</span>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col w-full gap-2">
                    <h3 className="text-sm lg:text-lg">## About this project</h3>
                    <p className="text-zinc-300 whitespace-pre-line text-sm lg:text-base">
                        {response.project_description}
                    </p>
                </section>

                <section className="flex w-full">
                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between w-full min-h-10 px-4 py-3 sm:py-2 lg:py-0 border gap-2">

                        <div className="flex items-center gap-2 text-sm lg:text-base min-w-0 w-full sm:w-auto">

                            <span className="whitespace-nowrap">[Live]</span>
                            <a rel="noopener"
                                target="_blank"
                                className="truncate"
                                href={response.project_liveUrl}>{response.project_liveUrl}</a>

                        </div>
                        <div className="flex items-center gap-2 text-sm lg:text-base min-w-0 w-full sm:w-auto">

                            <span className="whitespace-nowrap">[Github]</span>
                            <a rel="noopener"
                                target="_blank"
                                className="truncate"
                                href={response.project_githubUrl}>{response.project_githubUrl}</a>

                        </div>

                    </div>

                </section>

                {response.project_thumbnailImageUrl && <section className="h-full py-4 flex flex-col border">
                    <div className="w-full h-fit px-2 sm:px-4">
                        <div className="relative aspect-video w-full bg-zinc-900">
                            <Image src={response.project_thumbnailImageUrl} alt={`${response.project_name} thumbnail`} fill sizes="(max-width: 896px) 100vw, 896px" className="object-contain" />
                        </div>
                    </div>
                </section>}

                {response.project_thumbnailUrl && <section className="h-full py-4 flex flex-col border">
                    <div className="w-full h-fit px-2 sm:px-4">
                        <video
                            width={1280}
                            height={720}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            poster={response.project_thumbnailImageUrl || "/loading.svg"}
                            className="w-full aspect-video object-contain bg-zinc-900"
                        >
                            <source src={response.project_thumbnailUrl} />
                        </video>
                    </div>
                </section>}

                {!!response.project_pictures?.length && <section className="flex flex-col gap-4">
                    <h3 className="text-sm lg:text-lg">## Project pictures</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {response.project_pictures.map((url, index) => <a key={`${url}-${index}`} href={url} target="_blank" rel="noopener noreferrer" className="relative block aspect-video overflow-hidden border border-zinc-700 bg-zinc-900">
                            <Image unoptimized src={url} alt={`${response.project_name} picture ${index + 1}`} fill sizes="(max-width: 639px) 100vw, 50vw" className="object-contain" />
                        </a>)}
                    </div>
                </section>}

                {/* GitHub repo stats */}
                <section className="relative flex flex-col w-full h-fit min-h-20 px-3 sm:px-4 pt-8 gap-4">
                    <span className="absolute top-0 left-0 border-t border-l w-full h-3"></span>
                    <span className="absolute top-0 right-0 border-t border-r w-full h-3"></span>

                    <h3 className="text-sm lg:text-lg">## Repository</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-zinc-400">stars</span>
                            <span>{githubResponse.repo.stargazers_count}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-zinc-400">forks</span>
                            <span>{githubResponse.repo.forks_count}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-zinc-400">open issues</span>
                            <span>{githubResponse.repo.open_issues_count}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-zinc-400">language</span>
                            <span>{githubResponse.repo.language}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {githubResponse.repo.topics.map((e, i) => (
                            <span key={i} className="text-xs border px-2 py-1">{e}</span>
                        ))
                        }
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 text-xs text-zinc-400">
                        <span className="break-all">license: {githubResponse.repo.license?.name}</span>
                        <span>last commit: {githubResponse.repo.pushed_at}</span>
                    </div>

                </section>

                <section className="relative flex flex-col w-full h-fit min-h-20">
                    <ReadmeViewer content={githubResponse.readme} />
                </section>

            </Container>

        </main>
    );
}
