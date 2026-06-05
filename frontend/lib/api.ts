const isServer = typeof window === "undefined"

const API_URL = isServer
  ? process.env.API_URL || "http://backend:8000"          // server side
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function getVisitors() {
    try{
        const res = await fetch(API_URL + "/visitors/get-all", {
            method: "GET",
            cache: 'no-store'
        })

        if(!res.ok) return [] 

        return await res.json();

    } catch (e) {
        console.error("Fetch Error: ", e)
        return []
    }
}

export async function getProjects() {
    try {
        const res = await fetch(`${API_URL}/projects/get-all`, {
            method: "GET"
        })
        
        if(!res.ok) return []

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
            next: { revalidate: 0 },
        })
        
        if(!res.ok) return []

        return await res.json();

    } catch (e) {
        console.error("Fetch Error: ", e)
        return []
    }
}

export async function getBlog(id: number) {
    try {
        const res = await fetch(`${API_URL}/blogs/get-one/${id}`, {
            method: "GET",
            next: { revalidate: 86400 },
        })

        console.log(`${API_URL}/blogs/get-one/${id}`)
        
        if(!res.ok) return []

        return await res.json();

    } catch (e) {
        console.error("Fetch Error: ", e)
        return []
    }
}