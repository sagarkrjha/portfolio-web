import type { SiteConfig } from "@/lib/types";

export const siteConfig: SiteConfig = {
  title: "Sagar Kumar Jha | Software Engineer",
  name: "Sagar Kumar Jha",
  role: "Systems & Full-Stack Engineer",
  bio: "Building robust systems, developer tooling, and modern software from first principles with modern C++20 and TypeScript.",
  location: "Delhi, India",
  availability: "Open to engineering roles & collaborations",

  navItems: [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Resume", href: "/resume" },
  ],

  socialLinks: [
    {
      platform: "github",
      label: "GitHub",
      href: "https://github.com/sagarkrjha",
      external: true,
    },
    {
      platform: "leetcode",
      label: "LeetCode",
      href: "https://leetcode.com/u/devsagarkrjha/",
      external: true,
    },
    {
      platform: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/devsagarkumarjha",
      external: true,
    },
    {
      platform: "twitter",
      label: "X (Twitter)",
      href: "https://x.com/devsagarkrjha",
      external: true,
    },
    {
      platform: "discord",
      label: "Discord",
      href: "https://discord.com/users/894502933801107476",
      external: true,
    },
  ],

  github: {
    username: "sagarkrjha",
    repositoryCount: 9,
    pinnedRepos: ["minigit", "codeshelf", "level-db-cpp"],
    includeForks: false,
  },

  leetcode: {
    username: "devsagarkrjha",
    profileUrl: "https://leetcode.com/u/devsagarkrjha/",
  },

  terminal: {
    /** Shell username based on GitHub handle */
    unixUser: "sagarkrjha",
    /** Machine / domain hostname */
    hostname: "github",
    /** Virtual home directory path based on GitHub username */
    homePath: "~",
  },

  sections: {
    projects: {
      number: "01",
      badge: "Work",
      title: "Featured Projects",
      description:
        "High-performance systems programming, developer tooling, and clean architecture applications.",
    },
    skills: {
      number: "02",
      badge: "Stack",
      title: "Technical Stack",
      description:
        "Systems programming, full-stack architectures, build pipelines, and DevOps automation.",
    },
    leetcode: {
      number: "03",
      badge: "Algorithms",
      title: "Problem Solving",
      description:
        "LeetCode Guardian (2382 rating, top 0.36% globally) with 720+ algorithmic challenges solved.",
    },
    contributions: {
      number: "04",
      badge: "Activity",
      title: "GitHub Contributions",
      description:
        "Continuous commits, open-source repositories, and code collaboration across GitHub.",
    },
  },

  statusCards: {
    architectureFocus: {
      title: "Systems & CAS Tools",
      subtitle: "Clean Architecture",
    },
    coreLanguagesFallback: "C++, TypeScript",
  },

  skills: [
    {
      title: "Languages",
      skills: [
        { name: "C++20", featured: true },
        { name: "Rust", featured: true },
        { name: "TypeScript", featured: true },
        { name: "JavaScript", featured: false },
        { name: "C", featured: false },
      ],
    },
    {
      title: "Systems & Tooling",
      skills: [
        { name: "CMake", featured: true },
        { name: "Content-Addressable Storage (CAS)", featured: true },
        { name: "Git Internals", featured: true },
        { name: "OpenSSL / SHA-256", featured: false },
        { name: "Linux / POSIX", featured: true },
        { name: "Windows API", featured: false },
      ],
    },
    {
      title: "Frontend & Apps",
      skills: [
        { name: "React", featured: true },
        { name: "Next.js", featured: true },
        { name: "Tailwind CSS", featured: true },
        { name: "Electron", featured: true },
        { name: "Node.js", featured: true },
      ],
    },
    {
      title: "DevOps & Build",
      skills: [
        { name: "GitHub Actions", featured: true },
        { name: "Git & GitHub", featured: true },
        { name: "Docker", featured: false },
        { name: "pnpm", featured: false },
        { name: "GCC / Clang / MSVC", featured: false },
      ],
    },
    {
      title: "CS & Algorithms",
      skills: [
        { name: "Data Structures & Algorithms", featured: true },
        { name: "Dynamic Programming", featured: true },
        { name: "Graph Algorithms (DAG)", featured: true },
        { name: "System Design", featured: false },
      ],
    },
  ],

  featuredProjects: [
    {
      repoName: "minigit",
      title: "MiniGit",
      description:
        "Git-compatible version control system implemented from first principles in modern C++20. Features SHA-256 content-addressable storage, two-phase staging index, dynamic programming diff calculation, and branch management.",
      techStack: ["C++", "C++20"],
      githubUrl: "https://github.com/sagarkrjha/minigit",
      featured: true,
      stars: 13,
      forks: 0,
    },
    {
      repoName: "codeshelf",
      title: "CodeShelf",
      description:
        "Developer-focused snippet knowledge system across desktop, VS Code, and web. Built with TypeScript, React 19, Electron, and a pnpm monorepo architecture with semantic search and Web Streams compression.",
      techStack: ["TypeScript", "React", "Electron"],
      githubUrl: "https://github.com/sagarkrjha/codeshelf",
      featured: true,
      stars: 0,
      forks: 0,
    },
    {
      repoName: "level-db-cpp",
      title: "LevelDB C++20",
      description:
        "A fast, lightweight C++20 LSM-tree storage engine inspired by Google's LevelDB with write-ahead logging (WAL), SSTables, and memtable architecture.",
      techStack: ["C++", "C++20"],
      githubUrl: "https://github.com/sagarkrjha/level-db-cpp",
      featured: true,
      stars: 1,
      forks: 0,
    },
    {
      repoName: "cp-workspace",
      title: "CP Workspace",
      description:
        "Lightweight, cross-platform competitive programming setup for C++ in VS Code with auto-compiler detection and fast I/O.",
      techStack: ["C++"],
      githubUrl: "https://github.com/sagarkrjha/cp-workspace",
      featured: false,
      stars: 2,
      forks: 0,
    },
    {
      repoName: "portfolio-web",
      title: "Portfolio Website",
      description:
        "Modern developer portfolio featuring automated GitHub sync, LeetCode metrics integration, interactive modal terminal, and an MDX engineering blog.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
      githubUrl: "https://github.com/sagarkrjha/portfolio-web",
      liveUrl: "https://sagarkrjha.vercel.app",
      featured: false,
      stars: 0,
      forks: 0,
    },
    {
      repoName: "next-mdx-starter",
      title: "Next.js MDX Starter",
      description:
        "A modern, reusable starter template built with Next.js (App Router), Tailwind CSS v4, Biome, shadcn/ui, Radix UI, next-themes, and Hugeicons.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
      githubUrl: "https://github.com/sagarkrjha/next-mdx-starter",
      featured: false,
      stars: 0,
      forks: 0,
    },
    {
      repoName: "sagarkrjha",
      title: "Automated GitHub Profile System",
      description:
        "Automated resume-styled developer profile README generated dynamically via GitHub Actions, Rust, and pure Markdown.",
      techStack: ["Rust"],
      githubUrl: "https://github.com/sagarkrjha/sagarkrjha",
      featured: false,
      stars: 0,
      forks: 0,
    },
  ],

  hobbies: [
    {
      title: "Low-Level Systems",
      description:
        "Exploring memory management, cache-conscious data structures, and POSIX system calls.",
    },
    {
      title: "Competitive Programming",
      description:
        "LeetCode Guardian (2382 rating) with 715+ algorithmic problems solved across data structures.",
    },
    {
      title: "Developer Infrastructure",
      description:
        "Building cross-platform CI/CD automation, reproducible builds, and developer tooling.",
    },
  ],

  experience: [
    {
      period: "2024 — Present",
      role: "Systems & Open Source Engineer",
      company: "Independent Software & Systems Development",
      location: "Delhi, India",
      description: [
        "Architecting distributed version control internals, storage engines, and developer infrastructure across modern C++20, Rust, and TypeScript.",
        "MiniGit (C++20, 13+ stars, v1.12.0): Implemented Git-compatible storage engine using SHA-256 CAS, packfiles, Smart HTTP wire protocol, and Eugene Myers O(ND) diff with LCA 3-way merge reaching 1.29M+ ops/sec.",
        "Selected as a verified contributor for the XERJ Corpus Hub (open reference memory for AI coding agents) for MiniGit's systems architecture.",
        "LevelDB C++20 Storage Engine: Built high-concurrency LSM-tree engine with chunked Write-Ahead Log (WAL), lock-free SkipList MemTable with custom Arena allocators, Bloom filters, and multi-level compaction.",
        "CodeShelf (TypeScript, React 19, Electron, v0.3.6): Engineered cross-platform local-first developer knowledge system with pnpm monorepo, technology taxonomy normalization, and visual Myers diff history.",
        "High-Throughput Tooling: Authored native Rust CLI sync engines with Tokio and multi-threaded GitHub API telemetry monitoring.",
      ],
      technologies: [
        "C++20",
        "Rust",
        "TypeScript",
        "React 19",
        "Next.js 16",
        "Electron",
        "CMake",
        "Docker",
        "GitHub Actions",
        "POSIX / Linux",
      ],
    },
  ],
};
