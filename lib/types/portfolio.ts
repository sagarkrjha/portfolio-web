export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  download?: boolean | string;
}

export interface SkillCategory {
  title: string;
  skills: {
    name: string;
    level?: string;
    icon?: string;
    featured?: boolean;
  }[];
}

export interface FeaturedProjectConfig {
  repoName: string; // e.g. "portfolio-web" or custom
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl: string;
  featured: boolean;
  stars?: number;
  forks?: number;
}

export interface GitHubConfig {
  username: string;
  repositoryCount?: number;
  pinnedRepos?: string[];
  includeForks?: boolean;
}

export interface LeetCodeConfig {
  username: string;
  profileUrl: string;
  statsEndpoint?: string;
}

export interface TerminalCommandConfig {
  command: string;
  description: string;
  output?: string | string[];
}

export interface HobbyItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location?: string;
  description: string[];
  technologies?: string[];
}

export interface SocialLinkConfig {
  platform: "github" | "leetcode" | "linkedin" | "twitter" | "instagram" | "discord" | "email";
  label: string;
  href: string;
  external?: boolean;
}

export interface SectionHeaderConfig {
  number: string;
  badge: string;
  title: string;
  description: string;
}

export interface TerminalConfig {
  unixUser: string;
  hostname: string;
  homePath: string;
}

export interface SiteConfig {
  title: string;
  name: string;
  role: string;
  bio: string;
  location: string;
  availability: string;
  navItems: NavItem[];
  socialLinks: SocialLinkConfig[];
  github: GitHubConfig;
  leetcode: LeetCodeConfig;
  terminal: TerminalConfig;
  sections: {
    projects: SectionHeaderConfig;
    skills: SectionHeaderConfig;
    leetcode: SectionHeaderConfig;
    contributions?: SectionHeaderConfig;
  };
  statusCards: {
    architectureFocus: {
      title: string;
      subtitle: string;
    };
    coreLanguagesFallback: string;
  };
  skills: SkillCategory[];
  featuredProjects: FeaturedProjectConfig[];
  hobbies: HobbyItem[];
  experience: ExperienceItem[];
}
