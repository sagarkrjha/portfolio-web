import type { AboutSectionConfig } from "@/lib/types";

export const aboutConfig: AboutSectionConfig = {
  id: "about",
  eyebrow: "About",
  title: "Building robust systems and developer tools from first principles.",
  description:
    "I specialize in low-level systems programming, version control internals, and developer infrastructure. My engineering philosophy centers on understanding complex abstractions by implementing them from first principles—spanning modern C++20 and full-stack TypeScript architectures.",

  focus: [
    {
      title: "Systems Programming",
      description:
        "Building reliable software in modern C++20, focusing on memory safety, cache-conscious data structures, and POSIX system calls.",
    },
    {
      title: "Developer Infrastructure",
      description:
        "Designing content-addressable storage, build systems (CMake), and automated cross-platform CI/CD release pipelines.",
    },
    {
      title: "Algorithms & Competitive Programming",
      description:
        "LeetCode Guardian (2382 rating, top 0.36% globally) with 715+ algorithmic problems solved across advanced data structures and dynamic programming.",
    },
  ],
};