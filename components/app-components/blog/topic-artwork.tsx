import React from "react";
import {
  FiCpu,
  FiGitCommit,
  FiCode,
  FiLayers,
  FiTerminal,
  FiDatabase,
  FiActivity,
  FiShield,
  FiCloud,
  FiServer,
  FiBox,
} from "react-icons/fi";
import { SiRust, SiCplusplus, SiTypescript, SiLinux, SiDocker } from "react-icons/si";

interface TopicArtworkProps {
  tags: string[];
  slug?: string;
  className?: string;
}

export const TopicArtwork = ({ tags, slug = "", className = "" }: TopicArtworkProps) => {
  const normalizedTags = tags.map((t) => t.toLowerCase());
  const slugLower = slug.toLowerCase();

  // 1. Rust / Systems Safe Concurrency
  if (
    normalizedTags.includes("rust") ||
    slugLower.includes("rust")
  ) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-amber-950/40 via-card to-background border border-amber-600/30 flex items-center justify-center ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex flex-col items-center gap-1.5 text-amber-500">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-xs">
            <SiRust className="size-6 text-amber-500" />
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-amber-500/90 font-semibold">
            Rust · Memory Safety
          </span>
        </div>
      </div>
    );
  }

  // 2. C++ / Low-Level Memory Engine
  if (
    normalizedTags.some((t) => ["c++", "c++20", "cpp"].includes(t)) &&
    !slugLower.includes("diff") &&
    !slugLower.includes("dsa")
  ) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-blue-950/40 via-card to-background border border-blue-600/30 flex items-center justify-center ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex flex-col items-center gap-1.5 text-blue-400">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 backdrop-blur-xs">
            <SiCplusplus className="size-6 text-blue-400" />
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-blue-400/90 font-semibold">
            C++20 · Systems Core
          </span>
        </div>
      </div>
    );
  }

  // 3. Filesystem, OS Kernel & Concurrency
  if (
    normalizedTags.some((t) => ["filesystem", "concurrency", "os", "linux"].includes(t)) ||
    slugLower.includes("race-condition")
  ) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-emerald-950/40 via-card to-background border border-emerald-500/30 flex items-center justify-center ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex flex-col items-center gap-1.5 text-emerald-400">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xs">
            <FiCpu className="size-6 text-emerald-400" />
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-emerald-400/90 font-semibold">
            POSIX · Atomic Swaps
          </span>
        </div>
      </div>
    );
  }

  // 4. Git Internals & Version Control
  if (
    normalizedTags.some((t) => ["git", "diff", "vcs"].includes(t)) ||
    slugLower.includes("diff")
  ) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-cyan-950/40 via-card to-background border border-cyan-500/30 flex items-center justify-center ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex flex-col items-center gap-1.5 text-cyan-400">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-xs">
            <FiGitCommit className="size-6 text-cyan-400" />
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-cyan-400/90 font-semibold">
            VCS · Edit Graphs
          </span>
        </div>
      </div>
    );
  }

  // 5. Data Structures & Competitive Programming
  if (
    normalizedTags.some((t) => ["dsa", "competitive programming", "leetcode"].includes(t)) ||
    slugLower.includes("dsa")
  ) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-amber-950/40 via-card to-background border border-amber-500/30 flex items-center justify-center ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex flex-col items-center gap-1.5 text-amber-400">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-xs">
            <FiCode className="size-6 text-amber-400" />
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-amber-400/90 font-semibold">
            DSA · Invariants
          </span>
        </div>
      </div>
    );
  }

  // 6. Performance, Cache & Complexity
  if (
    normalizedTags.some((t) => ["performance", "complexity", "benchmarks"].includes(t)) ||
    slugLower.includes("complexity")
  ) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-indigo-950/40 via-card to-background border border-indigo-500/30 flex items-center justify-center ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex flex-col items-center gap-1.5 text-indigo-400">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-xs">
            <FiActivity className="size-6 text-indigo-400" />
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-indigo-400/90 font-semibold">
            Hardware · Latency
          </span>
        </div>
      </div>
    );
  }

  // 7. Database, Storage & CAS
  if (
    normalizedTags.some((t) => ["database", "storage", "cas", "lsm", "sql"].includes(t)) ||
    slugLower.includes("db")
  ) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-teal-950/40 via-card to-background border border-teal-500/30 flex items-center justify-center ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex flex-col items-center gap-1.5 text-teal-400">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 backdrop-blur-xs">
            <FiDatabase className="size-6 text-teal-400" />
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-teal-400/90 font-semibold">
            Storage · LSM Trees
          </span>
        </div>
      </div>
    );
  }

  // 8. DevOps, CI/CD & Cloud
  if (
    normalizedTags.some((t) => ["devops", "docker", "ci/cd", "cloud", "actions"].includes(t)) ||
    slugLower.includes("devops")
  ) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-sky-950/40 via-card to-background border border-sky-500/30 flex items-center justify-center ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex flex-col items-center gap-1.5 text-sky-400">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 backdrop-blur-xs">
            <FiCloud className="size-6 text-sky-400" />
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-sky-400/90 font-semibold">
            CI/CD · Pipelines
          </span>
        </div>
      </div>
    );
  }

  // 9. Default Software Architecture & System Design
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-purple-950/40 via-card to-background border border-purple-500/30 flex items-center justify-center ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className="relative flex flex-col items-center gap-1.5 text-purple-400">
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 backdrop-blur-xs">
          <FiLayers className="size-6 text-purple-400" />
        </div>
        <span className="font-mono text-[10px] tracking-widest uppercase text-purple-400/90 font-semibold">
          Architecture · Schemas
        </span>
      </div>
    </div>
  );
};

export default TopicArtwork;
