import fs from "node:fs";
import path from "node:path";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface BlogPost {
  meta: BlogPostMeta;
  content: string;
}

export interface BlogDataSource {
  getAllPosts(): Promise<BlogPostMeta[]> | BlogPostMeta[];
  getPostBySlug(slug: string): Promise<BlogPost | null> | (BlogPost | null);
}

const LOCAL_BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Local File-System Provider (Default)
 * Can be swapped with RemoteGitHubBlogProvider or headless CMS provider in the future
 */
class LocalBlogProvider implements BlogDataSource {
  getAllPosts(): BlogPostMeta[] {
    if (!fs.existsSync(LOCAL_BLOG_DIR)) {
      return [];
    }

    const files = fs
      .readdirSync(LOCAL_BLOG_DIR)
      .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
    const posts: BlogPostMeta[] = [];

    for (const filename of files) {
      const filePath = path.join(LOCAL_BLOG_DIR, filename);
      const content = fs.readFileSync(filePath, "utf-8");
      const slug = filename.replace(/\.(md|mdx)$/, "");

      const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (frontmatterMatch) {
        const data = this.parseFrontmatter(frontmatterMatch[1]);
        posts.push({
          slug,
          title: data.title || slug,
          description: data.description || "",
          date: data.date || "2026-01-01",
          readTime: data.readTime || "5 min read",
          tags: Array.isArray(data.tags) ? data.tags : [],
        });
      }
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getPostBySlug(slug: string): BlogPost | null {
    const mdxPath = path.join(LOCAL_BLOG_DIR, `${slug}.mdx`);
    const mdPath = path.join(LOCAL_BLOG_DIR, `${slug}.md`);

    const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

    if (!filePath) {
      return null;
    }

    const rawContent = fs.readFileSync(filePath, "utf-8");
    const frontmatterMatch = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);

    let body = rawContent;
    let data: Record<string, any> = {};

    if (frontmatterMatch) {
      body = rawContent.replace(frontmatterMatch[0], "").trim();
      data = this.parseFrontmatter(frontmatterMatch[1]);
    }

    return {
      meta: {
        slug,
        title: data.title || slug,
        description: data.description || "",
        date: data.date || "2026-01-01",
        readTime: data.readTime || "5 min read",
        tags: Array.isArray(data.tags) ? data.tags : [],
      },
      content: body,
    };
  }

  private parseFrontmatter(str: string): Record<string, any> {
    const data: Record<string, any> = {};
    for (const line of str.split("\n")) {
      const [key, ...rest] = line.split(":");
      if (key && rest.length > 0) {
        const val = rest
          .join(":")
          .trim()
          .replace(/^['"](.*)['"]$/, "$1");
        if (key.trim() === "tags") {
          data.tags = val
            .replace(/[\[\]]/g, "")
            .split(",")
            .map((t) => t.trim().replace(/^['"](.*)['"]$/, "$1"))
            .filter(Boolean);
        } else {
          data[key.trim()] = val;
        }
      }
    }
    return data;
  }
}

// Configurable blog service layer:
// Swappable to point to a future separate GitHub repository (e.g. `RemoteGitHubBlogProvider`)
const activeBlogProvider: BlogDataSource = new LocalBlogProvider();

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  return await activeBlogProvider.getAllPosts();
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return await activeBlogProvider.getPostBySlug(slug);
}
