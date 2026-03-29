import { NextResponse } from "next/server";
import { getStravaData } from "@/lib/strava";

export const revalidate = 900; // ISR: cache on Vercel edge for 15 minutes

export async function GET() {
  try {
    const data = await getStravaData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch Strava data:", error);
    return NextResponse.json(
      { recentRuns: [], personalBests: [], recentRaces: [] },
      { status: 500 }
    );
  }
}
