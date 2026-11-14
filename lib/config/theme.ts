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
        bg: "#1c1917",
        card: "#272220",
        border: "rgba(255, 255, 255, 0.12)",
        text: "#f4f4f4",
        muted: "#a1a1aa",
      },
      light: {
        bg: "#ffffff",
        card: "#f4f4f5",
        border: "rgba(0, 0, 0, 0.12)",
        text: "#18181b",
        muted: "#52525b",
      },
    },
    nord: {
      name: "Nordic Frost",
      primary: "#88c0d0",
      accent: "#81a1c1",
      dark: {
        bg: "#242933",
        card: "#2e3440",
        border: "rgba(136, 192, 208, 0.2)",
        text: "#eceff4",
        muted: "#d8dee9",
      },
      light: {
        bg: "#eceff4",
        card: "#e5e9f0",
        border: "rgba(46, 52, 64, 0.15)",
        text: "#2e3440",
        muted: "#4c566a",
      },
    },
    matrix: {
      name: "Matrix Phosphor",
      primary: "#00ff66",
      accent: "#00cc55",
      dark: {
        bg: "#051005",
        card: "#0d200d",
        border: "rgba(0, 255, 102, 0.25)",
        text: "#a3ffa3",
        muted: "#4d804d",
      },
      light: {
        bg: "#f0faf0",
        card: "#e0f2e0",
        border: "rgba(0, 100, 40, 0.2)",
        text: "#053005",
        muted: "#2d602d",
      },
    },
    dracula: {
      name: "Dracula Night",
      primary: "#bd93f9",
      accent: "#ff79c6",
      dark: {
        bg: "#1e1f29",
        card: "#282a36",
        border: "rgba(189, 147, 249, 0.2)",
        text: "#f8f8f2",
        muted: "#6272a4",
      },
      light: {
        bg: "#f8f8f2",
        card: "#edece6",
        border: "rgba(98, 114, 164, 0.2)",
        text: "#282a36",
        muted: "#6272a4",
      },
    },
    paper: {
      name: "Architectural Paper",
      primary: "#d97706",
      accent: "#b45309",
      dark: {
        bg: "#18181b",
        card: "#27272a",
        border: "rgba(255, 255, 255, 0.15)",
        text: "#f4f4f4",
        muted: "#a1a1aa",
      },
      light: {
        bg: "#f4f4f5",
        card: "#ffffff",
        border: "rgba(0, 0, 0, 0.12)",
        text: "#18181b",
        muted: "#52525b",
      },
    },
  },
};
