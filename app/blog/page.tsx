import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/lib/services/blog";

export const metadata = {
  title: "Blog | Sagar Kumar Jha",
  description: "Technical writings on software engineering, architecture, systems, and algorithms.",
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="py-12 px-4 sm:px-0">
      <div className="max-w-2xl">
        <Badge variant="outline" className="mb-4">
          Writings & Thoughts
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Technical Articles</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Writings and notes on software engineering, computer science fundamentals, system design,
          and developer tools.
        </p>
      </div>

      <div className="mt-10 divide-y divide-border border-t">
        {posts.map((post) => (
          <article key={post.slug} className="py-8 group">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              <time dateTime={post.date}>{post.date}</time>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>

            <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>

            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{post.description}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-mono bg-muted/60 px-2 py-0.5 rounded text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <p className="py-12 text-sm text-muted-foreground">No blog posts available yet.</p>
        )}
      </div>
    </div>
  );
}
