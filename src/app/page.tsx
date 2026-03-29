import { Hero } from "@/components/hero";
import { Timeline } from "@/components/timeline";
import { RunsSection } from "@/components/runs";
import { BlogPreview } from "@/components/blog-preview";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-6">
      <Hero />
      <Timeline />
      <RunsSection />
      <BlogPreview />
    </div>
  );
}
