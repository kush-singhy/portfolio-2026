import { Hero } from "@/components/hero";
import { Timeline } from "@/components/timeline";
import { RunsSection } from "@/components/runs";
import { BlogPreview } from "@/components/blog-preview";
import { getStravaData, type StravaData } from "@/lib/strava";
import { getAllPosts } from "@/lib/blog";

export default async function Home() {
  let stravaData: StravaData = { recentRuns: [], personalBests: [] };

  try {
    if (process.env.STRAVA_CLIENT_ID) {
      stravaData = await getStravaData();
    }
  } catch (error) {
    console.error("Failed to fetch Strava data:", error);
  }

  const posts = getAllPosts();

  return (
    <div className="max-w-2xl mx-auto px-6">
      <Hero />
      <Timeline />
      <RunsSection
        recentRuns={stravaData.recentRuns}
        personalBests={stravaData.personalBests}
      />
      <BlogPreview posts={posts} />
    </div>
  );
}
