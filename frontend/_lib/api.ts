import {
    BlogResponseInterface,
    GithubLanguagesInterface,
    GithubProjectDataInterface,
    GithubReadmeInterface,
    GithubRepoInterface,
    ProjectResponseInterface
} from "@/_types/types";
import { redirect } from "next/navigation";

const API_URL = typeof window === "undefined"
  ? process.env.BASE_URL || "http://backend:8000"
  : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

export async function getVisitors() {
    try {
        const res = await fetch(API_URL + "/visitors/get-all/data", {
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

export async function getProjects() {
    try {
        const res = await fetch(`${API_URL}/projects/get-all`, {
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

export async function getBlogs() {
    try {
        const res = await fetch(`${API_URL}/blogs/get-all`, {
            method: "GET",
            next: { revalidate: 60 },
        })

        if (!res.ok) return []

        return await res.json();

    } catch (e) {
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
    owner: string,
    repoName: string
): Promise<GithubProjectDataInterface> {

    const [repoRes, readmeRes, languagesRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repoName}`, { next: { revalidate: 3600 } }),
        fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`, { next: { revalidate: 3600 } }),
        fetch(`https://api.github.com/repos/${owner}/${repoName}/languages`, { next: { revalidate: 3600 } }),
    ]);

    if (!repoRes.ok) throw new Error(`Failed to fetch repo: ${repoRes.status}`);
    if (!readmeRes.ok) throw new Error(`Failed to fetch readme: ${readmeRes.status}`);
    if (!languagesRes.ok) throw new Error(`Failed to fetch languages: ${languagesRes.status}`);

    const repo: GithubRepoInterface = await repoRes.json();
    const readmeData: GithubReadmeInterface = await readmeRes.json();
    const languages: GithubLanguagesInterface = await languagesRes.json();

    // decode here, once, properly handling UTF-8 (emoji etc.)
    const binaryString = atob(readmeData.content);
    const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
    const readme = new TextDecoder("utf-8").decode(bytes);

    return { repo, readme, languages };
}

export async function createProject(data: ProjectResponseInterface) {
    const res = await fetch(`${API_URL}/projects/create`, {
        method: "POST",
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

export async function createBlog(data: BlogResponseInterface) {
    const res = await fetch(`${API_URL}/blogs/create`, {
        method: "POST",
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
    } catch (e) {
        return { success: false, message: "Network error" };
    }
}

export async function deleteBlog(blog_id: string) {
    const res = await fetch(`${API_URL}/blogs/delete/${blog_id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error(`Failed to delete Blog: ${res.status}`);
    }

    return res.json();
}