import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "../lib/config/site";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface GitHubRepo {
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

interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalQuestions: number;
}

interface DynamicProfileMetrics {
  role: string;
  bio: string;
  totalRepos: number;
  totalStars: number;
  primaryLanguages: string[];
  activeProjectsCount: number;
}

/** Computed badge data per repo — only languages + frameworks, no topics noise */
interface RepoBadge {
  name: string;
  techStack: string[];
}

interface GeneratedPortfolioData {
  lastUpdated: string;
  profile: DynamicProfileMetrics;
  github: {
    username: string;
    pinnedRepos: string[];
    repos: GitHubRepo[];
    /** Pre-computed per-repo badge data (language + framework only, no topics noise) */
    repoBadges: RepoBadge[];
  };
  leetcode: LeetCodeStats;
}

// ─── Tech Badge Normalizer ────────────────────────────────────────────────────
// Mirrors the same whitelist used in lib/services/github.ts
// This ensures the sync script and the runtime code stay in sync.

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

function normalizeTechBadge(raw: string): string | null {
  const key = raw.trim().toLowerCase();
  if (!ALLOWED_TECH.has(key)) return null;
  return DISPLAY_NAME[key] ?? raw.trim();
}

/** Derive per-repo badge techStack using the same priority as the runtime service:
 *  1. If the repo is in siteConfig.featuredProjects, use its curated techStack.
 *  2. Otherwise, use only repo.language (no topics — topics contain noise).
 */
function computeRepoBadges(
  repos: GitHubRepo[],
  configuredMap: Map<string, { techStack: string[] }>
): RepoBadge[] {
  return repos
    .filter((r) => !r.fork)
    .map((repo) => {
      const lowerName = repo.name.toLowerCase();
      const configured = configuredMap.get(lowerName);

      const rawTech: string[] = configured?.techStack?.length
        ? [...configured.techStack]
        : repo.language
        ? [repo.language]
        : [];

      const techStack: string[] = [];
      for (const t of rawTech) {
        const display = normalizeTechBadge(t);
        if (display && !techStack.includes(display)) {
          techStack.push(display);
        }
      }

      // Fallback to raw language if nothing passed the whitelist
      if (techStack.length === 0 && repo.language) {
        techStack.push(normalizeTechBadge(repo.language) ?? repo.language);
      }

      return { name: repo.name, techStack };
    });
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GITHUB_USERNAME = siteConfig.github.username;
const LEETCODE_USERNAME = siteConfig.leetcode.username;

// ─── GitHub Fetcher ───────────────────────────────────────────────────────────

async function fetchRealGitHubData() {
  console.log(`[GitHub] Fetching public repositories for ${GITHUB_USERNAME}...`);
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "portfolio-updater-script",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  let repos: GitHubRepo[] = [];
  try {
    let res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      { headers }
    );
    if (!res.ok && headers.Authorization) {
      console.warn(`[GitHub] API returned ${res.status} with token, retrying unauthenticated...`);
      res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "portfolio-updater-script",
          },
        }
      );
    }
    if (res.ok) {
      repos = await res.json();
      console.log(`[GitHub] Fetched ${repos.length} repositories.`);
    } else {
      console.warn(`[GitHub] API returned status ${res.status}`);
    }
  } catch (err) {
    console.warn(`[GitHub] Failed to fetch repos:`, err);
  }

  // Fetch pinned repos from profile HTML
  let pinnedRepos: string[] = siteConfig.github.pinnedRepos || ["minigit"];
  try {
    const profileRes = await fetch(`https://github.com/${GITHUB_USERNAME}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });
    if (profileRes.ok) {
      const html = await profileRes.text();
      const matches = [...html.matchAll(/PINNED_REPO[\s\S]*?href=["']\/[^/]+\/([^"'/]+)["']/g)].map(
        (m) => m[1]
      );
      if (matches.length > 0) {
        pinnedRepos = matches;
        console.log(`[GitHub] Detected ${matches.length} pinned repos: ${matches.join(", ")}`);
      }
    }
  } catch (err) {
    console.warn(`[GitHub] Scrape pinned repos warning:`, err);
  }

  return { repos, pinnedRepos };
}

// ─── LeetCode Fetcher ─────────────────────────────────────────────────────────

async function fetchRealLeetCodeData(): Promise<LeetCodeStats> {
  console.log(`[LeetCode] Fetching stats for ${LEETCODE_USERNAME}...`);

  // Defaults — overwritten if API call succeeds
  const fallback: LeetCodeStats = {
    username: LEETCODE_USERNAME,
    totalSolved: 710,
    easySolved: 204,
    mediumSolved: 358,
    hardSolved: 148,
    totalQuestions: 4069,
  };

  try {
    const res = await fetch(
      `https://alfa-leetcode-api.onrender.com/userProfile/${LEETCODE_USERNAME}`,
      {
        headers: { "User-Agent": "portfolio-updater-script" },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.totalSolved !== undefined) {
        const stats: LeetCodeStats = {
          username: LEETCODE_USERNAME,
          totalSolved: data.totalSolved ?? fallback.totalSolved,
          easySolved: data.easySolved ?? fallback.easySolved,
          mediumSolved: data.mediumSolved ?? fallback.mediumSolved,
          hardSolved: data.hardSolved ?? fallback.hardSolved,
          totalQuestions: data.totalQuestions ?? fallback.totalQuestions,
        };
        console.log(`[LeetCode] Fetched: ${stats.totalSolved} solved (E:${stats.easySolved} M:${stats.mediumSolved} H:${stats.hardSolved})`);
        return stats;
      }
    }
  } catch (err) {
    console.warn(`[LeetCode] Failed to fetch live stats, using fallback:`, err);
  }

  console.log(`[LeetCode] Using fallback data: ${fallback.totalSolved} solved`);
  return fallback;
}

// ─── Profile Derivation ───────────────────────────────────────────────────────

function deriveProfile(
  repos: GitHubRepo[],
  pinnedRepos: string[],
  totalStars: number,
  primaryLanguages: string[]
): DynamicProfileMetrics {
  const hasSystems = primaryLanguages.some((t) =>
    ["c++", "c++20", "rust", "go", "c"].includes(t.toLowerCase())
  );
  const hasWeb = primaryLanguages.some((t) =>
    ["typescript", "javascript", "react", "next.js", "tailwind css", "node.js"].includes(t.toLowerCase())
  );

  let derivedRole = siteConfig.role ?? "Software Developer";
  if (hasSystems && hasWeb) {
    derivedRole = "Systems & Full-Stack Developer";
  } else if (hasSystems) {
    derivedRole = "Systems Software Engineer";
  } else if (hasWeb) {
    derivedRole = "Full-Stack Software Engineer";
  }

  const primaryPinned =
    repos.find((r) => pinnedRepos.some((p) => p.toLowerCase() === r.name.toLowerCase())) ||
    repos[0];

  const techSummary =
    primaryLanguages.length > 0 ? primaryLanguages.join(", ") : "Modern Web & Systems";
  const projectMention = primaryPinned
    ? ` Architect of ${primaryPinned.name} (${primaryPinned.description || "Open-source project"}).`
    : "";

  const derivedBio = `Engineer specializing in ${techSummary}.${projectMention} Passionate about building high-performance, clean-architecture software and developer tools.`;

  return {
    role: derivedRole,
    bio: derivedBio,
    totalRepos: repos.filter((r) => !r.fork).length,
    totalStars,
    primaryLanguages,
    activeProjectsCount: pinnedRepos.length || repos.length,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Starting Portfolio Data Sync ===");

  const { repos, pinnedRepos } = await fetchRealGitHubData();
  const leetCodeStats = await fetchRealLeetCodeData();

  const generatedDir = path.join(process.cwd(), "lib", "generated");
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }
  const generatedFilePath = path.join(generatedDir, "portfolio-data.json");

  // Preserve existing data if APIs returned nothing useful
  let existingData: Partial<GeneratedPortfolioData> = {};
  if (fs.existsSync(generatedFilePath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(generatedFilePath, "utf-8"));
    } catch { /* ignore */ }
  }

  const finalRepos = repos.length > 0 ? repos : (existingData.github?.repos ?? []);
  const finalPinned =
    pinnedRepos.length > 0
      ? pinnedRepos
      : (existingData.github?.pinnedRepos ?? siteConfig.github.pinnedRepos ?? ["minigit"]);

  // ── Compute primaryLanguages from repo.language only (not topics) ──────────
  const languageCounts = new Map<string, number>();
  let totalStars = 0;

  for (const repo of finalRepos) {
    if (repo.fork) continue;
    totalStars += repo.stargazers_count;
    if (repo.language) {
      const display = normalizeTechBadge(repo.language) ?? repo.language;
      languageCounts.set(display, (languageCounts.get(display) ?? 0) + 1);
    }
  }

  const primaryLanguages = Array.from(languageCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang)
    .slice(0, 4);

  // ── Compute per-repo badge techStack ──────────────────────────────────────
  const configuredMap = new Map(
    siteConfig.featuredProjects.map((p) => [p.repoName.toLowerCase(), p])
  );
  const repoBadges = computeRepoBadges(finalRepos, configuredMap);

  // ── Derive dynamic profile ─────────────────────────────────────────────────
  const profile = deriveProfile(finalRepos, finalPinned, totalStars, primaryLanguages);

  const payload: GeneratedPortfolioData = {
    lastUpdated: new Date().toISOString(),
    profile,
    github: {
      username: GITHUB_USERNAME,
      pinnedRepos: finalPinned,
      repos: finalRepos,
      repoBadges,
    },
    leetcode: leetCodeStats,
  };

  fs.writeFileSync(generatedFilePath, JSON.stringify(payload, null, 2), "utf-8");

  console.log(`\n✓ portfolio-data.json updated at ${payload.lastUpdated}`);
  console.log(`  Role:       ${profile.role}`);
  console.log(`  Languages:  ${primaryLanguages.join(", ")}`);
  console.log(`  Repos:      ${finalRepos.length} (${finalRepos.filter((r) => !r.fork).length} non-fork)`);
  console.log(`  Stars:      ${totalStars}`);
  console.log(`  Pinned:     ${finalPinned.join(", ")}`);
  console.log(`  LeetCode:   ${leetCodeStats.totalSolved} solved (E:${leetCodeStats.easySolved} M:${leetCodeStats.mediumSolved} H:${leetCodeStats.hardSolved})`);
  console.log(`  Badges:`);
  for (const b of repoBadges) {
    console.log(`    ${b.name}: [${b.techStack.join(", ")}]`);
  }
}

main().catch((err) => {
  console.error("Fatal error during sync:", err);
  process.exit(1);
});
