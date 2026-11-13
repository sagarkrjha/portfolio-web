import type { HeroConfig } from "@/lib/types";
import { siteConfig } from "./site";

export const heroConfig: HeroConfig = {
  greeting: "I'm",
  name: siteConfig.name,

  role: siteConfig.role,

  description: siteConfig.bio,

  availability: siteConfig.availability,

  actions: [
    {
      label: "Explore Work",
      href: "/projects",
      variant: "default",
      icon: "arrow",
    },
    {
      label: "View Resume",
      href: "/resume",
      variant: "outline",
      icon: "resume",
    },
  ],

  socials: siteConfig.socialLinks,

  stats: [],

  scrollTarget: "#about",

  media: {
    src: "/cover-image.jpg",
    alt: "Workspace banner",
  },

  avatar: {
    src: "/avatar.jpg",
    alt: "Sagar Kumar Jha",
  },
};
