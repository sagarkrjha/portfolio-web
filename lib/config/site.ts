import type { SiteConfig } from "@/lib/types";

export const siteConfig: SiteConfig = {
  title: "Sagar Kumar Jha | Software Engineer",
  name: "Sagar Kumar Jha",
  role: "Systems & Full-Stack Engineer",
  bio: "Architecting high-throughput storage engines, version control internals, and developer tools across modern C++20, Rust, and TypeScript.",
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
    unixUser: "sagarkrjha",
    hostname: "github",
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
        { name: "C", featured: true },
        { name: "Go", featured: false },
        { name: "Python", featured: false },
        { name: "SQL", featured: false },
      ],
    },
    {
      title: "Systems & Architecture",
      skills: [
        { name: "LSM-Trees & WAL", featured: true },
        { name: "CAS (Content-Addressable Storage)", featured: true },
        { name: "SSTables & Bloom Filters", featured: true },
        { name: "Myers Diff Algorithm", featured: true },
        { name: "Linux / POSIX APIs", featured: true },
        { name: "Git Wire Protocol", featured: false },
      ],
    },
    {
      title: "Full-Stack & Apps",
      skills: [
        { name: "React 19", featured: true },
        { name: "Next.js", featured: true },
        { name: "Tailwind CSS", featured: true },
        { name: "Node.js", featured: true },
        { name: "Electron", featured: true },
        { name: "PostgreSQL", featured: false },
      ],
    },
    {
      title: "DevOps & Infrastructure",
      skills: [
        { name: "CMake", featured: true },
        { name: "Docker", featured: true },
        { name: "GitHub Actions CI/CD", featured: true },
        { name: "pnpm Workspaces", featured: false },
        { name: "GCC / Clang / MSVC", featured: false },
      ],
    },
  ],

  featuredProjects: [
    {
      repoName: "minigit",
      title: "MiniGit",
      description:
        "Git-compatible version control system in C++20 with SHA-256 CAS, Myers diff, and Smart HTTP packfile networking.",
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
        "Local-first developer snippet knowledge system across web, desktop, and VS Code with weighted lexical search.",
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
        "Fast C++20 LSM-tree storage engine with chunked WAL, SkipList memtable, Bloom filters, and leveled compaction.",
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
        "Cross-platform competitive programming setup for C++ in VS Code with automated compiler detection and fast I/O.",
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
        "Config-driven engineering portfolio built with Next.js 16, React 19, Tailwind CSS, and automated GitHub CI telemetry.",
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
        "Modular developer blog and documentation starter with Next.js App Router, Tailwind CSS, Biome, and next-themes.",
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
        "Automated developer profile README engine dynamically compiled via GitHub Actions, native Rust, and Markdown.",
      techStack: ["Rust"],
      githubUrl: "https://github.com/sagarkrjha/sagarkrjha",
      featured: false,
      stars: 0,
      forks: 0,
    },
  ],

  hobbies: [
    {
      title: "Systems Programming",
      description:
        "Designing custom memory allocators, cache-conscious data layouts, and high-throughput POSIX system calls.",
    },
    {
      title: "Competitive Programming",
      description:
        "LeetCode Guardian (2382 rating, top 0.36% globally) with 720+ algorithmic challenges solved.",
    },
    {
      title: "Developer Infrastructure",
      description:
        "Building cross-platform CI/CD automation matrix pipelines, CMake toolchains, and developer tooling.",
    },
  ],

  experience: [
    {
      period: "2024 — Present",
      role: "Systems & Open Source Engineer",
      company: "Independent Software & Systems Development",
      location: "Delhi, India",
      description: [
        "Architecting distributed version control internals, storage engines, and developer tooling across modern C++20, Rust, and TypeScript.",
        "MiniGit (C++20, v1.12.0): Built Git-compatible storage engine using SHA-256 CAS, packfiles, Smart HTTP wire protocol, and Myers diff with LCA 3-way merge reaching 1.29M+ ops/sec.",
        "LevelDB C++20: Implemented high-concurrency LSM-tree engine with chunked Write-Ahead Log (WAL), lock-free SkipList MemTable, Bloom filters, and multi-level compaction.",
        "CodeShelf (v0.3.6): Engineered cross-platform local-first knowledge manager across web, desktop (Electron), and VS Code in a shared TypeScript monorepo.",
      ],
      technologies: [
        "C++20",
        "Rust",
        "TypeScript",
        "React 19",
        "Next.js",
        "Electron",
        "CMake",
        "Docker",
        "GitHub Actions",
        "Linux",
      ],
    },
  ],
};
