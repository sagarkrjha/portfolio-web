import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/lib/services/blog";
import { BlogList } from "@/components/app-components/blog/blog-list";

export const metadata = {
  title: "Blog | Sagar Kumar Jha",
  description: "Technical writings on software engineering, architecture, systems, and algorithms.",
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="py-10">
      <div className="max-w-2xl">
        <Badge variant="outline" className="mb-4">
          Articles
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Engineering Blog</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Notes and write-ups on systems programming, algorithmic problem solving, and developer tooling.
        </p>
      </div>

      <BlogList posts={posts} />
    </div>
  );
}
