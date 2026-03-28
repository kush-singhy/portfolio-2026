import {
  type StravaActivity,
  type PersonalBest,
  formatDistance,
  formatPace,
  formatDuration,
  formatDate,
} from "@/lib/strava";
import { Activity, Trophy, Clock, TrendingUp } from "lucide-react";

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

function RecentRunCard({ run }: { run: StravaActivity }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <Activity size={16} className="text-accent shrink-0" />
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

interface RunsSectionProps {
  recentRuns: StravaActivity[];
  personalBests: PersonalBest[];
}

export function RunsSection({ recentRuns, personalBests }: RunsSectionProps) {
  return (
    <section className="py-12">
      <h2 className="font-serif text-2xl font-normal tracking-tight mb-6">Runs</h2>

      <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
        Personal Bests
      </h3>
      <PersonalBests pbs={personalBests} />

      <h3 className="text-sm font-medium text-muted uppercase tracking-wide mt-8 mb-3">
        Recent Runs
      </h3>
      {recentRuns.length > 0 ? (
        <div>
          {recentRuns.map((run) => (
            <RecentRunCard key={run.id} run={run} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">
          No recent runs to display. Connect your Strava account to see your
          latest activities.
        </p>
      )}
    </section>
  );
}
