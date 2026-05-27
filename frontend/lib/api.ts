const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://backend:8000"

export async function getVisitors() {
    try{
        const res = await fetch(API_URL + "/visitors/get-all", {
            next: { revalidate: 86400 },
            method: "GET"
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
    try {
        const res = await fetch(`${API_URL}/blogs/get-all`, {
            method: "GET"
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
            method: "GET"
        })

        console.log(`${API_URL}/blogs/get-one/${id}`)
        
        if(!res.ok) return []

        return await res.json();

    } catch (e) {
        console.error("Fetch Error: ", e)
        return []
    }
}