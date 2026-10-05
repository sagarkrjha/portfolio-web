import { siteConfig } from "@/lib/config";
import cachedData from "@/lib/generated/portfolio-data.json";

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
  updated_at: string;
}

export interface MergedProject {
  id: string;
  name: string;
  title: string;
  description: string;
  githubUrl: string;
  liveUrl?: string;
  stars: number;
  forks: number;
  techStack: string[];
  featured: boolean;
  updatedAt?: string;
}

// ─── Tech Badge Normalizer ────────────────────────────────────────────────────
// Only languages and frameworks are shown as badges on project cards.
// Topics like "algorithms", "cmake", "automation" are stripped out.

const ALLOWED_TECH = new Set([
  // Languages
  "typescript", "javascript", "c++", "c++20", "c", "python",
  "rust", "go", "java", "html", "css", "bash", "shell", "ruby", "kotlin", "swift",
  // Frameworks & key libraries
  "next.js", "nextjs", "react", "node.js", "nodejs", "express",
  "tailwind css", "tailwindcss", "mdx", "vue", "nuxt", "svelte",
  "fastapi", "django", "flask", "spring", "angular", "electron",
]);

const DISPLAY_NAME: Record<string, string> = {
  "typescript": "TypeScript",
  "javascript": "JavaScript",
  "c++": "C++",
  "c++20": "C++20",
  "cpp": "C++",
  "cpp20": "C++20",
  "c": "C",
  "python": "Python",
  "rust": "Rust",
  "go": "Go",
  "java": "Java",
  "html": "HTML",
  "css": "CSS",
  "bash": "Bash",
  "shell": "Shell",
  "ruby": "Ruby",
  "kotlin": "Kotlin",
  "swift": "Swift",
  "next.js": "Next.js",
  "nextjs": "Next.js",
  "react": "React",
  "node.js": "Node.js",
  "nodejs": "Node.js",
  "express": "Express",
  "tailwind css": "Tailwind CSS",
  "tailwindcss": "Tailwind CSS",
  "mdx": "MDX",
  "vue": "Vue",
  "nuxt": "Nuxt",
  "svelte": "Svelte",
  "fastapi": "FastAPI",
  "django": "Django",
  "flask": "Flask",
  "spring": "Spring",
  "angular": "Angular",
  "electron": "Electron",
};

/** Returns the display name for a tech if it's a language/framework, or null to skip it. */
function normalizeTechBadge(raw: string): string | null {
  const key = raw.trim().toLowerCase();
  if (!ALLOWED_TECH.has(key)) return null;
  return DISPLAY_NAME[key] ?? raw.trim();
}

// ─── Fallback repositories (used when GitHub API is rate-limited) ─────────────
const REAL_REPOS: GitHubRepo[] = siteConfig.featuredProjects.map((p) => ({
  name: p.repoName,
  description: p.description,
  html_url: p.githubUrl,
  homepage: p.liveUrl || null,
  stargazers_count: p.stars || 0,
  forks_count: p.forks || 0,
  language: p.techStack[0] || null,
  topics: p.techStack.map((t) => t.toLowerCase().replace(/[^a-z0-9-]/g, "-")),
  fork: false,
  updated_at: new Date().toISOString(),
}));

// ─── GitHub API Fetchers ──────────────────────────────────────────────────────

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
      {
        next: { revalidate: 3600 },
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "portfolio-web-app",
        },
        signal: AbortSignal.timeout(6000),
      }
    );

    if (res.ok) {
      const repos: GitHubRepo[] = await res.json();
      if (Array.isArray(repos) && repos.length > 0) {
        return repos;
      }
    }
  } catch (error) {
    console.warn("GitHub API error, using verified repository cache:", error);
  }

  return (cachedData.github.repos as unknown as GitHubRepo[]) || REAL_REPOS;
}

// Fetch GitHub pinned repositories dynamically from the user's GitHub profile HTML
export async function fetchGitHubPinnedRepos(username: string): Promise<string[]> {
  try {
    const res = await fetch(`https://github.com/${username}`, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const html = await res.text();
      // Matches GitHub profile pinned repositories
      const matches = [...html.matchAll(/PINNED_REPO[\s\S]*?href=["']\/[^/]+\/([^"'/]+)["']/g)].map(
        (m) => m[1]
      );
      if (matches.length > 0) {
        return matches;
      }
    }
  } catch (error) {
    console.warn("Could not scrape pinned repositories dynamically, using cached/config:", error);
  }

  return cachedData.github.pinnedRepos || siteConfig.github.pinnedRepos || ["minigit"];
}

// ─── Main project aggregator ──────────────────────────────────────────────────

export async function getPortfolioProjects(): Promise<MergedProject[]> {
  const username = siteConfig.github.username;
  const [repos, dynamicPinned] = await Promise.all([
    fetchGitHubRepos(username),
    fetchGitHubPinnedRepos(username),
  ]);

  const pinnedSet = new Set(dynamicPinned.map((name) => name.toLowerCase()));

  // Map of optional local configuration to enhance repository information
  const configuredMap = new Map(
    siteConfig.featuredProjects.map((proj) => [proj.repoName.toLowerCase(), proj])
  );

  const mergedProjects: MergedProject[] = [];

  // Pre-computed badge map from sync script (workflow-generated, authoritative)
  const cachedBadgeMap = new Map<string, string[]>(
    (cachedData.github as { repoBadges?: { name: string; techStack: string[] }[] })
      .repoBadges?.map((b) => [b.name.toLowerCase(), b.techStack]) ?? []
  );

  for (const repo of repos) {
    if (!siteConfig.github.includeForks && repo.fork) {
      continue;
    }

    const lowerName = repo.name.toLowerCase();
    const configured = configuredMap.get(lowerName);

    // Priority: 1) siteConfig curated stack, 2) pre-computed sync cache, 3) runtime normalizer
    let techStack: string[];

    if (configured?.techStack?.length) {
      // Config is always authoritative — filter it through the normalizer
      const raw: string[] = [];
      for (const t of configured.techStack) {
        const display = normalizeTechBadge(t);
        if (display && !raw.includes(display)) raw.push(display);
      }
      techStack = raw;
    } else if (cachedBadgeMap.has(lowerName)) {
      // Use pre-computed badges from the last workflow sync
      techStack = cachedBadgeMap.get(lowerName)!;
    } else {
      // Runtime fallback — only primary language, no topics
      const rawTech = repo.language ? [repo.language] : [];
      techStack = [];
      for (const t of rawTech) {
        const display = normalizeTechBadge(t);
        if (display && !techStack.includes(display)) techStack.push(display);
      }
    }

    // Last resort: if still empty, show the raw primary language
    if (techStack.length === 0 && repo.language) {
      techStack = [normalizeTechBadge(repo.language) ?? repo.language];
    }

    // A project is featured ONLY if it is in the user's pinned repositories
    const isPinned = pinnedSet.has(lowerName);

    mergedProjects.push({
      id: repo.name,
      name: repo.name,
      title: configured?.title || repo.name,
      description: configured?.description || repo.description || "No description provided.",
      githubUrl: configured?.githubUrl || repo.html_url,
      liveUrl: configured?.liveUrl || repo.homepage || undefined,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      techStack,
      featured: isPinned,
      updatedAt: repo.updated_at,
    });
  }

  // Sort: pinned first, then by stars
  return mergedProjects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.stars - a.stars;
  });
}

// ─── Profile derivation ───────────────────────────────────────────────────────

export interface DynamicProfileMetrics {
  role: string;
  bio: string;
  totalRepos: number;
  totalStars: number;
  primaryLanguages: string[];
  activeProjectsCount: number;
}

export function deriveProfileFromProjects(projects: MergedProject[]): DynamicProfileMetrics {
  const languageCounts = new Map<string, number>();
  let totalStars = 0;

  // techStack is already filtered to languages/frameworks — just tally them
  for (const project of projects) {
    totalStars += project.stars;
    for (const tech of project.techStack) {
      languageCounts.set(tech, (languageCounts.get(tech) ?? 0) + 1);
    }
  }

  // Sort technologies by prevalence across repositories
  const sortedTech = Array.from(languageCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tech]) => tech);

  const topTech = sortedTech.slice(0, 4);

  // Derive specialized role based on project tech stack
  const hasSystems = sortedTech.some((t) =>
    ["c++", "c++20", "rust", "go", "c"].includes(t.toLowerCase())
  );
  const hasWeb = sortedTech.some((t) =>
    ["typescript", "javascript", "react", "next.js", "tailwind css", "node.js"].includes(t.toLowerCase())
  );

  let derivedRole = siteConfig.role;
  if (hasSystems && hasWeb) {
    derivedRole = "Systems & Full-Stack Developer";
  } else if (hasSystems) {
    derivedRole = "Systems Software Engineer";
  } else if (hasWeb) {
    derivedRole = "Full-Stack Software Engineer";
  }

  // Derive bio dynamically
  const pinned = projects.filter((p) => p.featured);
  const primaryProject = pinned.length > 0 ? pinned[0] : projects[0];

  const techSummary = topTech.length > 0 ? topTech.join(", ") : "Modern Web & Systems Technologies";
  const projectMention = primaryProject
    ? ` Architect of ${primaryProject.title} (${primaryProject.description}).`
    : "";

  const derivedBio = `Engineer specializing in ${techSummary}.${projectMention} Passionate about building high-performance, clean-architecture software and developer tools.`;

  return {
    role: derivedRole,
    bio: derivedBio,
    totalRepos: projects.length,
    totalStars,
    primaryLanguages: topTech,
    activeProjectsCount: pinned.length || projects.length,
  };
}
