import type { AboutSectionConfig } from "@/lib/types";

export const aboutConfig: AboutSectionConfig = {
  id: "about",
  eyebrow: "About",
  title: "Systems & Full-Stack Software Engineer",
  description:
    "I engineer low-level systems, storage engines, and developer tooling from first principles with modern C++20, Rust, and TypeScript.",

  focus: [
    {
      title: "Systems Programming",
      description:
        "Building reliable, memory-safe software in modern C++20 and Rust with cache-conscious data structures and high-throughput POSIX I/O.",
    },
    {
      title: "Storage & Developer Tools",
      description:
        "Designing content-addressable storage (CAS), LSM-trees, Eugene Myers diff engines, Git packfile protocols, and CMake build systems.",
    },
    {
      title: "Full-Stack Architecture",
      description:
        "Engineering offline-first applications across web, desktop (Electron), and VS Code with TypeScript, React 19, and Next.js.",
    },
    {
      title: "Algorithms & Problem Solving",
      description:
        "LeetCode Guardian (2382 contest rating, top 0.36% globally) with 720+ algorithmic challenges solved across graphs, trees, and DP.",
    },
  ],
};
