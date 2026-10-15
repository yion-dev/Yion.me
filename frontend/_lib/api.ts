import {
    BlogResponseInterface,
    GithubLanguagesInterface,
    GithubProjectDataInterface,
    GithubReadmeInterface,
    GithubRepoInterface,
    ProjectResponseInterface,
    VisitorCountryCount
} from "@/_types/types";
import { redirect } from "next/navigation";

const API_URL = typeof window === "undefined"
  ? process.env.BASE_URL || "http://localhost:8000"
  : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

export async function getVisitors(strict = false) {
    try {
        const res = await fetch(API_URL + "/visitors/get-all/data", {
            method: "GET",
            cache: "no-store",
            credentials: "include"
        })

        if (!res.ok) {
            if (strict) throw new Error(`Request failed: ${res.status}`);
            return [];
        }

        return await res.json();

    } catch (e) {
        if (strict) throw e;
        console.error("Fetch Error: ", e)
        return []
    }
}

export async function getVisitorsCount() {
    try {
        const res = await fetch(API_URL + "/visitors/get-all/count", {
            method: "GET",
            next: { revalidate: 60 }
        })

        if (!res.ok) return []
        return await res.json();

    } catch (e) {
        console.error("Fetch Error: ", e)
        return []
    }
}

export async function getVisitorCountries(): Promise<VisitorCountryCount[] | null> {
    try {
        const response = await fetch(`${API_URL}/visitors/countries`, { next: { revalidate: 60 } });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

export async function getProjects(strict = false) {
    try {
        const res = await fetch(`${API_URL}/projects/get-all`, {
            method: "GET",
            cache: "no-store"
        })

        if (res.status === 404) return [];
        if (!res.ok) {
            if (strict) throw new Error(`Request failed: ${res.status}`);
            return [];
        }

        return await res.json();

    } catch (e) {
        if (strict) throw e;
        console.error("Fetch Error: ", e)
        return []
    }
}

export async function getProject(id: string) {
    try {
        const res = await fetch(`${API_URL}/projects/get-one/${id}`, {
            method: "GET",
            cache: "no-store"
        })

        if (!res.ok) return []

        return await res.json();

    } catch (e) {
        console.error("Fetch Error: ", e)
        return []
    }
}

export async function getBlogs(strict = false) {
    try {
        const res = await fetch(`${API_URL}/blogs/get-all`, {
            method: "GET",
            cache: "no-store",
        })

        if (!res.ok) {
            if (strict) throw new Error(`Request failed: ${res.status}`);
            return [];
        }

        return await res.json();

    } catch (e) {
        if (strict) throw e;
        console.error("Fetch Error: ", e)
        return []
    }
}

export async function getBlog(id: string) {
    try {
        const res = await fetch(`${API_URL}/blogs/get-one/${id}`, {
            method: "GET",
            next: { revalidate: 86400 },
        })

        if (!res.ok) return []

        return await res.json();

    } catch (e) {
        console.error("Fetch Error: ", e)
        return []
    }
}

// lib/github.ts
export async function getGithubProjectData(
    githubUrl: string
): Promise<GithubProjectDataInterface | null> {
    let repositoryPath: string;
    try {
        const url = new URL(githubUrl);
        const [owner, repoName] = url.pathname.split("/").filter(Boolean);
        if (!["https:", "http:"].includes(url.protocol) || url.hostname !== "github.com" || !owner || !repoName) return null;
        repositoryPath = `${encodeURIComponent(owner)}/${encodeURIComponent(repoName.replace(/\.git$/, ""))}`;
    } catch {
        return null;
    }

    const fetchGithub = async (suffix: string) => {
        try {
            const response = await fetch(`https://api.github.com/repos/${repositoryPath}${suffix}`, {
                next: { revalidate: 3600 },
                signal: AbortSignal.timeout(5000),
            });
            return response.ok ? await response.json() : null;
        } catch {
            return null;
        }
    };

    const [repo, readmeData, languages]: [GithubRepoInterface | null, GithubReadmeInterface | null, GithubLanguagesInterface | null] = await Promise.all([
        fetchGithub(""),
        fetchGithub("/readme"),
        fetchGithub("/languages"),
    ]);
    if (!repo) return null;

    let readme = "";
    if (readmeData?.content) {
        try {
            const binaryString = atob(readmeData.content);
            const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
            readme = new TextDecoder("utf-8").decode(bytes);
        } catch { /* Repository details remain available if the README cannot be decoded. */ }
    }
    return { repo, readme, languages: languages ?? {} };
}

export async function createProject(data: ProjectResponseInterface) {
    const res = await fetch(`${API_URL}/projects/create`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(`Failed to create project: ${res.status}`);
    }

    return res.json();
}

export async function updateProject(id: number, data: ProjectResponseInterface): Promise<ProjectResponseInterface> {
    const res = await fetch(`${API_URL}/projects/update/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update project: ${res.status}`);
    return res.json();
}

export async function createBlog(data: BlogResponseInterface) {
    const res = await fetch(`${API_URL}/blogs/create`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(`Failed to create project: ${res.status}`);
    }

    return res.json();
}

export async function loginGithub() {
    redirect(`${API_URL}/oauth/github`)
}

export async function getPing() {
    const start = performance.now();
    await fetch("https://api.yiondev.me/visitors/get-all/count");
    const ms = Math.round(performance.now() - start);
    return ms
}

export async function login(username: string, password: string) {
    try {
        const res = await fetch(`${API_URL}/oauth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            const err = await res.json();
            return { success: false, message: err.detail || "Invalid credentials" };
        }

        return { success: true };
    } catch {
        return { success: false, message: "Network error" };
    }
}

export async function deleteBlog(blog_id: string) {
    const res = await fetch(`${API_URL}/blogs/delete/${blog_id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to delete Blog: ${res.status}`);
    }

    return res.json();
}
