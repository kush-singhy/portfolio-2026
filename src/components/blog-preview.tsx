import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { ArrowRight } from "lucide-react";

interface BlogPreviewProps {
  posts: BlogPost[];
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-normal tracking-tight">Recent Posts</h2>
        <Link
          href="/blog"
          className="text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
        >
          All posts <ArrowRight size={14} />
        </Link>
      </div>
      <div className="space-y-4">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block group rounded-lg border border-border p-4 hover:border-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted mt-1">{post.description}</p>
              </div>
              <div className="text-sm text-muted whitespace-nowrap shrink-0">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
            {post.tags && (
              <div className="flex gap-2 mt-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-card border border-border text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
