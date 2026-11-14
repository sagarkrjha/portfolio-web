export interface BlogPostConfig {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
}

export const blogConfig: { posts: BlogPostConfig[] } = {
  posts: [
    {
      slug: "dsa-sheet-2027",
      title: "Data Structures & Algorithmic Patterns",
      subtitle: "A Systematic Framework for Problem-Solving and Technical Interviews",
      description:
        "A structured practice roadmap and algorithmic protocol covering monotonic stacks, dynamic programming, graph traversal, and time-space invariants.",
      date: "2026-10-20",
      readTime: "12 min read",
      tags: ["DSA", "Competitive Programming", "Algorithms", "Systems", "C++"],
    },
    {
      slug: "anatomy-of-a-file-system-race-condition",
      title: "Filesystem Race Conditions in Concurrency",
      subtitle: "Mechanics of Torn Reads, Kernel Truncation, and Zero-Downtime Atomic Swaps",
      description:
        "Operating system mechanics behind torn file reads under concurrency, kernel O_TRUNC behavior, and implementing a reliable atomic sibling swap pattern.",
      date: "2026-10-16",
      readTime: "9 min read",
      tags: ["Systems", "Architecture", "Concurrency", "FileSystem", "OS"],
    },
    {
      slug: "myers-diff-algorithm",
      title: "The Myers Diff Algorithm",
      subtitle: "Graph Traversal and Edit Script Optimization in Modern Version Control",
      description:
        "A deep dive into Eugene W. Myers' 1986 difference algorithm: edit graphs, diagonal progression, bidirectional divide-and-conquer, and production diff optimizations.",
      date: "2026-10-15",
      readTime: "8 min read",
      tags: ["Algorithms", "Git", "Systems", "DataStructures"],
    },
    {
      slug: "building-a-config-driven-portfolio",
      title: "Config-Driven Web Architecture",
      subtitle: "Decoupling Presentation from State via Type-Safe Declarative Schemas",
      description:
        "How centralizing configuration and data streams transforms portfolio maintainability and performance.",
      date: "2026-03-15",
      readTime: "4 min read",
      tags: ["Architecture", "SystemDesign", "SoftwareEngineering"],
    },
    {
      slug: "understanding-algorithms-in-practice",
      title: "Space-Time Complexity in Practice",
      subtitle: "Bridging Asymptotic Big-O Analysis with Hardware Latency and Cache Lines",
      description:
        "Why asymptotic analysis matters for real-world software engineering and practical heuristics for optimization.",
      date: "2026-02-20",
      readTime: "6 min read",
      tags: ["Algorithms", "Performance", "Computer Science", "Systems"],
    },
  ],
};
