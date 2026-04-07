"use client";

import { useState } from "react";
import {
  type StravaActivity,
  formatDistance,
  formatPace,
  formatPaceFromSeconds,
  formatDuration,
  formatDate,
} from "@/lib/strava";
import { Flag, Clock, TrendingUp } from "lucide-react";

const PAGE_SIZE = 5;

function RaceRow({ run }: { run: StravaActivity }) {
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

export function ExpandableRaces({ races }: { races: StravaActivity[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const allLoaded = visibleCount >= races.length;

  if (races.length === 0) {
    return <p className="text-sm text-muted">No races found yet.</p>;
  }

  return (
    <div>
      <div>
        {races.slice(0, visibleCount).map((race) => (
          <RaceRow key={race.id} run={race} />
        ))}
      </div>
      {races.length > PAGE_SIZE && (
        <button
          onClick={() => {
            if (allLoaded) {
              setVisibleCount(PAGE_SIZE);
            } else {
              setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, races.length));
            }
          }}
          className="mt-4 text-sm text-accent hover:text-accent-hover transition-colors cursor-pointer"
        >
          {allLoaded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
