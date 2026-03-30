"use client";

import { useState, useEffect } from "react";
import type { StravaData } from "./strava";

const CACHE_KEY = "strava-data";
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

interface CachedData {
  data: StravaData;
  timestamp: number;
}

function getCachedData(): StravaData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const cached: CachedData = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    const data = cached.data;
    if (!data.monthlyMileage) return null;
    return data;
  } catch {
    return null;
  }
}

function setCachedData(data: StravaData): void {
  try {
    const cached: CachedData = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

const EMPTY: StravaData = { recentRuns: [], personalBests: [], recentRaces: [], monthlyMileage: [] };

export function useStravaData() {
  const [data, setData] = useState<StravaData>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = getCachedData();
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    fetch("/api/strava")
      .then((res) => res.json())
      .then((freshData: StravaData) => {
        setData(freshData);
        setCachedData(freshData);
      })
      .catch(() => {
        // fail silently, keep empty state
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
