export interface StravaActivity {
  id: number;
  name: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number;
  type: string;
  sport_type?: string; // "Run", "TrailRun", etc.
  start_date: string;
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  total_elevation_gain: number;
  suffer_score?: number;
  workout_type?: number; // 0=default, 1=race, 2=long run, 3=workout
  raceLabel?: string | null; // e.g. "10K", "Half Marathon" — set for races that snap to a standard distance
  bestEffortTime?: number | null; // scaled time in seconds for the standard distance
  bestEffortPace?: number | null; // seconds per km for the standard distance
}

export interface PersonalBest {
  distance: string;
  time: string;
  pace: string;
  date: string;
}

export interface MonthlyMileage {
  month: string; // e.g. "Aug"
  year: number;
  km: number;
}

export interface StravaData {
  recentRuns: StravaActivity[];
  personalBests: PersonalBest[];
  recentRaces: StravaActivity[];
  monthlyMileage: MonthlyMileage[];
}

const STRAVA_API = "https://www.strava.com/api/v3";

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to refresh Strava token: ${res.status}`);
  }

  const data = await res.json();
  return data.access_token;
}

// Cache Strava data in memory (15 min TTL) to avoid rate limits
let cachedData: StravaData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export async function getStravaData(): Promise<StravaData> {
  if (cachedData && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedData;
  }

  const data = await fetchStravaData();
  cachedData = data;
  cacheTimestamp = Date.now();
  return data;
}

// Single function to fetch all data with one token
async function fetchStravaData(): Promise<StravaData> {
  const token = await getAccessToken();

  // Fetch all activities (paginated) with the same token
  const allRuns: StravaActivity[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `${STRAVA_API}/athlete/activities?per_page=100&page=${page}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      if (page === 1) {
        throw new Error(`Failed to fetch activities: ${res.status}`);
      }
      break;
    }

    const activities: StravaActivity[] = await res.json();
    if (activities.length === 0) break;

    allRuns.push(...activities.filter((a) => a.type === "Run" || a.type === "TrailRun" || a.sport_type === "TrailRun"));
    page++;
  }

  // Most recent 5 runs
  const recentRuns = allRuns
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
    .slice(0, 5);

  const personalBests = computePersonalBests(allRuns);

  // Races: workout_type === 1
  const recentRaces = allRuns
    .filter((r) => r.workout_type === 1)
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  for (const race of recentRaces) {
    computeRaceDisplay(race);
  }

  const monthlyMileage = computeMonthlyMileage(allRuns, 8);

  return { recentRuns, personalBests, recentRaces, monthlyMileage };
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthKey(year: number, month: number): string {
  return `${year}-${month}`;
}

function computeMonthlyMileage(runs: StravaActivity[], months: number): MonthlyMileage[] {
  const now = new Date();
  const result: MonthlyMileage[] = [];
  const lookup = new Map<string, MonthlyMileage>();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const entry: MonthlyMileage = {
      month: MONTH_NAMES[d.getMonth()],
      year: d.getFullYear(),
      km: 0,
    };
    result.push(entry);
    lookup.set(monthKey(d.getFullYear(), d.getMonth()), entry);
  }

  for (const run of runs) {
    const runDate = new Date(run.start_date);
    const entry = lookup.get(monthKey(runDate.getFullYear(), runDate.getMonth()));
    if (entry) {
      entry.km += run.distance / 1000;
    }
  }

  for (const m of result) {
    m.km = Math.round(m.km * 10) / 10;
  }

  return result;
}

const RACE_DISTANCES = [
  { label: "5K", meters: 5000 },
  { label: "10K", meters: 10000 },
  { label: "15K", meters: 15000 },
  { label: "10 Mile", meters: 16093 },
  { label: "Half Marathon", meters: 21097 },
  { label: "30K", meters: 30000 },
  { label: "Marathon", meters: 42195 },
];

const RACE_SNAP_TOLERANCE = 0.05; // 5%

function computeRaceDisplay(activity: StravaActivity): void {
  let closest: (typeof RACE_DISTANCES)[number] | null = null;
  let closestDiff = Infinity;

  for (const rd of RACE_DISTANCES) {
    const diff = Math.abs(activity.distance - rd.meters);
    if (diff / rd.meters <= RACE_SNAP_TOLERANCE && diff < closestDiff) {
      closest = rd;
      closestDiff = diff;
    }
  }

  if (!closest) {
    activity.raceLabel = null;
    activity.bestEffortTime = null;
    activity.bestEffortPace = null;
    return;
  }

  const scaledTime = (closest.meters / activity.distance) * activity.moving_time;
  const paceSecondsPerKm = scaledTime / (closest.meters / 1000);

  activity.raceLabel = closest.label;
  activity.bestEffortTime = Math.round(scaledTime);
  activity.bestEffortPace = paceSecondsPerKm;
}

interface PBDistance {
  label: string;
  meters: number;
  tolerance: number;
}

const PB_DISTANCES: PBDistance[] = [
  { label: "5K", meters: 5000, tolerance: 200 },
  { label: "10K", meters: 10000, tolerance: 400 },
  { label: "Half Mara", meters: 21097, tolerance: 500 },
  { label: "Marathon", meters: 42195, tolerance: 1000 },
];

function computePersonalBests(runs: StravaActivity[]): PersonalBest[] {
  const pbs: PersonalBest[] = [];

  for (const dist of PB_DISTANCES) {
    const qualifying = runs.filter(
      (r) => r.distance >= dist.meters - dist.tolerance
    );

    if (qualifying.length === 0) continue;

    let best: StravaActivity | null = null;
    let bestTime = Infinity;

    for (const run of qualifying) {
      if (run.distance <= dist.meters + dist.tolerance) {
        if (run.moving_time < bestTime) {
          bestTime = run.moving_time;
          best = run;
        }
      } else {
        const estimatedTime = (dist.meters / run.distance) * run.moving_time;
        if (estimatedTime < bestTime) {
          bestTime = estimatedTime;
          best = run;
        }
      }
    }

    if (best) {
      const paceSecondsPerKm = bestTime / (dist.meters / 1000);
      pbs.push({
        distance: dist.label,
        time: formatDuration(Math.round(bestTime)),
        pace: formatPaceFromSeconds(paceSecondsPerKm),
        date: formatDate(best.start_date),
      });
    }
  }

  return pbs;
}

export function formatDistance(meters: number): string {
  return `${(meters / 1000).toFixed(2)} km`;
}

export function formatPace(metersPerSecond: number): string {
  const secondsPerKm = 1000 / metersPerSecond;
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")} /km`;
}

export function formatPaceFromSeconds(secondsPerKm: number): string {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")} /km`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
