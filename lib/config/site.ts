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
    { label: "Resume", href: "/sagar-resume.pdf", external: true, download: "sagar-resume.pdf" },
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
    repositoryCount: 5,
    pinnedRepos: ["minigit", "codeshelf"],
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
      badge: "Featured Work",
      title: "Featured Engineering Projects",
      description:
        "First-principles systems programming, developer tooling, and highlighted projects built with high performance and clean architecture.",
    },
    skills: {
      number: "02",
      badge: "Core Competencies",
      title: "Technical Stack & Architecture",
      description:
        "Systems programming, frontend and desktop architectures, build pipelines, and DevOps automation tooling.",
    },
    leetcode: {
      number: "03",
      badge: "LeetCode Stats",
      title: "Competitive Programming & Problem Solving",
      description:
        "Live metrics, LeetCode Guardian rank (2382 contest rating, top 0.36% globally), and algorithmic mastery across data structures.",
    },
    contributions: {
      number: "04",
      badge: "Open Source Activity",
      title: "GitHub Contributions & Activity",
      description:
        "Consistent daily contributions, open-source commits, and active project development across GitHub.",
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
        { name: "C", featured: false },
        { name: "TypeScript", featured: true },
        { name: "JavaScript", featured: true },
      ],
    },
    {
      title: "Systems & Core Tooling",
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
      title: "Frontend & Applications",
      skills: [
        { name: "React", featured: true },
        { name: "Next.js", featured: true },
        { name: "Tailwind CSS", featured: true },
        { name: "Electron", featured: true },
        { name: "Node.js", featured: true },
      ],
    },
    {
      title: "DevOps & Build Infrastructure",
      skills: [
        { name: "GitHub Actions", featured: true },
        { name: "Git & GitHub", featured: true },
        { name: "Docker", featured: false },
        { name: "pnpm", featured: false },
        { name: "GCC / Clang / MSVC", featured: false },
      ],
    },
    {
      title: "Core CS & Algorithms",
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
      stars: 14,
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
      stars: 1,
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
        "Automated developer profile powered by GitHub Actions, showcasing projects, engineering interests, GitHub activity, and LeetCode metrics.",
      techStack: ["JavaScript"],
      githubUrl: "https://github.com/sagarkrjha/sagarkrjha",
      featured: false,
      stars: 0,
      forks: 0,
    },
  ],

  hobbies: [
    {
      title: "Low-Level Systems",
      description: "Exploring memory management, cache-conscious data structures, and POSIX system calls.",
    },
    {
      title: "Competitive Programming",
      description: "LeetCode Guardian (2382 rating) with 715+ algorithmic problems solved across data structures.",
    },
    {
      title: "Developer Infrastructure",
      description: "Building cross-platform CI/CD automation, reproducible builds, and developer tooling.",
    },
  ],

  experience: [
    {
      period: "2024 — Present",
      role: "Software Developer",
      company: "Independent / Open Source",
      location: "Delhi, India",
      description: [
        "Architecting systems programming tools and developer infrastructure in modern C++20 and TypeScript.",
        "Implemented MiniGit, a Git-compatible version control system with content-addressable storage and DP diff.",
        "Engineered CodeShelf, a desktop and web snippet knowledge system with pnpm monorepo and Web Streams.",
      ],
      technologies: ["C++20", "TypeScript", "React", "Next.js", "Electron", "CMake", "GitHub Actions"],
    },
  ],
};
