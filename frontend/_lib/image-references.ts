type BlogRecord = {
  blog_title: string;
  blog_coverImage?: string | null;
  blog_description?: string | null;
};

type ProjectRecord = {
  project_name: string;
  project_thumbnailImageUrl?: string | null;
  project_pictures?: string[] | null;
};

async function getRecords<T>(path: string): Promise<T[]> {
  const response = await fetch(`${process.env.BASE_URL || "http://localhost:8000"}${path}`, { cache: "no-store" });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`Could not read ${path}`);
  const records: unknown = await response.json();
  if (!Array.isArray(records)) throw new Error(`Invalid response from ${path}`);
  return records as T[];
}

export async function loadImageReferences() {
  const [blogs, projects] = await Promise.all([
    getRecords<BlogRecord>("/blogs/get-all"),
    getRecords<ProjectRecord>("/projects/get-all"),
  ]);
  return (url: string): string[] => {
    const references: string[] = [];
    for (const blog of blogs) {
      if (blog.blog_coverImage === url || blog.blog_description?.includes(url)) {
        references.push(`Blog: ${blog.blog_title}`);
      }
    }
    for (const project of projects) {
      if (project.project_thumbnailImageUrl === url || project.project_pictures?.includes(url)) {
        references.push(`Project: ${project.project_name}`);
      }
    }
    return references;
  };
}
