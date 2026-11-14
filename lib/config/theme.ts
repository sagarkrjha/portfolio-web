export type OsThemeKey = "carbon" | "nord" | "matrix" | "dracula" | "paper";

export interface OsThemeColors {
  name: string;
  primary: string;
  accent: string;
  dark: {
    bg: string;
    card: string;
    border: string;
    text: string;
    muted: string;
  };
  light: {
    bg: string;
    card: string;
    border: string;
    text: string;
    muted: string;
  };
}

export interface OsDesktopAppConfig {
  id: string;
  label: string;
  shortcutKey: string;
  defaultOnDesktop: boolean;
  category: "utility" | "work" | "system" | "media";
}

export interface ThemeConfig {
  defaultTheme: "dark" | "light" | "system";
  defaultOsTheme: OsThemeKey;
  brand: {
    name: string;
    code: string;
    accentHex: string;
    fontFamily: string;
    monoFamily: string;
  };
  osThemes: Record<OsThemeKey, OsThemeColors>;
  defaultDesktopApps: string[];
}

export const themeConfig: ThemeConfig = {
  defaultTheme: "dark",
  defaultOsTheme: "carbon",
  brand: {
    name: "IBM Carbon Design System",
    code: "carbon-v11",
    accentHex: "#33b1ff",
    fontFamily: "var(--font-sans)",
    monoFamily: "var(--font-geist-mono)",
  },
  defaultDesktopApps: [
    "about",
    "terminal",
    "projects",
    "blog",
    "resume",
    "settings",
    "taskmanager",
  ],
  osThemes: {
    carbon: {
      name: "Carbon Obsidian (Default)",
      primary: "#33b1ff",
      accent: "#0f62fe",
      dark: {
        bg: "#161616",
        card: "#222120",
        border: "rgba(255, 255, 255, 0.16)",
        text: "#f5f5f5",
        muted: "#b0b0b8",
      },
      light: {
        bg: "#f8f9fa",
        card: "#ffffff",
        border: "rgba(0, 0, 0, 0.15)",
        text: "#161616",
        muted: "#52525b",
      },
    },
    nord: {
      name: "Nordic Frost",
      primary: "#5e81ac",
      accent: "#88c0d0",
      dark: {
        bg: "#242933",
        card: "#2e3440",
        border: "rgba(136, 192, 208, 0.28)",
        text: "#eceff4",
        muted: "#d8dee9",
      },
      light: {
        bg: "#eceff4",
        card: "#ffffff",
        border: "rgba(46, 52, 64, 0.22)",
        text: "#2e3440",
        muted: "#4c566a",
      },
    },
    matrix: {
      name: "Matrix Phosphor",
      primary: "#00e65c",
      accent: "#00b347",
      dark: {
        bg: "#051205",
        card: "#0d240d",
        border: "rgba(0, 230, 92, 0.32)",
        text: "#b3ffb3",
        muted: "#70c270",
      },
      light: {
        bg: "#f0faf0",
        card: "#ffffff",
        border: "rgba(0, 120, 50, 0.25)",
        text: "#053005",
        muted: "#1b5e20",
      },
    },
    dracula: {
      name: "Dracula Night",
      primary: "#bd93f9",
      accent: "#ff79c6",
      dark: {
        bg: "#1e1f29",
        card: "#282a36",
        border: "rgba(189, 147, 249, 0.30)",
        text: "#f8f8f2",
        muted: "#b8bfe0",
      },
      light: {
        bg: "#f8f8f2",
        card: "#ffffff",
        border: "rgba(98, 114, 164, 0.28)",
        text: "#282a36",
        muted: "#44475a",
      },
    },
    paper: {
      name: "Architectural Paper",
      primary: "#c2410c",
      accent: "#ea580c",
      dark: {
        bg: "#18181b",
        card: "#27272a",
        border: "rgba(255, 255, 255, 0.18)",
        text: "#f4f4f4",
        muted: "#b5b5be",
      },
      light: {
        bg: "#fcfbf9",
        card: "#ffffff",
        border: "rgba(0, 0, 0, 0.15)",
        text: "#1c1917",
        muted: "#57534e",
      },
    },
  },
};
