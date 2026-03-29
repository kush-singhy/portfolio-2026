"use client";

import { useState } from "react";
import Image from "next/image";
import { Briefcase, GraduationCap, BookOpen } from "lucide-react";

interface TimelineRole {
  title: string;
  period: string;
  bullets: string[];
}

interface TimelineOrg {
  org: string;
  logo?: string;
  icon?: "tutoring";
  roles: TimelineRole[];
}

const work: TimelineOrg[] = [
  {
    org: "Westpac",
    logo: "/logos/westpac.png",
    roles: [
      {
        title: "iOS Software Engineer",
        period: "Jul 2024 — Present",
        bullets: [
          "Using AI-powered tools like Amp Code to ship features faster and streamline engineering workflows.",
          "Building features and improving user experience across the Westpac iOS app using UIKit, SwiftUI, and ScreenIA.",
          "Working with a Redux and Domain Library architecture.",
        ],
      },
    ],
  },
  {
    org: "American Express",
    logo: "/logos/amex.png",
    roles: [
      {
        title: "Global Merchant Services Risk Intern",
        period: "Mar 2022 — Sep 2022",
        bullets: [
          "Learnt a lot about the risks of the Fintech industry.",
          "Documented risk management strategies to onboard Fintech companies with AMEX.",
        ],
      },
    ],
  },
  {
    org: "Curiosity Curve",
    icon: "tutoring",
    roles: [
      {
        title: "Founder & Tutor",
        period: "Dec 2019 — Feb 2022",
        bullets: [
          "Founded a maths tutoring business, growing to over 80 students.",
          "Highly rated with numerous student success stories.",
        ],
      },
    ],
  },
];

const education: TimelineOrg[] = [
  {
    org: "UNSW",
    logo: "/logos/unsw.png",
    roles: [
      {
        title: "B. Computer Science & B. Actuarial Studies",
        period: "Jan 2020 — May 2024",
        bullets: [
          "Graduated with Distinction in both Degrees.",
          "Recipient of the Dean's Honour List.",
        ],
      },
    ],
  },
  {
    org: "The University of Manchester",
    logo: "/logos/manchester.png",
    roles: [
      {
        title: "Actuarial Studies & Computer Science",
        period: "Sep 2022 — Jan 2023",
        bullets: [
          "Spent a semester abroad as an excuse to travel Europe.",
        ],
      },
    ],
  },
];

function OrgLogo({ item }: { item: TimelineOrg }) {
  if (item.icon === "tutoring") {
    return (
      <div className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center shrink-0 relative z-10">
        <BookOpen size={18} className="text-accent" />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-full border border-border bg-card overflow-hidden shrink-0 relative z-10">
      <Image
        src={item.logo!}
        alt={item.org}
        width={40}
        height={40}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function TimelineList({ items }: { items: TimelineOrg[] }) {
  return (
    <div className="mt-4">
      {items.map((item, i) => (
        <div key={item.org} className="flex gap-4 relative">
          {/* Vertical line */}
          {i < items.length - 1 && (
            <div className="absolute left-5 top-10 bottom-0 w-px bg-border" />
          )}

          {/* Logo */}
          <div className="pt-0.5">
            <OrgLogo item={item} />
          </div>

          {/* Content */}
          <div className={`min-w-0 flex-1 ${i < items.length - 1 ? "pb-8" : ""}`}>
            <h3 className="font-medium">{item.org}</h3>
            {item.roles.map((role) => (
              <div key={role.period} className="mt-1">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-muted font-medium">{role.title}</p>
                  <span className="text-sm text-muted whitespace-nowrap shrink-0">
                    {role.period}
                  </span>
                </div>
                <ul className="mt-2 space-y-1">
                  {role.bullets.map((bullet) => (
                    <li key={bullet} className="text-sm text-foreground flex gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-muted shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
          className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-colors cursor-pointer ${
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
          className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-colors cursor-pointer ${
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
