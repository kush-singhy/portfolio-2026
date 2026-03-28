"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <nav className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
