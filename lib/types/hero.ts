export type HeroActionIcon =
  | "github"
  | "resume"
  | "arrow";

export type HeroActionVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link";

export interface HeroAction {
  label: string;
  href: string;
  variant?: HeroActionVariant;
  icon?: HeroActionIcon;
  external?: boolean;
  download?: boolean | string;
}

export type HeroSocialPlatform =
  | "github"
  | "leetcode"
  | "linkedin"
  | "twitter"
  | "instagram"
  | "discord"
  | "email";

export interface HeroSocial {
  platform: HeroSocialPlatform;
  label: string;
  href: string;
  external?: boolean;
}

export interface HeroStat {
  value: string;
  label: string;
}
export interface HeroMedia {
  src: string;
  alt: string;
}

export interface HeroAvatar {
  src: string;
  alt: string;
}
export interface HeroConfig {
  greeting: string;
  name: string;
  role: string;
  description: string;
  availability: string;
  actions: HeroAction[];
  socials: HeroSocial[];
  stats: HeroStat[];
  scrollTarget: string;
  media: HeroMedia;
  avatar: HeroAvatar;
}