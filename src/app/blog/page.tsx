import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog — Kush",
  description: "Thoughts on software, running, and building things.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-normal tracking-tight mb-2">Blog</h1>
      <p className="text-muted mb-10">
        Thoughts on software, running, and building things.
      </p>

      {posts.length === 0 ? (
        <p className="text-muted text-sm">No posts yet. Check back soon!</p>
      ) : (
        <div className="space-y-1">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex items-start justify-between gap-4 py-3 group border-b border-border last:border-0"
            >
              <div>
                <h2 className="font-medium group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted mt-1">{post.description}</p>
                {post.tags && (
                  <div className="flex gap-2 mt-2">
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
              </div>
              <div className="text-sm text-muted whitespace-nowrap shrink-0 pt-0.5">
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="mx-2">·</span>
                <span>{post.readingTime}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
