"use client";

import { useState } from "react";
import type { MonthlyMileage } from "@/lib/strava";

const VISIBLE_MONTHS = 8;

const SKELETON_HEIGHTS = [65, 55, 70, 40, 30, 25, 60, 75];

function fullMonthName(shortName: string, year: number): string {
  const monthIndex = new Date(`${shortName} 1, ${year}`).getMonth();
  return new Date(year, monthIndex).toLocaleString("en-US", { month: "long" });
}

export function MileageChart({ data }: { data: MonthlyMileage[] }) {
  const chartData = data.slice(-VISIBLE_MONTHS);
  const maxKm = Math.max(...chartData.map((m) => m.km), 1);
  const [hover, setHover] = useState<{ x: number; y: number; index: number } | null>(null);

  const hovered = hover !== null ? chartData[hover.index] : null;

  return (
    <div
      className="rounded-lg border border-border bg-card p-4 sm:p-5 relative"
      onMouseLeave={() => setHover(null)}
    >
      {hover && hovered && (
        <div
          className="fixed z-50 bg-card border border-border px-2 py-1.5 rounded pointer-events-none shadow-md flex flex-col items-center"
          style={{ left: hover.x, top: hover.y - 48, transform: "translateX(-50%)" }}
        >
          <span className="text-[11px] sm:text-xs font-semibold text-foreground tabular-nums whitespace-nowrap">
            {Math.round(hovered.km)}km
          </span>
          <span className="text-[9px] sm:text-[10px] text-muted whitespace-nowrap">
            {fullMonthName(hovered.month, hovered.year)} {hovered.year}
          </span>
        </div>
      )}
      <div className="flex items-end gap-1 sm:gap-2 pt-5">
        {chartData.map((m, i) => {
          const height = (m.km / maxKm) * 100;
          return (
            <div
              key={`${m.month}-${m.year}`}
              className="flex-1 min-w-0 flex flex-col items-center gap-1"
            >
              <div
                className="w-full h-28 sm:h-32 relative"
                onMouseMove={(e) => setHover({ x: e.clientX, y: e.clientY, index: i })}
                onMouseLeave={() => setHover(null)}
              >
                <span
                  className="absolute left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] tabular-nums text-muted whitespace-nowrap"
                  style={{ bottom: `${Math.max(height, 1.5)}%`, marginBottom: '2px' }}
                >
                  {Math.round(m.km)}
                </span>
                <div
                  className="absolute bottom-0 w-full rounded-t-md bg-accent/80 hover:bg-accent transition-colors min-h-[2px]"
                  style={{ height: `${Math.max(height, 1.5)}%` }}
                />
              </div>
              <span className="text-[9px] sm:text-[11px] text-muted whitespace-nowrap">
                <span>{m.month}</span>
                <span className="hidden sm:inline"> &apos;{String(m.year).slice(2)}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MileageChartLoading() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-5 animate-pulse">
      <div className="flex items-end gap-1 sm:gap-2">
        {Array.from({ length: VISIBLE_MONTHS }).map((_, i) => (
          <div
            key={i}
            className="flex-1 min-w-0 flex flex-col items-center gap-1"
          >
            <div className="w-full h-28 sm:h-32 flex items-end">
              <div
                className="w-full rounded-t-md bg-border"
                style={{ height: `${SKELETON_HEIGHTS[i]}%` }}
              />
            </div>
            <div className="h-3 w-6 bg-border rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
