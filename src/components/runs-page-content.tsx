"use client";

import {
  type StravaActivity,
  type PersonalBest,
  formatDistance,
  formatPace,
  formatDuration,
  formatDate,
} from "@/lib/strava";
import { useStravaData } from "@/lib/use-strava-data";
import { Mountain, SportShoe, Trophy, Clock, TrendingUp } from "lucide-react";
import { ExpandableRaces } from "@/components/expandable-races";
import { MileageChart, MileageChartLoading } from "@/components/mileage-chart";

function PersonalBests({ pbs }: { pbs: PersonalBest[] }) {
  if (pbs.length === 0) {
    return <p className="text-sm text-muted">No personal bests yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {pbs.map((pb) => (
        <div
          key={pb.distance}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={14} className="text-accent" />
            <span className="text-xs font-medium text-muted uppercase tracking-wide">
              {pb.distance}
            </span>
          </div>
          <p className="text-lg font-semibold tabular-nums">{pb.time}</p>
          <p className="text-xs text-muted mt-1">{pb.pace}</p>
          <p className="text-xs text-muted">{pb.date}</p>
        </div>
      ))}
    </div>
  );
}

function isTrailRun(run: StravaActivity): boolean {
  if (run.sport_type === "TrailRun") return true;
  if (run.type === "TrailRun") return true;
  return /trail/i.test(run.name);
}

function RunIcon({ run }: { run: StravaActivity }) {
  if (isTrailRun(run)) {
    return <Mountain size={16} className="text-accent shrink-0" />;
  }
  return <SportShoe size={16} className="text-accent shrink-0" />;
}

function RunRow({ run }: { run: StravaActivity }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <RunIcon run={run} />
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{run.name}</p>
          <p className="text-xs text-muted">{formatDate(run.start_date)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm tabular-nums shrink-0">
        <span className="flex items-center gap-1 text-muted">
          <TrendingUp size={14} />
          {formatDistance(run.distance)}
        </span>
        <span className="flex items-center gap-1 text-muted">
          <Clock size={14} />
          {formatDuration(run.moving_time)}
        </span>
        <span className="hidden sm:inline text-muted">
          {formatPace(run.average_speed)}
        </span>
      </div>
    </div>
  );
}

function LoadingPBs() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-4 animate-pulse">
          <div className="h-3 w-12 bg-border rounded mb-3" />
          <div className="h-6 w-16 bg-border rounded mb-2" />
          <div className="h-3 w-14 bg-border rounded" />
        </div>
      ))}
    </div>
  );
}

function LoadingRows() {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-border rounded" />
            <div>
              <div className="h-4 w-32 bg-border rounded mb-1" />
              <div className="h-3 w-20 bg-border rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RunsPageContent() {
  const { data, loading } = useStravaData();

  return (
    <>
      <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
        Monthly Mileage
      </h2>
      {loading ? <MileageChartLoading /> : <MileageChart data={data.monthlyMileage} />}

      <h2 className="text-sm font-medium text-muted uppercase tracking-wide mt-10 mb-3">
        Personal Bests
      </h2>
      {loading ? <LoadingPBs /> : <PersonalBests pbs={data.personalBests} />}

      <h2 className="text-sm font-medium text-muted uppercase tracking-wide mt-10 mb-3">
        Recent Races
      </h2>
      {loading ? (
        <LoadingRows />
      ) : (
        <ExpandableRaces races={data.recentRaces} />
      )}

      <h2 className="text-sm font-medium text-muted uppercase tracking-wide mt-10 mb-3">
        Recent Runs
      </h2>
      {loading ? (
        <LoadingRows />
      ) : data.recentRuns.length > 0 ? (
        <div>
          {data.recentRuns.map((run) => (
            <RunRow key={run.id} run={run} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">
          No recent runs to display. Connect your Strava account to see your
          latest activities.
        </p>
      )}
    </>
  );
}
