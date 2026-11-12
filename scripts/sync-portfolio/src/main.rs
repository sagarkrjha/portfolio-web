use chrono::Utc;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GitHubRepo {
    pub name: String,
    pub description: Option<String>,
    pub html_url: String,
    pub homepage: Option<String>,
    pub stargazers_count: u64,
    pub forks_count: u64,
    pub language: Option<String>,
    #[serde(default)]
    pub topics: Vec<String>,
    #[serde(default)]
    pub fork: bool,
    #[serde(default)]
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct RepoBadge {
    pub name: String,
    #[serde(rename = "techStack")]
    pub tech_stack: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LeetCodeStats {
    pub username: String,
    #[serde(rename = "totalSolved")]
    pub total_solved: u64,
    #[serde(rename = "easySolved")]
    pub easy_solved: u64,
    #[serde(rename = "mediumSolved")]
    pub medium_solved: u64,
    #[serde(rename = "hardSolved")]
    pub hard_solved: u64,
    #[serde(rename = "totalQuestions")]
    pub total_questions: u64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DynamicProfileMetrics {
    pub role: String,
    pub bio: String,
    #[serde(rename = "totalRepos")]
    pub total_repos: usize,
    #[serde(rename = "totalStars")]
    pub total_stars: u64,
    #[serde(rename = "primaryLanguages")]
    pub primary_languages: Vec<String>,
    #[serde(rename = "activeProjectsCount")]
    pub active_projects_count: usize,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GeneratedPortfolioData {
    #[serde(rename = "lastUpdated")]
    pub last_updated: String,
    pub profile: DynamicProfileMetrics,
    pub github: GitHubData,
    pub leetcode: LeetCodeStats,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GitHubData {
    pub username: String,
    #[serde(rename = "pinnedRepos")]
    pub pinned_repos: Vec<String>,
    pub repos: Vec<GitHubRepo>,
    #[serde(rename = "repoBadges")]
    pub repo_badges: Vec<RepoBadge>,
}

// Track diff changes across syncs
#[derive(Debug, Default)]
pub struct DiffReport {
    pub new_repos: Vec<String>,
    pub removed_repos: Vec<String>,
    pub description_changes: Vec<(String, String, String)>,
    pub star_changes: Vec<(String, u64, u64)>,
    pub tech_stack_changes: Vec<(String, Vec<String>, Vec<String>)>,
    pub pinned_changes: Option<(Vec<String>, Vec<String>)>,
    pub leetcode_changes: Option<(u64, u64)>,
}

// Tech display normalizer
fn normalize_tech(raw: &str) -> Option<String> {
    let lower = raw.trim().to_lowercase();
    match lower.as_str() {
        "typescript" => Some("TypeScript".to_string()),
        "javascript" => Some("JavaScript".to_string()),
        "c++" | "c++20" | "cpp" | "cpp20" => Some("C++20".to_string()),
        "c" => Some("C".to_string()),
        "rust" => Some("Rust".to_string()),
        "python" => Some("Python".to_string()),
        "go" | "golang" => Some("Go".to_string()),
        "java" => Some("Java".to_string()),
        "next.js" | "nextjs" => Some("Next.js".to_string()),
        "react" => Some("React".to_string()),
        "node.js" | "nodejs" => Some("Node.js".to_string()),
        "tailwind css" | "tailwindcss" => Some("Tailwind CSS".to_string()),
        "electron" => Some("Electron".to_string()),
        "mdx" => Some("MDX".to_string()),
        "cmake" => Some("CMake".to_string()),
        _ => None,
    }
}

const GITHUB_USERNAME: &str = "sagarkrjha";
const LEETCODE_USERNAME: &str = "devsagarkrjha";

fn fetch_github_repos(client: &reqwest::blocking::Client) -> Vec<GitHubRepo> {
    println!("[GitHub] Monitoring public repositories for {}...", GITHUB_USERNAME);
    let url = format!("https://api.github.com/users/{}/repos?sort=updated&per_page=100", GITHUB_USERNAME);
    let mut req = client.get(&url).header("User-Agent", "sync-portfolio-rust");

    if let Ok(token) = std::env::var("GITHUB_TOKEN") {
        if !token.trim().is_empty() {
            req = req.header("Authorization", format!("Bearer {}", token));
        }
    }

    match req.send() {
        Ok(res) if res.status().is_success() => {
            match res.json::<Vec<GitHubRepo>>() {
                Ok(repos) => {
                    println!("[GitHub] Successfully queried {} repositories from API.", repos.len());
                    repos
                }
                Err(e) => {
                    eprintln!("[GitHub] Failed to parse repos JSON: {}", e);
                    vec![]
                }
            }
        }
        Ok(res) => {
            eprintln!("[GitHub] API status {}", res.status());
            vec![]
        }
        Err(e) => {
            eprintln!("[GitHub] Error querying repositories: {}", e);
            vec![]
        }
    }
}

fn fetch_repo_languages(client: &reqwest::blocking::Client, repo_name: &str) -> Vec<String> {
    let url = format!("https://api.github.com/repos/{}/{}/languages", GITHUB_USERNAME, repo_name);
    let mut req = client.get(&url).header("User-Agent", "sync-portfolio-rust");

    if let Ok(token) = std::env::var("GITHUB_TOKEN") {
        if !token.trim().is_empty() {
            req = req.header("Authorization", format!("Bearer {}", token));
        }
    }

    if let Ok(res) = req.send() {
        if res.status().is_success() {
            if let Ok(map) = res.json::<HashMap<String, u64>>() {
                let mut sorted: Vec<(String, u64)> = map.into_iter().collect();
                sorted.sort_by(|a, b| b.1.cmp(&a.1));

                let total_bytes: u64 = sorted.iter().map(|(_, b)| *b).sum();
                let mut valid_langs = Vec::new();

                for (lang, bytes) in sorted {
                    if total_bytes > 0 && ((bytes as f64 / total_bytes as f64) >= 0.008 || bytes > 1000) {
                        if let Some(norm) = normalize_tech(&lang) {
                            if !valid_langs.contains(&norm) {
                                valid_langs.push(norm);
                            }
                        }
                    }
                }

                if !valid_langs.is_empty() {
                    return valid_langs;
                }
            }
        }
    }

    vec![]
}

fn fetch_pinned_repos(client: &reqwest::blocking::Client) -> Vec<String> {
    let url = format!("https://github.com/{}", GITHUB_USERNAME);
    if let Ok(res) = client
        .get(&url)
        .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
        .send()
    {
        if res.status().is_success() {
            if let Ok(html) = res.text() {
                let re = Regex::new(r#"PINNED_REPO[\s\S]*?href=["']/[^/]+/([^"'/]+)["']"#).unwrap();
                let pinned: Vec<String> = re
                    .captures_iter(&html)
                    .filter_map(|cap| cap.get(1).map(|m| m.as_str().to_string()))
                    .collect();

                if !pinned.is_empty() {
                    return pinned;
                }
            }
        }
    }
    vec![
        "minigit".to_string(),
        "codeshelf".to_string(),
        "level-db-cpp".to_string(),
    ]
}

fn fetch_leetcode_stats(client: &reqwest::blocking::Client) -> LeetCodeStats {
    println!("[LeetCode] Querying live metrics for {}...", LEETCODE_USERNAME);
    let fallback = LeetCodeStats {
        username: LEETCODE_USERNAME.to_string(),
        total_solved: 722,
        easy_solved: 208,
        medium_solved: 364,
        hard_solved: 150,
        total_questions: 4110,
    };

    let url = format!("https://alfa-leetcode-api.onrender.com/userProfile/{}", LEETCODE_USERNAME);
    if let Ok(res) = client
        .get(&url)
        .header("User-Agent", "sync-portfolio-rust")
        .timeout(std::time::Duration::from_secs(8))
        .send()
    {
        if res.status().is_success() {
            if let Ok(json) = res.json::<serde_json::Value>() {
                if let Some(total) = json.get("totalSolved").and_then(|v| v.as_u64()) {
                    let easy = json.get("easySolved").and_then(|v| v.as_u64()).unwrap_or(fallback.easy_solved);
                    let med = json.get("mediumSolved").and_then(|v| v.as_u64()).unwrap_or(fallback.medium_solved);
                    let hard = json.get("hardSolved").and_then(|v| v.as_u64()).unwrap_or(fallback.hard_solved);
                    let questions = json.get("totalQuestions").and_then(|v| v.as_u64()).unwrap_or(fallback.total_questions);

                    return LeetCodeStats {
                        username: LEETCODE_USERNAME.to_string(),
                        total_solved: total,
                        easy_solved: easy,
                        medium_solved: med,
                        hard_solved: hard,
                        total_questions: questions,
                    };
                }
            }
        }
    }

    fallback
}

fn main() {
    println!("=== Sync Portfolio & Telemetry Monitor (Rust Engine) ===");

    let client = reqwest::blocking::Client::builder()
        .timeout(std::time::Duration::from_secs(12))
        .build()
        .expect("Failed to create HTTP client");

    let output_path = Path::new("lib/generated/portfolio-data.json");

    // Load previous snapshot to monitor mutations
    let mut previous_snapshot: Option<GeneratedPortfolioData> = None;
    if output_path.exists() {
        if let Ok(content) = fs::read_to_string(output_path) {
            previous_snapshot = serde_json::from_str(&content).ok();
        }
    }

    let fetched_repos = fetch_github_repos(&client);
    let repos = if !fetched_repos.is_empty() {
        fetched_repos
    } else if let Some(e) = &previous_snapshot {
        e.github.repos.clone()
    } else {
        vec![]
    };

    let pinned_repos = fetch_pinned_repos(&client);
    let leetcode = fetch_leetcode_stats(&client);

    let mut lang_counts: HashMap<String, usize> = HashMap::new();
    let mut total_stars: u64 = 0;

    let framework_addons: HashMap<&str, Vec<&str>> = [
        ("codeshelf", vec!["React", "Electron"]),
        ("portfolio-web", vec!["Next.js", "Tailwind CSS"]),
        ("next-mdx-starter", vec!["Next.js", "Tailwind CSS"]),
    ]
    .iter()
    .cloned()
    .collect();

    let mut repo_badges = Vec::new();

    for repo in &repos {
        if repo.fork {
            continue;
        }
        total_stars += repo.stargazers_count;

        let lower = repo.name.to_lowercase();
        let mut tech_stack = Vec::new();

        // 1. Fetch live multi-languages
        let live_langs = fetch_repo_languages(&client, &repo.name);
        if !live_langs.is_empty() {
            for l in live_langs {
                if !tech_stack.contains(&l) {
                    tech_stack.push(l);
                }
            }
        } else if let Some(primary_lang) = &repo.language {
            if let Some(norm) = normalize_tech(primary_lang) {
                tech_stack.push(norm);
            }
        }

        // 2. Add framework indicators
        if let Some(addons) = framework_addons.get(lower.as_str()) {
            for addon in addons {
                let a = addon.to_string();
                if !tech_stack.contains(&a) {
                    tech_stack.push(a);
                }
            }
        }

        for t in &tech_stack {
            if ["TypeScript", "JavaScript", "C++20", "C", "Rust", "Python", "Go", "Java"].contains(&t.as_str()) {
                *lang_counts.entry(t.clone()).or_insert(0) += 1;
            }
        }

        repo_badges.push(RepoBadge {
            name: repo.name.clone(),
            tech_stack,
        });
    }

    let mut sorted_langs: Vec<(String, usize)> = lang_counts.into_iter().collect();
    sorted_langs.sort_by(|a, b| b.1.cmp(&a.1));
    let primary_languages: Vec<String> = sorted_langs.into_iter().map(|(l, _)| l).take(4).collect();

    let non_fork_count = repos.iter().filter(|r| !r.fork).count();
    let primary_pinned = repos
        .iter()
        .find(|r| pinned_repos.iter().any(|p| p.eq_ignore_ascii_case(&r.name)))
        .or_else(|| repos.first());

    let tech_summary = if !primary_languages.is_empty() {
        primary_languages.join(", ")
    } else {
        "TypeScript, C++20, Rust".to_string()
    };

    let project_mention = primary_pinned
        .map(|p| {
            let desc = p
                .description
                .as_deref()
                .unwrap_or("Open-source systems project");
            format!(" Architect of {} ({}).", p.name, desc)
        })
        .unwrap_or_default();

    let bio = format!(
        "Engineer specializing in {}.{} Passionate about building high-performance, clean-architecture software and developer tools.",
        tech_summary, project_mention
    );

    let payload = GeneratedPortfolioData {
        last_updated: Utc::now().to_rfc3339(),
        profile: DynamicProfileMetrics {
            role: "Systems & Full-Stack Developer".to_string(),
            bio,
            total_repos: non_fork_count,
            total_stars,
            primary_languages: primary_languages.clone(),
            active_projects_count: pinned_repos.len(),
        },
        github: GitHubData {
            username: GITHUB_USERNAME.to_string(),
            pinned_repos: pinned_repos.clone(),
            repos: repos.clone(),
            repo_badges: repo_badges.clone(),
        },
        leetcode: leetcode.clone(),
    };

    // ─── Change Monitoring & Telemetry Diff ───────────────────────────────────
    let mut diff = DiffReport::default();

    if let Some(prev) = &previous_snapshot {
        let prev_repo_names: Vec<String> = prev.github.repos.iter().map(|r| r.name.clone()).collect();
        let curr_repo_names: Vec<String> = repos.iter().map(|r| r.name.clone()).collect();

        // 1. Detect added / removed repositories
        for name in &curr_repo_names {
            if !prev_repo_names.contains(name) {
                diff.new_repos.push(name.clone());
            }
        }
        for name in &prev_repo_names {
            if !curr_repo_names.contains(name) {
                diff.removed_repos.push(name.clone());
            }
        }

        // 2. Detect description / star mutations
        for curr in &repos {
            if let Some(old) = prev.github.repos.iter().find(|r| r.name == curr.name) {
                if old.stargazers_count != curr.stargazers_count {
                    diff.star_changes.push((curr.name.clone(), old.stargazers_count, curr.stargazers_count));
                }
                let old_desc = old.description.as_deref().unwrap_or("");
                let curr_desc = curr.description.as_deref().unwrap_or("");
                if old_desc != curr_desc {
                    diff.description_changes.push((curr.name.clone(), old_desc.to_string(), curr_desc.to_string()));
                }
            }
        }

        // 3. Detect technology stack mutations
        for curr_badge in &repo_badges {
            if let Some(old_badge) = prev.github.repo_badges.iter().find(|b| b.name == curr_badge.name) {
                if old_badge.tech_stack != curr_badge.tech_stack {
                    diff.tech_stack_changes.push((
                        curr_badge.name.clone(),
                        old_badge.tech_stack.clone(),
                        curr_badge.tech_stack.clone(),
                    ));
                }
            }
        }

        // 4. Detect pinned changes
        if prev.github.pinned_repos != pinned_repos {
            diff.pinned_changes = Some((prev.github.pinned_repos.clone(), pinned_repos.clone()));
        }

        // 5. Detect LeetCode score delta
        if prev.leetcode.total_solved != leetcode.total_solved {
            diff.leetcode_changes = Some((prev.leetcode.total_solved, leetcode.total_solved));
        }
    }

    // Ensure parent directories exist
    if let Some(parent) = output_path.parent() {
        fs::create_dir_all(parent).ok();
    }

    let serialized = serde_json::to_string_pretty(&payload).expect("Failed to serialize portfolio data");
    fs::write(output_path, serialized).expect("Failed to write portfolio-data.json");

    // ─── Display Telemetry Monitoring Summary ─────────────────────────────────
    println!("\n=======================================================");
    println!("           TELEMETRY & CHANGE MONITOR SUMMARY          ");
    println!("=======================================================");
    println!("✓ Snapshot saved: {}", payload.last_updated);
    println!("  Tracked Repositories: {} non-fork ({} total)", non_fork_count, repos.len());
    println!("  Primary Languages:    {:?}", primary_languages);
    println!("  Total Stars:          {}", total_stars);
    println!("  LeetCode Solved:      {} (E:{} M:{} H:{})", leetcode.total_solved, leetcode.easy_solved, leetcode.medium_solved, leetcode.hard_solved);

    let has_changes = !diff.new_repos.is_empty()
        || !diff.removed_repos.is_empty()
        || !diff.star_changes.is_empty()
        || !diff.description_changes.is_empty()
        || !diff.tech_stack_changes.is_empty()
        || diff.pinned_changes.is_some()
        || diff.leetcode_changes.is_some();

    if has_changes {
        println!("\n[!] DETECTED METADATA / TECHNOLOGY CHANGES:");
        for r in &diff.new_repos {
            println!("  [+] New Repository Created: {}", r);
        }
        for r in &diff.removed_repos {
            println!("  [-] Repository Removed: {}", r);
        }
        for (name, old_s, new_s) in &diff.star_changes {
            println!("  [★] Star Delta on {}: {} -> {}", name, old_s, new_s);
        }
        for (name, old_t, new_t) in &diff.tech_stack_changes {
            println!("  [λ] Technology Stack Changed on {}:", name);
            println!("      Previous: {:?}", old_t);
            println!("      Updated:  {:?}", new_t);
        }
        for (name, old_d, new_d) in &diff.description_changes {
            println!("  [✎] Description Updated on {}:", name);
            println!("      Old: \"{}\"", old_d);
            println!("      New: \"{}\"", new_d);
        }
        if let Some((old_p, new_p)) = diff.pinned_changes {
            println!("  [📌] Pinned Repos Changed: {:?} -> {:?}", old_p, new_p);
        }
        if let Some((old_lc, new_lc)) = diff.leetcode_changes {
            println!("  [⚡] LeetCode Solved Delta: {} -> {}", old_lc, new_lc);
        }
    } else {
        println!("\n[✓] All repository technologies and metadata are in sync (No drift).");
    }
    println!("=======================================================\n");
}
