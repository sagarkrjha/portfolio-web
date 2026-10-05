# Modern Config-Driven Developer Portfolio

A sleek, high-performance, and fully config-driven developer portfolio built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **TypeScript**, **shadcn/ui**, **Radix UI**, **next-themes**, and **MDX**.

Designed with **separation of concerns** in mind: **99% of your portfolio is configured via centralized TypeScript configuration files**. You do not need to dig through component trees or write boilerplate UI code to make it entirely your own.

---

## Features

- **100% Config-Driven**: Update your bio, skills, socials, projects, terminal, and about narrative in `lib/config/` without touching layout code.
- **Automated GitHub & LeetCode Sync**: A custom TypeScript script (`pnpm run sync:data`) pulls public GitHub repositories, stars, forks, and live LeetCode stats into an offline-first cache (`lib/generated/portfolio-data.json`).
- **Automated Daily GitHub Actions**: An automated CI workflow (`.github/workflows/build.yml`) runs nightly at 00:00 UTC to sync metrics, verify resume assets, build, upload resume artifacts, and commit updated data back to your repo.
- **Resume Download & Preview**: Direct resume download via header, hero CTA, terminal (`resume`, `cat sagar-resume.pdf`), and automated build workflow artifacts.
- **Bulletproof Fallbacks & ISR**: Combines Next.js Incremental Static Regeneration (ISR) with offline verified JSON fallbacks so your site never breaks, even if third-party APIs are rate-limited or offline.
- **Interactive Modal Terminal**: Emulates a Unix CLI with 20+ functional commands (`neofetch`, `skills`, `projects`, `leetcode`, `github`, `whoami`, `resume`, `foxy`, `cat`, etc.) dynamically bound to config data.
- **Floating Mascot (Foxy)**: An animated companion with speech bubbles, interactive toggles, and terminal integration.
- **GitHub Contributions Heatmap**: Real-time GitHub activity calendar with dark/light mode support.
- **MDX Tech Blog**: Built-in blogging engine with metadata frontmatter, tag filters, and Prism syntax highlighting.
- **Dark & Light Modes**: System-aware theme toggling with smooth transitions via `next-themes`.
- **Modern Tech Stack**: Built with Next.js 16 (Turbopack ready), React 19, Tailwind CSS v4, and Biome.

---

## Project Structure

```text
├── .github/
│   └── workflows/
│       └── build.yml               # Automated nightly sync, build & resume artifact workflow
├── app/                            # Next.js 16 App Router pages & layouts
│   ├── about/                      # About page route
│   ├── blog/                       # MDX Blog listing & post routes ([slug])
│   ├── projects/                   # Dedicated projects directory page
│   ├── layout.tsx                  # Root layout with providers & theme
│   └── page.tsx                    # Landing page composing all sections
├── components/
│   ├── app-components/             # Portfolio sections (Hero, Projects, Terminal, etc.)
│   ├── layouts/                    # Header, Footer, and navigation
│   └── ui/                         # shadcn/ui & Radix UI primitives
├── content/
│   └── blog/                       # MDX markdown articles & write-ups
├── lib/
│   ├── config/                     # PRIMARY CONFIGURATION FILES
│   │   ├── site.ts                 # Master config (profile, links, skills, repos, resume)
│   │   ├── hero.ts                 # Hero section copy, actions, and media
│   │   └── about.ts                # Narrative & focus cards for About page
│   ├── generated/
│   │   └── portfolio-data.json     # Pre-fetched GitHub & LeetCode cache
│   └── services/                   # Dynamic API fetchers & badge normalizers
├── public/                         # Static assets (sagar-resume.pdf, avatar.jpg, cover-image.jpg)
└── scripts/
    └── sync-portfolio-data.ts      # Data aggregation script for GitHub & LeetCode
```

---

## Resume Integration & Download

Your resume is hosted directly in the `public/` directory and integrated across the entire portfolio:

- **Direct Download URL**: Accessible at `/sagar-resume.pdf` (e.g. `https://your-domain.com/sagar-resume.pdf`).
- **Header Navigation**: Dedicated `Resume` nav link opening your resume in a new tab.
- **Hero CTA**: Primary hero action button configured to download your resume.
- **Interactive Terminal**: Run `resume` or `cat sagar-resume.pdf` to download or open your resume directly from the shell.
- **GitHub Actions Workflow**: Automatically verifies the resume file in CI and uploads it as a build artifact named `sagar-resume` on every workflow run.

---

## Quick Start

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: [`pnpm`](https://pnpm.io/) (`v10+` or `v12+` recommended)

### 2. Clone the Repository
```bash
git clone https://github.com/sagarkrjha/portfolio-web.git
cd portfolio-web
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Sync Portfolio Data
Fetch live GitHub repositories and LeetCode statistics:
```bash
pnpm run sync:data
```

### 5. Launch the Development Server
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view your portfolio!

---

## Step-by-Step Customization Guide

Customizing this portfolio takes just a few minutes by updating the config files in `lib/config/`.

### Step 1: Update Your Core Profile (`lib/config/site.ts`)

Open [`lib/config/site.ts`](lib/config/site.ts). This is the single source of truth for your personal identity, social presence, and showcase items:

#### 1. Identity & Bio
```typescript
export const siteConfig: SiteConfig = {
  title: "Sagar Kumar Jha | Software Engineer",
  name: "Sagar Kumar Jha",
  role: "Systems & Full-Stack Engineer",
  bio: "Building robust systems, developer tooling, and modern software from first principles with modern C++20 and TypeScript.",
  location: "Delhi, India",
  availability: "Open to engineering roles & collaborations",
  // ...
};
```

#### 2. Navigation & Resume
```typescript
navItems: [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Resume", href: "/sagar-resume.pdf", external: true },
],
```

#### 3. Social Links
Update links to your social profiles:
```typescript
socialLinks: [
  { platform: "github", label: "GitHub", href: "https://github.com/sagarkrjha", external: true },
  { platform: "leetcode", label: "LeetCode", href: "https://leetcode.com/u/devsagarkrjha/", external: true },
  { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/devsagarkumarjha", external: true },
  { platform: "twitter", label: "X (Twitter)", href: "https://x.com/devsagarkrjha", external: true },
  { platform: "discord", label: "Discord", href: "https://discord.com/users/894502933801107476", external: true },
],
```

#### 4. GitHub & LeetCode Handles
Set your exact usernames so the automated sync script and live APIs know whose data to fetch:
```typescript
github: {
  username: "sagarkrjha",
  repositoryCount: 5,                  // Number of repos to showcase
  pinnedRepos: ["minigit", "codeshelf"], // Pinned repos on GitHub, highlighted as Featured
  includeForks: false,                 // Include or omit forked repos
},

leetcode: {
  username: "devsagarkrjha",
  profileUrl: "https://leetcode.com/u/devsagarkrjha/",
},
```

#### 5. Terminal Configuration
Customize the shell prompt displayed in the interactive terminal modal:
```typescript
terminal: {
  unixUser: "sagarkrjha",    // Displays as: sagarkrjha@github:~$
  hostname: "github",
  homePath: "~",
},
```

#### 6. Skills & Categories
Group your skills into categories. Marking `featured: true` highlights them in the skills grid and terminal `skills` command:
```typescript
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
      { name: "Linux / POSIX", featured: true },
    ],
  },
  // Add more categories as desired...
],
```

#### 7. Featured Projects
Pinned projects are showcased as Featured Work:
```typescript
featuredProjects: [
  {
    repoName: "minigit",
    title: "MiniGit",
    description: "Git-compatible version control system implemented from first principles in modern C++20.",
    techStack: ["C++", "C++20"],
    githubUrl: "https://github.com/sagarkrjha/minigit",
    featured: true,
    stars: 14,
    forks: 0,
  },
  {
    repoName: "codeshelf",
    title: "CodeShelf",
    description: "Developer-focused snippet knowledge system across desktop, VS Code, and web.",
    techStack: ["TypeScript", "React", "Electron"],
    githubUrl: "https://github.com/sagarkrjha/codeshelf",
    featured: true,
    stars: 1,
    forks: 0,
  },
],
```

---

### Step 2: Configure the Hero Section (`lib/config/hero.ts`)

Open [`lib/config/hero.ts`](lib/config/hero.ts) to adjust call-to-action buttons, hero media, or custom greetings:

```typescript
export const heroConfig: HeroConfig = {
  greeting: "I'm",
  name: siteConfig.name,
  role: siteConfig.role,
  description: siteConfig.bio,
  availability: siteConfig.availability,

  actions: [
    { label: "View Projects", href: "#projects", variant: "default" },
    { label: "Download Resume", href: "/sagar-resume.pdf", variant: "outline", external: true },
  ],

  media: {
    src: "/cover-image.jpg",
    alt: "",
  },
  avatar: {
    src: "/avatar.jpg",
    alt: "",
  },
};
```

---

### Step 3: Customize About Page & Focus Areas (`lib/config/about.ts`)

Open [`lib/config/about.ts`](lib/config/about.ts) to define your personal engineering story and focus pillars:

```typescript
export const aboutConfig: AboutSectionConfig = {
  id: "about",
  eyebrow: "About",
  title: "Building robust systems and developer tools from first principles.",
  description: "I specialize in low-level systems programming, version control internals, and developer infrastructure...",
  focus: [
    {
      title: "Systems Programming",
      description: "Building reliable software in modern C++20, focusing on memory safety and cache-conscious structures.",
    },
    {
      title: "Developer Infrastructure",
      description: "Designing content-addressable storage, build systems (CMake), and automated cross-platform CI/CD pipelines.",
    },
    {
      title: "Algorithms & Competitive Programming",
      description: "LeetCode Guardian (2382 rating, top 0.36% globally) with 715+ algorithmic problems solved.",
    },
  ],
};
```

---

### Step 4: Replace Images & Media (`public/`)

Drop your custom assets directly into the `public/` directory:

| File Path | Description | Recommended Dimensions |
| :--- | :--- | :--- |
| `public/sagar-resume.pdf` | Developer Resume (PDF) | PDF document |
| `public/avatar.jpg` | Personal avatar / headshot | Square (e.g. 500x500px, JPG/PNG) |
| `public/cover-image.jpg` | Hero banner / background art | Landscape (e.g. 1920x1080px, JPG/WebP) |
| `public/foxy.gif` | Floating mascot animation | Transparent GIF (optional) |

---

### Step 5: Add or Edit Blog Posts (`content/blog/`)

Articles live as `.mdx` files in `content/blog/`. Each post includes standard frontmatter:

```mdx
---
title: "Building a Git-Compatible Version Control System in C++20"
description: "A deep dive into content-addressable storage, commit graphs, and dynamic programming diff calculation."
date: "2026-04-01"
readTime: "6 min read"
tags: ["C++", "Systems", "Version Control"]
---

# Building a Git-Compatible Version Control System in C++20

Write your content using GitHub Flavored Markdown and interactive React/MDX components.
Code blocks are automatically highlighted with PrismJS syntax coloring!
```

---

### Step 6: Test Data Sync Locally

Once you have set your GitHub and LeetCode usernames in `lib/config/site.ts`, test the data aggregator:

```bash
pnpm run sync:data
```

This will:
1. Connect to GitHub REST API and fetch public repositories, languages, stars, and topics.
2. Filter tech badges to keep only languages & frameworks (omitting noisy GitHub topics).
3. Connect to the LeetCode stats API and fetch solved problem count (Easy, Medium, Hard).
4. Save the compiled payload to [`lib/generated/portfolio-data.json`](lib/generated/portfolio-data.json).

---

## Automated Daily Sync with GitHub Actions

The repository includes a GitHub Actions workflow in [`.github/workflows/build.yml`](.github/workflows/build.yml) that:
- Runs every day at **00:00 UTC** via cron.
- Runs automatically on every push to `main`.
- Runs on-demand via GitHub **Run workflow** button (`workflow_dispatch`).
- Verifies that `public/sagar-resume.pdf` is present and valid.
- Uploads the resume as a build artifact named `sagar-resume` on every workflow run.
- Commits updated stats back to `lib/generated/portfolio-data.json` with `[skip ci]`.

### Enabling Write Permissions for GitHub Actions:
To let the GitHub Action commit fresh stats back to your repository:
1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Actions** > **General**.
3. Scroll down to **Workflow permissions**.
4. Select **Read and write permissions**.
5. Click **Save**.

*(Optional)* If you have lots of repositories or run into GitHub API unauthenticated rate limits, create a Personal Access Token (PAT) with `repo` read access and add it to your repo secrets as `PAT_TOKEN`.

---

## Interactive Terminal Commands

Visitors can open the modal terminal anytime by clicking the terminal icon in the header or pressing `Ctrl+\`` / `Cmd+\``. Built-in commands include:

| Command | Action |
| :--- | :--- |
| `neofetch` | Displays system specs, tech summary, and ASCII mascot |
| `about` | Prints bio, location, and engineering focus |
| `skills` | Lists technical skills and core stack |
| `projects` | Interactive list of GitHub projects with links |
| `leetcode` | Shows live algorithmic problem-solving metrics |
| `github` | Displays GitHub statistics and profile URL |
| `resume` | Downloads and opens developer resume (PDF) |
| `social` | Lists all social media channels and handles |
| `blog` | Lists latest blog articles |
| `whoami` | Shows current shell username |
| `fox` / `mascot` | Displays the cute ASCII Fox companion |
| `clear` | Clears the terminal screen |
| `help` | Lists all available terminal commands |

---

## Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **Dev** | `pnpm run dev` | Starts local Next.js development server on `localhost:3000` |
| **Build** | `pnpm run build` | Compiles optimized production bundle |
| **Start** | `pnpm run start` | Serves the production build locally |
| **Sync** | `pnpm run sync:data` | Pulls live GitHub repos, project badges & LeetCode stats into local cache |
| **Lint** | `pnpm run lint` | Runs Biome linter check |
| **Lint Fix**| `pnpm run lint:fix` | Fixes formatting and linting errors automatically |
| **Format** | `pnpm run format` | Formats the codebase using Biome |

---

## Deployment

### Deploy on Vercel (Recommended)
The easiest way to deploy this Next.js app:
1. Push your customized code to your GitHub repository.
2. Import the project into [Vercel](https://vercel.com/new).
3. Vercel automatically detects Next.js:
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm run build`
   - **Install Command**: `pnpm install`
4. Click **Deploy**!

### Deploy on Netlify / Other Platforms
Make sure your build command is set to:
```bash
pnpm run build
```
And output directory:
```bash
.next
```

---

## License

This project is open-source and available under the [MIT License](LICENSE). Feel free to fork, clone, and make it your own!
