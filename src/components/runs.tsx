"use client";

import Link from "next/link";
import {
  type StravaActivity,
  type PersonalBest,
  formatDistance,
  formatPace,
  formatPaceFromSeconds,
  formatDuration,
  formatDate,
} from "@/lib/strava";
import { useStravaData } from "@/lib/use-strava-data";
import { Flag, Trophy, Clock, TrendingUp } from "lucide-react";

function PersonalBests({ pbs }: { pbs: PersonalBest[] }) {
  if (pbs.length === 0) {
    return (
      <p className="text-sm text-muted">
        No personal bests yet.
      </p>
    );
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

function RaceCard({ run }: { run: StravaActivity }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <Flag size={16} className="text-accent shrink-0" />
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{run.name}</p>
          <p className="text-xs text-muted">{formatDate(run.start_date)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm tabular-nums shrink-0">
        <span className="flex items-center gap-1 text-muted">
          <TrendingUp size={14} />
          {run.raceLabel ?? formatDistance(run.distance)}
        </span>
        <span className="flex items-center gap-1 text-muted">
          <Clock size={14} />
          {formatDuration(run.bestEffortTime ?? run.moving_time)}
        </span>
        <span className="hidden sm:inline text-muted">
          {run.bestEffortPace != null
            ? formatPaceFromSeconds(run.bestEffortPace)
            : formatPace(run.average_speed)}
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
      {[1, 2, 3].map((i) => (
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

export function RunsSection() {
  const { data, loading } = useStravaData();

  return (
    <section className="py-12">
      <h2 className="font-serif text-2xl font-normal tracking-tight mb-6">Runs</h2>

      <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
        Personal Bests
      </h3>
      {loading ? <LoadingPBs /> : <PersonalBests pbs={data.personalBests} />}

      <h3 className="text-sm font-medium text-muted uppercase tracking-wide mt-8 mb-3">
        Recent Races
      </h3>
      {loading ? (
        <LoadingRows />
      ) : data.recentRaces.length > 0 ? (
        <div>
          {data.recentRaces.slice(0, 5).map((race) => (
            <RaceCard key={race.id} run={race} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">
          No races found yet.
        </p>
      )}
      <Link
        href="/runs"
        className="inline-block mt-4 text-sm text-accent hover:text-accent-hover transition-colors"
      >
        See more &rarr;
      </Link>
    </section>
  );
}
