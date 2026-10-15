import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/services/blog";
import { highlightCode } from "@/lib/prism";
import React from "react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.meta.title} | Sagar Kumar Jha`,
    description: post.meta.description,
  };
}

// Helper to format inline code, bold, italics, math, and links
function renderInlineFormatted(text: string): React.ReactNode {
  // Regex to match inline code (`...`), bold (**...**), math ($...$), and italic (*...*)
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\$[^\$]+\$)/g);

  return tokens.map((token, i) => {
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground font-medium border border-border/50"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("$") && token.endsWith("$")) {
      return (
        <span
          key={i}
          className="font-mono text-xs italic bg-muted/40 px-1 py-0.5 rounded text-foreground"
        >
          {token.slice(1, -1)}
        </span>
      );
    }
    return token;
  });
}

// Custom markdown content renderer with syntax highlighting and rich element support
function renderMarkdownContent(content: string) {
  // Split on code blocks and normal paragraphs
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const firstLineEnd = part.indexOf("\n");
      const lang = part.slice(3, firstLineEnd).trim();
      const code = part.slice(firstLineEnd + 1, -3);

      const { highlightedHtml, language } = highlightCode(code, lang);

      return (
        <pre
          key={index}
          className="my-5 overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 font-mono text-xs sm:text-sm leading-relaxed text-foreground"
        >
          {highlightedHtml ? (
            <code
              className={`language-${language} font-mono`}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Prism output is safe
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          ) : (
            <code>{code}</code>
          )}
        </pre>
      );
    }

    // Process normal markdown sections
    const lines = part.split(/\n\n+/);
    return (
      <div key={index} className="space-y-4">
        {lines.map((paragraph, pIdx) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return null;

          if (trimmed === "---") {
            return <hr key={pIdx} className="my-8 border-border" />;
          }

          if (trimmed.startsWith("# ")) {
            return (
              <h1 key={pIdx} className="text-2xl sm:text-3xl font-bold tracking-tight mt-8 mb-4">
                {trimmed.replace("# ", "")}
              </h1>
            );
          }
          if (trimmed.startsWith("## ")) {
            return (
              <h2
                key={pIdx}
                className="text-xl sm:text-2xl font-semibold tracking-tight mt-8 mb-3 border-b border-border pb-2"
              >
                {trimmed.replace("## ", "")}
              </h2>
            );
          }
          if (trimmed.startsWith("### ")) {
            return (
              <h3
                key={pIdx}
                className="text-lg sm:text-xl font-semibold tracking-tight mt-6 mb-2 text-foreground"
              >
                {trimmed.replace("### ", "")}
              </h3>
            );
          }
          if (trimmed.startsWith("#### ")) {
            return (
              <h4
                key={pIdx}
                className="text-base font-semibold tracking-tight mt-4 mb-1 text-foreground"
              >
                {trimmed.replace("#### ", "")}
              </h4>
            );
          }
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            const items = trimmed.split("\n").map((i) => i.replace(/^[-*]\s+/, ""));
            return (
              <ul
                key={pIdx}
                className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-muted-foreground my-3 pl-2"
              >
                {items.map((it, itIdx) => (
                  <li key={itIdx} className="leading-relaxed">
                    {renderInlineFormatted(it)}
                  </li>
                ))}
              </ul>
            );
          }

          // Numbered list
          if (/^\d+\.\s/.test(trimmed)) {
            const items = trimmed.split("\n").map((i) => i.replace(/^\d+\.\s+/, ""));
            return (
              <ol
                key={pIdx}
                className="list-decimal list-inside space-y-1.5 text-sm sm:text-base text-muted-foreground my-3 pl-2"
              >
                {items.map((it, itIdx) => (
                  <li key={itIdx} className="leading-relaxed">
                    {renderInlineFormatted(it)}
                  </li>
                ))}
              </ol>
            );
          }

          // Block math expression ($$...$$)
          if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
            return (
              <div
                key={pIdx}
                className="my-4 py-3 px-4 rounded-md bg-muted/40 border border-border/40 text-center font-mono text-sm sm:text-base text-foreground overflow-x-auto"
              >
                {trimmed.slice(2, -2).trim()}
              </div>
            );
          }

          return (
            <p key={pIdx} className="text-sm sm:text-base leading-7 text-muted-foreground">
              {renderInlineFormatted(trimmed)}
            </p>
          );
        })}
      </div>
    );
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-12 max-w-3xl mx-auto px-4 sm:px-0">
      <div className="mb-8">
        <Link
          href="/blog"
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-6"
        >
          ← Back to all posts
        </Link>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <time dateTime={post.meta.date}>{post.meta.date}</time>
          <span>•</span>
          <span>{post.meta.readTime}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{post.meta.title}</h1>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {post.meta.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono bg-muted/60 px-2 py-0.5 rounded text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t pt-8 space-y-4">{renderMarkdownContent(post.content)}</div>
    </article>
  );
}
