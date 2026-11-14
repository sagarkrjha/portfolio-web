"use client";

import React, { useState } from "react";
import { FiList, FiChevronDown, FiChevronUp } from "react-icons/fi";

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: HeadingItem[];
  variant?: "desktop" | "mobile";
}

export function TableOfContents({ headings, variant }: TableOfContentsProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  if (!headings || headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (variant === "mobile") {
    return (
      <div className="lg:hidden my-6 rounded-lg border border-border bg-muted/30 overflow-hidden text-xs">
        <button
          type="button"
          onClick={() => setMobileExpanded((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-2.5 font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          <span className="flex items-center gap-2 font-mono text-[11px] font-semibold text-primary uppercase">
            <FiList className="size-3.5" />
            Table of Contents ({headings.length})
          </span>
          {mobileExpanded ? <FiChevronUp className="size-4" /> : <FiChevronDown className="size-4" />}
        </button>

        {mobileExpanded && (
          <div className="px-4 py-3 border-t border-border space-y-1 bg-muted/10 max-h-60 overflow-y-auto">
            {headings.map((h, i) => (
              <button
                type="button"
                key={i}
                onClick={() => {
                  scrollToHeading(h.id);
                  setMobileExpanded(false);
                }}
                className={`block w-full text-left truncate py-1 text-[12px] hover:text-primary transition-colors cursor-pointer ${
                  h.level === 3 ? "pl-3 text-muted-foreground" : "font-medium text-foreground"
                }`}
              >
                {h.text}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === "desktop") {
    return (
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-primary uppercase tracking-wider pb-2 border-b border-border">
            <FiList className="size-3.5" />
            <span>Table of Contents</span>
          </div>
          <nav className="space-y-1 pt-1">
            {headings.map((h, i) => (
              <button
                type="button"
                key={i}
                onClick={() => scrollToHeading(h.id)}
                className={`block w-full text-left truncate py-1 px-1.5 rounded hover:bg-muted/60 hover:text-primary transition-colors cursor-pointer text-[12px] ${
                  h.level === 3
                    ? "pl-4 text-muted-foreground hover:text-foreground"
                    : "font-medium text-foreground/90"
                }`}
                title={h.text}
              >
                {h.text}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    );
  }

  return (
    <>
      <TableOfContents headings={headings} variant="mobile" />
      <TableOfContents headings={headings} variant="desktop" />
    </>
  );
}
