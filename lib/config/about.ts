import type { AboutSectionConfig } from "@/lib/types";

export const aboutConfig: AboutSectionConfig = {
  id: "about",
  eyebrow: "About",
  title: "Systems & full-stack software engineer.",
  description:
    "I specialize in low-level systems programming, version control internals, developer tooling, and distributed systems. My engineering approach is driven by understanding complex abstractions from first principles—spanning high-performance C++20 storage engines, Rust-based tooling, and modern full-stack web and desktop architectures.",

  focus: [
    {
      title: "Systems Programming",
      description:
        "Building reliable, memory-safe software in modern C++20 and Rust, focusing on cache-conscious data structures, POSIX system calls, and high-throughput I/O.",
    },
    {
      title: "Developer Tools & Storage",
      description:
        "Designing content-addressable storage (CAS), Git-compatible engines, Myers O(ND) diff algorithms, packfile streaming, and cross-platform CMake build systems.",
    },
    {
      title: "Full-Stack Architecture",
      description:
        "Developing offline-first desktop and web applications with TypeScript, React 19, Next.js, and Electron within optimized pnpm monorepo structures.",
    },
    {
      title: "Competitive Programming",
      description:
        "LeetCode Guardian (2382 contest rating, top 0.36% globally) with 715+ algorithmic problems solved across graphs, trees, and dynamic programming.",
    },
  ],
};
