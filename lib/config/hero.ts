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
      label: "View Projects",
      href: "#projects",
      variant: "default",
    },
    {
      label: "Download Resume",
      href: "/sagar-resume.pdf",
      variant: "outline",
      icon: "resume",
      download: "sagar-resume.pdf",
      external: true,
    },
  ],

  socials: siteConfig.socialLinks,

  stats: [],

  scrollTarget: "#about",

  media: {
    src: "/cover-image.jpg",
    alt: "",
  },

  avatar: {
    src: "/avatar.jpg",
    alt: "",
  },
};