"use client";

import { useState } from "react";
import { Briefcase, GraduationCap } from "lucide-react";

interface TimelineItem {
  title: string;
  org: string;
  period: string;
  description: string;
}

const work: TimelineItem[] = [
  {
    title: "Software Engineer",
    org: "Company Name",
    period: "2024 — Present",
    description: "Building scalable web applications and APIs.",
  },
  {
    title: "Software Engineering Intern",
    org: "Previous Company",
    period: "2023 — 2024",
    description: "Worked on frontend features and CI/CD pipelines.",
  },
];

const education: TimelineItem[] = [
  {
    title: "B.S. Computer Science",
    org: "University Name",
    period: "2020 — 2024",
    description: "Coursework in algorithms, systems, and software engineering.",
  },
];

function TimelineList({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-6 mt-4">
      {items.map((item) => (
        <div key={`${item.org}-${item.period}`} className="group">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted">{item.org}</p>
            </div>
            <span className="text-sm text-muted whitespace-nowrap">
              {item.period}
            </span>
          </div>
          <p className="text-sm text-muted mt-1">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export function Timeline() {
  const [tab, setTab] = useState<"work" | "education">("work");

  return (
    <section className="py-12">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => setTab("work")}
          className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-colors ${
            tab === "work"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Briefcase size={16} />
          Work
        </button>
        <button
          onClick={() => setTab("education")}
          className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-colors ${
            tab === "education"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <GraduationCap size={16} />
          Education
        </button>
      </div>
      <TimelineList items={tab === "work" ? work : education} />
    </section>
  );
}
