import { 
    BlogResponseInterface, 
    GithubLanguagesInterface, 
    GithubProjectDataInterface, 
    GithubReadmeInterface, 
    GithubRepoInterface, 
    ProjectResponseInterface 
} from "@/_types/types";
import { redirect } from "next/navigation";

const API_URL = process.env.BASE_URL || "http://localhost:8000"

export async function getVisitors() {
    try {
        const res = await fetch(API_URL + "/visitors/get-all", {
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

        console.log(`This is return ${res.ok}`)
        if (!res.ok) return []

        return await res.json();

    } catch (e) {
        console.error("Fetch Error: ", e)
        return []
    }
}

export async function getBlogs() {
    console.log(API_URL);
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

        console.log(`${API_URL}/blogs/get-one/${id}`)

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

    console.log(`https://api.github.com/repos/${owner}/${repoName}`)

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