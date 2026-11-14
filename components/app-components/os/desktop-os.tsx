"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  FiTerminal,
  FiUser,
  FiFolder,
  FiFileText,
  FiBookOpen,
  FiSettings,
  FiX,
  FiMinus,
  FiMaximize2,
  FiMinimize2,
  FiGrid,
  FiWifi,
  FiVolume2,
  FiBatteryCharging,
  FiExternalLink,
  FiSun,
  FiMoon,
  FiColumns,
  FiLayers,
  FiCommand,
  FiCheck,
  FiSliders,
  FiGithub,
  FiAward,
  FiCode,
  FiCpu,
  FiClock,
  FiActivity,
  FiRefreshCw,
  FiPlay,
  FiSquare,
  FiDroplet,
  FiSearch,
  FiEye,
  FiMinimize,
  FiRotateCcw,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { useTheme } from "next-themes";
import { useOsMode } from "@/components/providers";
import { siteConfig, heroConfig, aboutConfig } from "@/lib/config";
import TerminalModal from "@/components/app-components/terminal/terminal";
import { ResumePdfViewer } from "@/components/app-components/resume";
import cachedData from "@/lib/generated/portfolio-data.json";

export type WindowId =
  | "about"
  | "terminal"
  | "projects"
  | "blog"
  | "resume"
  | "settings"
  | "taskmanager";

export type LayoutMode = "floating" | "tiling-horizontal" | "tiling-vertical" | "tiling-grid";
export type WallpaperKey = "hero";
export type OsThemeKey = "carbon" | "nord" | "matrix" | "dracula" | "paper";

interface WindowState {
  id: WindowId;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const OS_THEMES: Record<
  OsThemeKey,
  {
    name: string;
    bg: string;
    card: string;
    primary: string;
    border: string;
    text: string;
    accent: string;
  }
> = {
  carbon: {
    name: "Carbon Obsidian (Default)",
    bg: "#1c1917",
    card: "#272220",
    primary: "#33b1ff",
    border: "rgba(255, 255, 255, 0.1)",
    text: "#f4f4f4",
    accent: "#0f62fe",
  },
  nord: {
    name: "Nordic Frost",
    bg: "#242933",
    card: "#2e3440",
    primary: "#88c0d0",
    border: "rgba(136, 192, 208, 0.2)",
    text: "#eceff4",
    accent: "#81a1c1",
  },
  matrix: {
    name: "Cyber Emerald",
    bg: "#0d1117",
    card: "#161b22",
    primary: "#2ea043",
    border: "rgba(46, 160, 67, 0.3)",
    text: "#56d364",
    accent: "#3fb950",
  },
  dracula: {
    name: "Dracula Twilight",
    bg: "#1e1f29",
    card: "#282a36",
    primary: "#bd93f9",
    border: "rgba(189, 147, 249, 0.25)",
    text: "#f8f8f2",
    accent: "#ff79c6",
  },
  paper: {
    name: "Paper Titanium (Clean)",
    bg: "#f4f4f4",
    card: "#ffffff",
    primary: "#0f62fe",
    border: "rgba(0, 0, 0, 0.12)",
    text: "#161616",
    accent: "#33b1ff",
  },
};

const getHeroWallpaperStyle = (isDark: boolean): React.CSSProperties => ({
  backgroundImage: isDark
    ? `linear-gradient(rgba(28, 25, 23, 0.85), rgba(28, 25, 23, 0.96)), url('${heroConfig.media.src}')`
    : `linear-gradient(rgba(244, 244, 244, 0.86), rgba(244, 244, 244, 0.97)), url('${heroConfig.media.src}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

export const DesktopOs = () => {
  const { isOsMode, toggleOsMode } = useOsMode();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [time, setTime] = useState("");
  const [activeWindow, setActiveWindow] = useState<WindowId | null>("about");
  const [topZ, setTopZ] = useState(10);
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>("floating");
  const [osTheme, setOsThemeState] = useState<OsThemeKey>("carbon");
  const [showDesktopIcons, setShowDesktopIconsState] = useState<boolean>(true);
  const [showAppleMenu, setShowAppleMenu] = useState(false);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);
  const [launcherSearch, setLauncherSearch] = useState("");

  // Customizable Desktop Shortcuts list (supports removing/restoring desktop shortcuts)
  const [desktopApps, setDesktopApps] = useState<WindowId[]>([
    "about",
    "terminal",
    "projects",
    "blog",
    "resume",
    "settings",
    "taskmanager",
  ]);

  // Load persistent preferences from localStorage
  useEffect(() => {
    try {
      const savedApps = localStorage.getItem("portfolio_desktop_apps");
      if (savedApps) {
        const parsed = JSON.parse(savedApps);
        if (Array.isArray(parsed)) {
          setDesktopApps(parsed);
        }
      }
      const savedTheme = localStorage.getItem("portfolio_os_theme") as OsThemeKey | null;
      if (savedTheme && (savedTheme in OS_THEMES)) {
        setOsThemeState(savedTheme);
      }
      const savedLayout = localStorage.getItem("portfolio_layout_mode") as LayoutMode | null;
      if (savedLayout && ["floating", "tiling-horizontal", "tiling-vertical", "tiling-grid"].includes(savedLayout)) {
        setLayoutModeState(savedLayout);
      }
      const savedDesktopIcons = localStorage.getItem("portfolio_show_desktop_icons");
      if (savedDesktopIcons !== null) {
        setShowDesktopIconsState(savedDesktopIcons === "true");
      }
    } catch {
      // Ignore
    }
  }, []);

  const saveDesktopApps = (apps: WindowId[]) => {
    setDesktopApps(apps);
    try {
      localStorage.setItem("portfolio_desktop_apps", JSON.stringify(apps));
    } catch {
      // Ignore
    }
  };

  const setOsTheme = (themeKey: OsThemeKey) => {
    setOsThemeState(themeKey);
    try {
      localStorage.setItem("portfolio_os_theme", themeKey);
    } catch {
      // Ignore
    }
  };

  const setLayoutMode = (mode: LayoutMode | ((prev: LayoutMode) => LayoutMode)) => {
    setLayoutModeState((prev) => {
      const nextVal = typeof mode === "function" ? mode(prev) : mode;
      try {
        localStorage.setItem("portfolio_layout_mode", nextVal);
      } catch {
        // Ignore
      }
      return nextVal;
    });
  };

  const setShowDesktopIcons = (show: boolean | ((prev: boolean) => boolean)) => {
    setShowDesktopIconsState((prev) => {
      const nextVal = typeof show === "function" ? show(prev) : show;
      try {
        localStorage.setItem("portfolio_show_desktop_icons", String(nextVal));
      } catch {
        // Ignore
      }
      return nextVal;
    });
  };

  const removeDesktopShortcut = (id: WindowId) => {
    const updated = desktopApps.filter((appId) => appId !== id);
    saveDesktopApps(updated);
  };

  const addDesktopShortcut = (id: WindowId) => {
    if (!desktopApps.includes(id)) {
      const updated = [...desktopApps, id];
      saveDesktopApps(updated);
    }
  };

  const resetDesktopShortcuts = () => {
    saveDesktopApps([
      "about",
      "terminal",
      "projects",
      "blog",
      "resume",
      "settings",
      "taskmanager",
    ]);
  };

  // Context Menu state (Right Click on Desktop Canvas)
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
  });

  // Application Right Click Menu state (Right Click on Desktop Icons or Dock items)
  const [appContextMenu, setAppContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    windowId: WindowId | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    windowId: null,
  });

  // Simulated system task metrics
  const [cpuUsage, setCpuUsage] = useState(14);
  const [memUsage, setMemUsage] = useState(2.4);

  // Dragging state
  const dragRef = useRef<{
    windowId: WindowId | null;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  }>({
    windowId: null,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const [windows, setWindows] = useState<Record<WindowId, WindowState>>({
    about: {
      id: "about",
      title: "About Sagar",
      icon: FiUser,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      position: { x: 30, y: 25 },
      size: { width: 680, height: 500 },
    },
    terminal: {
      id: "terminal",
      title: "Carbon Shell (bash)",
      icon: FiTerminal,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 2,
      position: { x: 80, y: 40 },
      size: { width: 720, height: 520 },
    },
    projects: {
      id: "projects",
      title: "Projects & Repositories",
      icon: FiFolder,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 3,
      position: { x: 120, y: 40 },
      size: { width: 740, height: 540 },
    },
    blog: {
      id: "blog",
      title: "Technical Writings",
      icon: FiBookOpen,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 4,
      position: { x: 160, y: 50 },
      size: { width: 700, height: 520 },
    },
    resume: {
      id: "resume",
      title: "Resume (PDF)",
      icon: FiFileText,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 5,
      position: { x: 100, y: 30 },
      size: { width: 760, height: 580 },
    },
    settings: {
      id: "settings",
      title: "Settings & Personalization",
      icon: FiSettings,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 6,
      position: { x: 180, y: 60 },
      size: { width: 620, height: 500 },
    },
    taskmanager: {
      id: "taskmanager",
      title: "Task Manager & Processes",
      icon: FiActivity,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 7,
      position: { x: 150, y: 70 },
      size: { width: 640, height: 460 },
    },
  });

  // Clock & system metrics jitter
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      setCpuUsage((prev) => Math.min(65, Math.max(8, prev + (Math.random() * 8 - 4))));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    setTopZ((prev) => {
      const nextZ = prev + 1;
      setWindows((wPrev) => ({
        ...wPrev,
        [id]: {
          ...wPrev[id],
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
        },
      }));
      return nextZ;
    });
    setActiveWindow(id);
  }, []);

  const toggleMaximize = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized,
      },
    }));
  }, []);

  // Guaranteed Close Handler with direct state update
  const closeWindow = useCallback(
    (id: WindowId, e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], isOpen: false, isMinimized: false, isMaximized: false },
      }));
      if (activeWindow === id) {
        setActiveWindow(null);
      }
    },
    [activeWindow],
  );

  const minimizeWindow = useCallback(
    (id: WindowId, e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], isMinimized: true },
      }));
      if (activeWindow === id) {
        setActiveWindow(null);
      }
    },
    [activeWindow],
  );

  const toggleWindow = useCallback(
    (id: WindowId) => {
      const w = windows[id];
      if (w.isOpen && !w.isMinimized) {
        if (activeWindow === id) {
          minimizeWindow(id);
        } else {
          focusWindow(id);
        }
      } else {
        focusWindow(id);
      }
    },
    [windows, activeWindow, minimizeWindow, focusWindow],
  );

  const windowList = Object.values(windows);
  const openWindows = windowList.filter((w) => w.isOpen);

  const cycleNextWindow = useCallback(() => {
    if (openWindows.length <= 1) return;
    const currentIndex = openWindows.findIndex((w) => w.id === activeWindow);
    const nextIndex = (currentIndex + 1) % openWindows.length;
    const nextId = openWindows[nextIndex].id;
    focusWindow(nextId);
  }, [openWindows, activeWindow, focusWindow]);

  // Global Keyboard Navigation (Carefully scoped with Alt/Option to avoid browser shortcuts)
  useEffect(() => {
    if (!isOsMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // 1. Escape key behavior: close topmost overlays/context menus or active window
      if (e.key === "Escape") {
        if (appContextMenu.visible) {
          setAppContextMenu((prev) => ({ ...prev, visible: false }));
          return;
        }
        if (contextMenu.visible) {
          setContextMenu((prev) => ({ ...prev, visible: false }));
          return;
        }
        if (showAppleMenu) {
          setShowAppleMenu(false);
          return;
        }
        if (showControlCenter) {
          setShowControlCenter(false);
          return;
        }
        if (showLauncher) {
          setShowLauncher(false);
          return;
        }

        if (activeWindow && !isInput) {
          closeWindow(activeWindow);
          return;
        }
      }

      // 2. Alt+Space: Toggle Application Launcher (Spotlight style)
      if (e.altKey && !e.ctrlKey && !e.shiftKey && (e.code === "Space" || e.key === " ")) {
        e.preventDefault();
        setShowLauncher((prev) => !prev);
        return;
      }

      // 3. Alt+Tab: Cycle Next Open Window
      if (e.altKey && !e.ctrlKey && !e.shiftKey && e.key === "Tab") {
        e.preventDefault();
        setShowSwitcher(true);
        cycleNextWindow();
        return;
      }

      // Only check non-input shortcuts below
      if (isInput) return;

      // 4. Alt + 1..7: Quick App Launcher shortcuts
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const appKeys: Record<string, WindowId> = {
          "1": "about",
          "2": "terminal",
          "3": "projects",
          "4": "blog",
          "5": "resume",
          "6": "settings",
          "7": "taskmanager",
        };
        if (appKeys[e.key]) {
          e.preventDefault();
          toggleWindow(appKeys[e.key]);
          return;
        }
      }

      // 5. Alt + M: Toggle Window Maximize / Restore
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && (e.key === "m" || e.key === "M")) {
        e.preventDefault();
        if (activeWindow) toggleMaximize(activeWindow);
        return;
      }

      // 6. Hyprland Tiling shortcuts: Alt+H (cols), Alt+V (rows), Alt+G (grid), Alt+F (float)
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        if (e.key === "h" || e.key === "H") {
          e.preventDefault();
          setLayoutMode((prev) =>
            prev === "tiling-horizontal" ? "floating" : "tiling-horizontal",
          );
        } else if (e.key === "v" || e.key === "V") {
          e.preventDefault();
          setLayoutMode((prev) => (prev === "tiling-vertical" ? "floating" : "tiling-vertical"));
        } else if (e.key === "g" || e.key === "G") {
          e.preventDefault();
          setLayoutMode((prev) => (prev === "tiling-grid" ? "floating" : "tiling-grid"));
        } else if (e.key === "f" || e.key === "F") {
          e.preventDefault();
          setLayoutMode("floating");
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        setShowSwitcher(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    isOsMode,
    activeWindow,
    contextMenu.visible,
    appContextMenu.visible,
    showLauncher,
    closeWindow,
    cycleNextWindow,
    toggleMaximize,
    toggleWindow,
  ]);

  // Window Drag Handlers
  const handleMouseDownHeader = (e: React.MouseEvent, id: WindowId) => {
    if (layoutMode !== "floating" || windows[id].isMaximized) return;
    focusWindow(id);
    dragRef.current = {
      windowId: id,
      startX: e.clientX,
      startY: e.clientY,
      origX: windows[id].position.x,
      origY: windows[id].position.y,
    };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current.windowId) return;
    const { windowId, startX, startY, origX, origY } = dragRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    setWindows((prev) => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        position: {
          x: Math.max(0, origX + dx),
          y: Math.max(0, origY + dy),
        },
      },
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    dragRef.current.windowId = null;
  }, []);

  // Desktop Canvas Right Click Handler
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setAppContextMenu((prev) => ({ ...prev, visible: false }));
    setContextMenu({
      visible: true,
      x: Math.min(window.innerWidth - 220, e.clientX),
      y: Math.min(window.innerHeight - 270, e.clientY),
    });
  };

  // Application Icon Right Click Handler
  const handleAppContextMenu = (e: React.MouseEvent, id: WindowId) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu((prev) => ({ ...prev, visible: false }));
    setAppContextMenu({
      visible: true,
      x: Math.min(window.innerWidth - 220, e.clientX),
      y: Math.min(window.innerHeight - 240, e.clientY),
      windowId: id,
    });
  };

  if (!isOsMode) return null;

  // Compute Tiling Styles if Tiling Layout is active
  const visibleTilingWindows = openWindows.filter((w) => !w.isMinimized);
  const getTilingStyle = (id: WindowId): React.CSSProperties => {
    if (layoutMode === "floating") {
      const w = windows[id];
      if (w.isMaximized) {
        return {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          zIndex: w.zIndex,
        };
      }
      return {
        position: "absolute",
        left: `${w.position.x}px`,
        top: `${w.position.y}px`,
        width: `${w.size.width}px`,
        maxWidth: "96vw",
        maxHeight: "84vh",
        zIndex: w.zIndex,
      };
    }

    const index = visibleTilingWindows.findIndex((w) => w.id === id);
    const count = visibleTilingWindows.length || 1;
    const pad = 8;

    if (layoutMode === "tiling-horizontal") {
      const widthPct = 100 / count;
      return {
        position: "absolute",
        top: `${pad}px`,
        bottom: `${pad}px`,
        left: `calc(${index * widthPct}% + ${pad}px)`,
        width: `calc(${widthPct}% - ${pad * 2}px)`,
        height: `calc(100% - ${pad * 2}px)`,
        zIndex: windows[id].zIndex,
      };
    }

    if (layoutMode === "tiling-vertical") {
      const heightPct = 100 / count;
      return {
        position: "absolute",
        left: `${pad}px`,
        right: `${pad}px`,
        top: `calc(${index * heightPct}% + ${pad}px)`,
        height: `calc(${heightPct}% - ${pad * 2}px)`,
        width: `calc(100% - ${pad * 2}px)`,
        zIndex: windows[id].zIndex,
      };
    }

    // Grid (2x2 or 1x2)
    const cols = count > 2 ? 2 : count;
    const rows = Math.ceil(count / 2);
    const colIdx = index % 2;
    const rowIdx = Math.floor(index / 2);

    const wPct = 100 / cols;
    const hPct = 100 / rows;

    return {
      position: "absolute",
      left: `calc(${colIdx * wPct}% + ${pad}px)`,
      top: `calc(${rowIdx * hPct}% + ${pad}px)`,
      width: `calc(${wPct}% - ${pad * 2}px)`,
      height: `calc(${hPct}% - ${pad * 2}px)`,
      zIndex: windows[id].zIndex,
    };
  };

  const currentTheme = OS_THEMES[osTheme];

  // Helper renderer for Window Titlebar with fixed stop-propagation close button
  const renderTitleBar = (id: WindowId, title: string) => (
    <div
      onMouseDown={(e) => handleMouseDownHeader(e, id)}
      onDoubleClick={() => toggleMaximize(id)}
      className="flex items-center justify-between px-3.5 py-2.5 border-b select-none cursor-move shrink-0"
      style={{
        backgroundColor: isDark ? currentTheme.card : "#f4f4f4",
        borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.1)",
        color: isDark ? "#f4f4f4" : "#161616",
      }}
    >
      <div className="flex items-center gap-2">
        {/* Red Close Button */}
        <button
          type="button"
          onClick={(e) => closeWindow(id, e)}
          onMouseDown={(e) => e.stopPropagation()}
          className="size-3.5 rounded-full bg-[#ff5f56] hover:brightness-125 border border-[#e0443e] cursor-pointer flex items-center justify-center group"
          title="Close (ESC)"
        >
          <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/80 leading-none">
            ✕
          </span>
        </button>

        {/* Yellow Minimize Button */}
        <button
          type="button"
          onClick={(e) => minimizeWindow(id, e)}
          onMouseDown={(e) => e.stopPropagation()}
          className="size-3.5 rounded-full bg-[#ffbd2e] hover:brightness-125 border border-[#dea123] cursor-pointer flex items-center justify-center group"
          title="Minimize"
        >
          <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/80 leading-none">
            −
          </span>
        </button>

        {/* Green Maximize Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleMaximize(id);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="size-3.5 rounded-full bg-[#27c93f] hover:brightness-125 border border-[#1aab29] cursor-pointer flex items-center justify-center group"
          title="Maximize / Restore (Double Tap)"
        >
          <span className="opacity-0 group-hover:opacity-100 text-[7px] font-bold text-black/80 leading-none">
            {windows[id].isMaximized ? "⤓" : "⤢"}
          </span>
        </button>
      </div>

      <span className={`text-xs font-semibold pointer-events-none truncate max-w-[65%] font-mono ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
        {title}
      </span>

      <button
        type="button"
        onClick={() => toggleMaximize(id)}
        className={`cursor-pointer p-0.5 transition-colors ${isDark ? "text-zinc-400 hover:text-zinc-100" : "text-zinc-500 hover:text-zinc-900"}`}
      >
        {windows[id].isMaximized ? (
          <FiMinimize2 className="size-3.5" />
        ) : (
          <FiMaximize2 className="size-3.5" />
        )}
      </button>
    </div>
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      style={getHeroWallpaperStyle(isDark)}
      className={`fixed inset-0 z-50 flex flex-col font-sans select-none overflow-hidden animate-in fade-in duration-200 transition-all ${
        isDark ? "text-zinc-100" : "text-zinc-900"
      }`}
    >
      {/* macOS Native Top Menu Bar */}
      <header
        className={`h-7 w-full border-b px-2.5 sm:px-3 flex items-center justify-between text-xs backdrop-blur-xl z-50 shadow-sm select-none ${
          isDark ? "text-zinc-200" : "text-zinc-800"
        }`}
        style={{
          backgroundColor: isDark ? `${currentTheme.card}F5` : "rgba(255, 255, 255, 0.94)",
          borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left Side: Apple Menu, App Name, macOS Menu Items */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Apple Logo Icon with Dropdown Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAppleMenu((prev) => !prev);
                setShowControlCenter(false);
              }}
              className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer flex items-center justify-center font-semibold text-sm ${
                showAppleMenu
                  ? "bg-primary text-black"
                  : (isDark ? "hover:bg-white/10 text-zinc-100" : "hover:bg-black/5 text-zinc-900")
              }`}
              title="Apple Menu"
            >
              
            </button>

            {/* Apple Dropdown Menu */}
            {showAppleMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute left-0 top-full mt-1 w-56 rounded-xl border p-1 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-100 text-xs font-sans ${
                  isDark ? "text-zinc-200" : "text-zinc-800"
                }`}
                style={{
                  backgroundColor: isDark ? `${currentTheme.card}FB` : "rgba(255, 255, 255, 0.98)",
                  borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.12)",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    focusWindow("about");
                    setShowAppleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                    isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                  }`}
                >
                  <span className="font-medium">About This Portfolio</span>
                  <span className="text-[10px] text-zinc-400 font-mono">⌥1</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    focusWindow("settings");
                    setShowAppleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                    isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                  }`}
                >
                  <span>System Settings...</span>
                  <span className="text-[10px] text-zinc-400 font-mono">⌥6</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    focusWindow("taskmanager");
                    setShowAppleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                    isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                  }`}
                >
                  <span>Activity Monitor</span>
                  <span className="text-[10px] text-zinc-400 font-mono">⌥7</span>
                </button>

                <div className={`my-1 border-t ${isDark ? "border-white/10" : "border-black/10"}`} />

                <button
                  type="button"
                  onClick={() => {
                    setShowDesktopIcons((prev) => !prev);
                    setShowAppleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                    isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                  }`}
                >
                  <span>{showDesktopIcons ? "Hide Desktop Icons" : "Show Desktop Icons"}</span>
                  {showDesktopIcons && <FiCheck className="size-3 text-primary" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowLauncher(true);
                    setShowAppleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                    isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                  }`}
                >
                  <span>App Launcher (Spotlight)</span>
                  <span className="text-[10px] text-zinc-400 font-mono">⌥Space</span>
                </button>

                <div className={`my-1 border-t ${isDark ? "border-white/10" : "border-black/10"}`} />

                <button
                  type="button"
                  onClick={() => {
                    toggleOsMode();
                    setShowAppleMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-red-500/20 text-red-500 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Shut Down / Exit OS</span>
                  <FiExternalLink className="size-3" />
                </button>
              </div>
            )}
          </div>

          {/* Active Application Name in bold macOS typography */}
          <span className={`font-bold px-1.5 py-0.5 rounded text-xs ${isDark ? "text-zinc-100" : "text-zinc-950"}`}>
            {activeWindow ? windows[activeWindow].title.split(" ")[0] : "Finder"}
          </span>

          {/* Classic macOS Top App Menus */}
          <div className="hidden md:flex items-center gap-0.5 text-xs">
            <button
              type="button"
              onClick={() => focusWindow("settings")}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                isDark ? "hover:bg-white/10 text-zinc-300 hover:text-zinc-100" : "hover:bg-black/5 text-zinc-700 hover:text-zinc-900"
              }`}
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() => setShowLauncher(true)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                isDark ? "hover:bg-white/10 text-zinc-300 hover:text-zinc-100" : "hover:bg-black/5 text-zinc-700 hover:text-zinc-900"
              }`}
            >
              Window
            </button>
            <button
              type="button"
              onClick={() => setShowDesktopIcons((prev) => !prev)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                isDark ? "hover:bg-white/10 text-zinc-300 hover:text-zinc-100" : "hover:bg-black/5 text-zinc-700 hover:text-zinc-900"
              }`}
            >
              {showDesktopIcons ? "Hide Desktop" : "Show Desktop"}
            </button>
            <button
              type="button"
              onClick={() => focusWindow("about")}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                isDark ? "hover:bg-white/10 text-zinc-300 hover:text-zinc-100" : "hover:bg-black/5 text-zinc-700 hover:text-zinc-900"
              }`}
            >
              Help
            </button>
          </div>
        </div>

        {/* Right Status Tray (macOS Control Center, Battery, Clock, Exit) */}
        <div className={`flex items-center gap-1.5 sm:gap-2.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
          {/* Spotlight Search Icon */}
          <button
            type="button"
            onClick={() => setShowLauncher(true)}
            className={`p-1 rounded cursor-pointer transition-colors ${
              isDark ? "hover:bg-white/10 text-zinc-300 hover:text-zinc-100" : "hover:bg-black/5 text-zinc-700 hover:text-zinc-900"
            }`}
            title="Spotlight Search (Alt+Space)"
          >
            <FiSearch className="size-3.5" />
          </button>

          {/* macOS Control Center Button */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowControlCenter((prev) => !prev);
                setShowAppleMenu(false);
              }}
              className={`p-1 rounded cursor-pointer transition-colors flex items-center gap-1 ${
                showControlCenter
                  ? "bg-primary text-black"
                  : (isDark ? "hover:bg-white/10 text-zinc-300 hover:text-zinc-100" : "hover:bg-black/5 text-zinc-700 hover:text-zinc-900")
              }`}
              title="Control Center (Quick Settings)"
            >
              <FiSliders className="size-3.5" />
            </button>

            {/* macOS Control Center Flyout Modal */}
            {showControlCenter && (
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute right-0 top-full mt-1.5 w-72 rounded-2xl border p-3 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-100 font-sans text-xs ${
                  isDark ? "text-zinc-200" : "text-zinc-800"
                }`}
                style={{
                  backgroundColor: isDark ? `${currentTheme.card}F8` : "rgba(255, 255, 255, 0.96)",
                  borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.12)",
                }}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 font-medium">
                  <span>Control Center</span>
                  <span className="text-[10px] text-zinc-400 font-mono">macOS Style</span>
                </div>

                {/* Quick Toggles Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {/* Theme Mode Toggle */}
                  <button
                    type="button"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    className={`p-2.5 rounded-xl border flex flex-col gap-1 text-left cursor-pointer transition-all ${
                      isDark
                        ? "bg-white/5 border-white/10 hover:bg-white/10"
                        : "bg-black/5 border-black/10 hover:bg-black/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {isDark ? <FiMoon className="size-4 text-primary" /> : <FiSun className="size-4 text-amber-500" />}
                      <span className="text-[10px] font-mono font-bold uppercase">{isDark ? "Dark" : "Light"}</span>
                    </div>
                    <span className="text-[11px] font-medium">Appearance</span>
                  </button>

                  {/* Desktop Icons Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowDesktopIcons((prev) => !prev)}
                    className={`p-2.5 rounded-xl border flex flex-col gap-1 text-left cursor-pointer transition-all ${
                      showDesktopIcons
                        ? "bg-primary/20 border-primary/40 text-primary"
                        : (isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-black/5 border-black/10 hover:bg-black/10")
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <FiEye className="size-4" />
                      <span className="text-[10px] font-mono font-bold uppercase">{showDesktopIcons ? "ON" : "OFF"}</span>
                    </div>
                    <span className="text-[11px] font-medium">Desktop Icons</span>
                  </button>
                </div>

                {/* Window Layout Mode Picker */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[11px] font-medium mb-1.5">
                    <span>Window Arrangement</span>
                    <span className="text-[10px] text-primary font-mono">{layoutMode}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { mode: "floating", label: "Float", icon: FiLayers },
                      { mode: "tiling-horizontal", label: "Cols", icon: FiColumns },
                      { mode: "tiling-vertical", label: "Rows", icon: FiMinus },
                      { mode: "tiling-grid", label: "Grid", icon: FiGrid },
                    ].map((l) => (
                      <button
                        key={l.mode}
                        type="button"
                        onClick={() => setLayoutMode(l.mode as LayoutMode)}
                        className={`p-1.5 rounded-lg border text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          layoutMode === l.mode
                            ? "bg-primary text-black border-primary font-bold shadow-sm"
                            : (isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-black/5 border-black/10 hover:bg-black/10")
                        }`}
                      >
                        <l.icon className="size-3" />
                        <span className="text-[9px]">{l.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Link to Full System Settings */}
                <button
                  type="button"
                  onClick={() => {
                    focusWindow("settings");
                    setShowControlCenter(false);
                  }}
                  className={`w-full py-1.5 px-2.5 rounded-xl border text-center font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                    isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-black/5 border-black/10 hover:bg-black/10"
                  }`}
                >
                  <FiSettings className="size-3 text-primary" />
                  <span>Open System Settings...</span>
                </button>
              </div>
            )}
          </div>

          <FiWifi className="size-3.5 hidden sm:inline" />
          <FiBatteryCharging className="size-3.5 text-emerald-400" />
          <span className={`font-mono text-[11px] ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>{time}</span>

          {/* Exit OS Button */}
          <button
            type="button"
            onClick={toggleOsMode}
            className="ml-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 border border-red-500/30 text-red-400 hover:bg-red-500/10"
            title="Exit Desktop OS & Return to Web Mode"
          >
            <span>Exit</span>
            <FiExternalLink className="size-3" />
          </button>
        </div>
      </header>

      {/* Desktop Canvas */}
      <main
        className="relative flex-1 p-4 sm:p-6 overflow-hidden"
        onClick={() => {
          setShowAppleMenu(false);
          setShowControlCenter(false);
          setShowLauncher(false);
          setContextMenu((prev) => ({ ...prev, visible: false }));
          setAppContextMenu((prev) => ({ ...prev, visible: false }));
        }}
      >
        {/* Desktop Application Icons (Can be toggled or hidden via showDesktopIcons setting) */}
        {showDesktopIcons && (
          <div className="grid grid-flow-col grid-rows-4 sm:grid-rows-6 gap-4 sm:gap-6 w-max animate-in fade-in duration-150">
            {(
              [
                { id: "about", label: "About.app", icon: FiUser, key: "1" },
                { id: "terminal", label: "Terminal.app", icon: FiTerminal, key: "2" },
                { id: "projects", label: "Projects.app", icon: FiFolder, key: "3" },
                { id: "blog", label: "Notes.app", icon: FiBookOpen, key: "4" },
                { id: "resume", label: "Resume.pdf", icon: FiFileText, key: "5" },
                { id: "settings", label: "Settings.app", icon: FiSettings, key: "6" },
                { id: "taskmanager", label: "Tasks.app", icon: FiActivity, key: "7" },
              ] as const
            )
              .filter((item) => desktopApps.includes(item.id))
              .map((item) => (
                <div key={item.id} className="relative group w-20">
                  <button
                    type="button"
                    onClick={() => focusWindow(item.id)}
                    onContextMenu={(e) => handleAppContextMenu(e, item.id)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors cursor-pointer w-full text-center ${
                      isDark ? "hover:bg-white/10" : "hover:bg-black/10"
                    }`}
                  >
                    <div
                      className="relative size-12 rounded-xl border flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform backdrop-blur-xs"
                      style={{
                        backgroundColor: isDark ? `${currentTheme.card}E6` : "rgba(255, 255, 255, 0.9)",
                        borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.12)",
                        color: currentTheme.primary,
                      }}
                    >
                      <item.icon className="size-6" />
                      <span className={`absolute bottom-0.5 right-1 text-[8px] font-mono opacity-60 group-hover:opacity-100 ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      }`}>
                        ⌥{item.key}
                      </span>
                    </div>
                    <span className={`text-[11px] font-mono drop-shadow-md truncate max-w-[76px] font-medium ${
                      isDark ? "text-zinc-200" : "text-zinc-900"
                    }`}>
                      {item.label}
                    </span>
                  </button>

                  {/* Subtle Hover Remove Shortcut Button on Desktop Icon */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDesktopShortcut(item.id);
                    }}
                    className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500/80 hover:bg-red-600 text-white text-[9px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer border border-white/20"
                    title={`Remove ${item.label} shortcut from desktop`}
                  >
                    ✕
                  </button>
                </div>
              ))}

            {/* Quick "Add App" Desktop Tile if any shortcuts are removed */}
            {desktopApps.length < 7 && (
              <button
                type="button"
                onClick={() => setShowLauncher(true)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border border-dashed hover:border-primary/50 transition-colors cursor-pointer group w-20 text-center ${
                  isDark ? "hover:bg-white/5 border-white/20" : "hover:bg-black/5 border-black/20"
                }`}
                title="Add Application Shortcut to Desktop"
              >
                <div className={`size-12 rounded-xl flex items-center justify-center group-hover:text-primary transition-colors ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  <FiPlus className="size-5" />
                </div>
                <span className={`text-[10px] font-mono ${
                  isDark ? "text-zinc-400 group-hover:text-zinc-200" : "text-zinc-600 group-hover:text-zinc-900"
                }`}>
                  + Add App
                </span>
              </button>
            )}
          </div>
        )}

        {/* Windows Rendering Layer */}

        {/* 1. About Window */}
        {windows.about.isOpen && (
          <div
            style={{
              ...getTilingStyle("about"),
              backgroundColor: isDark ? `${currentTheme.bg}F5` : "#ffffffF5",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            onClick={() => focusWindow("about")}
            className={`flex flex-col rounded-xl border shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden ${
              windows.about.isMinimized ? "hidden" : ""
            }`}
          >
            {renderTitleBar("about", `About — ${siteConfig.name}`)}

            <div className={`p-4 sm:p-6 overflow-y-auto space-y-4 text-xs leading-relaxed font-sans ${
              isDark ? "text-zinc-300" : "text-zinc-700"
            }`}>
              <div className={`flex items-center gap-4 border-b pb-4 ${isDark ? "border-white/10" : "border-black/10"}`}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    backgroundImage: `url('${heroConfig.avatar.src}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className={`shrink-0 size-14 rounded-xl border-2 border-primary/40 shadow-md ${
                    isDark ? "bg-[#272220]" : "bg-white"
                  }`}
                />
                <div>
                  <h3 className={`text-base font-bold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>{siteConfig.name}</h3>
                  <p className="text-primary font-mono text-xs font-medium">{siteConfig.role}</p>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    {siteConfig.location} · {siteConfig.availability}
                  </p>
                </div>
              </div>

              <div>
                <h4 className={`font-semibold mb-1 text-xs ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Architectural Philosophy</h4>
                <p className={isDark ? "text-zinc-300" : "text-zinc-700"}>{aboutConfig.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {aboutConfig.focus.map((f) => (
                  <div
                    key={f.title}
                    className="p-3 rounded-lg border space-y-1"
                    style={{
                      backgroundColor: isDark ? `${currentTheme.card}B3` : "rgba(255, 255, 255, 0.8)",
                      borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <span className="text-primary font-mono font-semibold text-[11px] block">
                      {f.title}
                    </span>
                    <p className={`text-[11px] leading-normal ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{f.description}</p>
                  </div>
                ))}
              </div>

              <div className={`border-t pt-3 ${isDark ? "border-white/10" : "border-black/10"}`}>
                <h4 className={`font-semibold mb-2 text-xs ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Technical Proficiency</h4>
                <div className="space-y-2">
                  {siteConfig.skills.map((c) => (
                    <div
                      key={c.title}
                      className="flex flex-col sm:flex-row sm:items-center gap-1.5 font-mono text-[11px]"
                    >
                      <span className={`w-28 shrink-0 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{c.title}:</span>
                      <div className="flex flex-wrap gap-1">
                        {c.skills.map((s) => (
                          <span
                            key={s.name}
                            className={`px-1.5 py-0.2 rounded border text-[10px] ${
                              isDark
                                ? "bg-black/40 text-zinc-300 border-white/5"
                                : "bg-black/5 text-zinc-800 border-black/10"
                            }`}
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Embedded Terminal Window */}
        {windows.terminal.isOpen && (
          <div
            style={{
              ...getTilingStyle("terminal"),
              backgroundColor: isDark ? "#1c1917" : "#24292e",
              borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.15)",
            }}
            onClick={() => focusWindow("terminal")}
            className={`flex flex-col rounded-xl border shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden ${
              windows.terminal.isMinimized ? "hidden" : ""
            }`}
          >
            {renderTitleBar("terminal", `${siteConfig.github.username}@carbon-shell — bash`)}

            <div className="flex-1 min-h-[300px] overflow-hidden">
              <TerminalModal isEmbedded={true} defaultOpen={true} />
            </div>
          </div>
        )}

        {/* 3. Projects Window */}
        {windows.projects.isOpen && (
          <div
            style={{
              ...getTilingStyle("projects"),
              backgroundColor: isDark ? `${currentTheme.bg}F5` : "#ffffffF5",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            onClick={() => focusWindow("projects")}
            className={`flex flex-col rounded-xl border shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden ${
              windows.projects.isMinimized ? "hidden" : ""
            }`}
          >
            {renderTitleBar(
              "projects",
              `Repositories & Highlighted Engineering Projects (${siteConfig.featuredProjects.length})`,
            )}

            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5">
              {siteConfig.featuredProjects.map((p) => (
                <div
                  key={p.title}
                  className="p-3.5 rounded-lg border space-y-2 hover:border-primary/50 transition-colors"
                  style={{
                    backgroundColor: isDark ? `${currentTheme.card}CC` : "rgba(255, 255, 255, 0.9)",
                    borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-semibold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>{p.title}</h4>
                      {p.featured && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-primary/20 text-primary border border-primary/30 font-bold uppercase">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {p.stars !== undefined && p.stars > 0 && (
                        <span className="text-[11px] font-mono text-primary font-bold">
                          ★ {p.stars}
                        </span>
                      )}
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`p-1 transition-colors ${isDark ? "text-zinc-400 hover:text-zinc-100" : "text-zinc-500 hover:text-zinc-950"}`}
                          title="View on GitHub"
                        >
                          <FiGithub className="size-3.5" />
                        </a>
                      )}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:opacity-80 p-1"
                          title="Live Demo"
                        >
                          <FiExternalLink className="size-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.techStack.map((tech) => (
                      <span
                        key={tech}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                          isDark
                            ? "bg-black/40 text-zinc-400 border-white/5"
                            : "bg-black/5 text-zinc-700 border-black/10"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Blog Notes Window */}
        {windows.blog.isOpen && (
          <div
            style={{
              ...getTilingStyle("blog"),
              backgroundColor: isDark ? `${currentTheme.bg}F5` : "#ffffffF5",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            onClick={() => focusWindow("blog")}
            className={`flex flex-col rounded-xl border shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden ${
              windows.blog.isMinimized ? "hidden" : ""
            }`}
          >
            {renderTitleBar("blog", "Engineering Notes & Articles")}

            <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
              {[
                {
                  title: "Anatomy of a File System Race Condition",
                  slug: "anatomy-of-a-file-system-race-condition",
                  date: "Nov 10, 2026",
                  readTime: "8 min read",
                  tags: ["Systems", "Linux", "Concurrency"],
                },
                {
                  title: "Myers Diff Algorithm in Deep Dive",
                  slug: "myers-diff-algorithm",
                  date: "Oct 24, 2026",
                  readTime: "12 min read",
                  tags: ["Algorithms", "Git", "Graph Theory"],
                },
                {
                  title: "DSA Sheet 2027: Systems & Algorithmic Patterns",
                  slug: "dsa-sheet-2027",
                  date: "Sep 15, 2026",
                  readTime: "15 min read",
                  tags: ["LeetCode", "Data Structures", "C++20"],
                },
                {
                  title: "Building a Config-Driven Developer Portfolio",
                  slug: "building-a-config-driven-portfolio",
                  date: "Aug 20, 2026",
                  readTime: "6 min read",
                  tags: ["Architecture", "Next.js", "TypeScript"],
                },
                {
                  title: "Understanding Algorithms in Production Systems",
                  slug: "understanding-algorithms-in-practice",
                  date: "Jul 12, 2026",
                  readTime: "7 min read",
                  tags: ["Optimization", "Storage", "Performance"],
                },
              ].map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="block p-3.5 rounded-lg border hover:border-primary/50 transition-colors group"
                  style={{
                    backgroundColor: isDark ? `${currentTheme.card}CC` : "rgba(255, 255, 255, 0.9)",
                    borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold group-hover:text-primary transition-colors ${
                      isDark ? "text-zinc-100" : "text-zinc-900"
                    }`}>
                      {article.title}
                    </p>
                    <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                      {article.readTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 font-mono text-[10px]">
                    <span className={isDark ? "text-zinc-500" : "text-zinc-600"}>{article.date}</span>
                    <span className="text-zinc-400">•</span>
                    <div className="flex gap-1">
                      {article.tags.map((t) => (
                        <span
                          key={t}
                          className={`px-1 py-0.2 rounded border ${
                            isDark
                              ? "bg-black/40 text-primary border-primary/20"
                              : "bg-primary/10 text-primary border-primary/30"
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 5. Resume Window */}
        {windows.resume.isOpen && (
          <div
            style={{
              ...getTilingStyle("resume"),
              backgroundColor: isDark ? `${currentTheme.bg}F5` : "#ffffffF5",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            onClick={() => focusWindow("resume")}
            className={`flex flex-col rounded-xl border shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden ${
              windows.resume.isMinimized ? "hidden" : ""
            }`}
          >
            {renderTitleBar("resume", "Resume Preview (PDF) — Sagar Kumar Jha")}

            <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
              <ResumePdfViewer />
            </div>
          </div>
        )}

        {/* 6. Settings Window */}
        {windows.settings.isOpen && (
          <div
            style={{
              ...getTilingStyle("settings"),
              backgroundColor: isDark ? `${currentTheme.bg}F8` : "#ffffffF8",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            onClick={() => focusWindow("settings")}
            className={`flex flex-col rounded-xl border shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden ${
              windows.settings.isMinimized ? "hidden" : ""
            }`}
          >
            {renderTitleBar("settings", "Settings & Personalization")}

            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs font-mono">
              {/* OS Theme selection section */}
              <div>
                <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                  <FiDroplet className="text-primary size-4" />
                  <span>Desktop OS Themes</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(Object.keys(OS_THEMES) as OsThemeKey[]).map((key) => {
                    const t = OS_THEMES[key];
                    const active = osTheme === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setOsTheme(key)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col gap-1.5 ${
                          active ? "border-primary ring-2 ring-primary/40 shadow-lg" : "border-white/10"
                        }`}
                        style={{ backgroundColor: t.card }}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-bold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>{t.name}</span>
                          {active && <FiCheck className="size-3 text-primary" />}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="size-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: t.bg }}
                          />
                          <span
                            className="size-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: t.primary }}
                          />
                          <span
                            className="size-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: t.accent }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>



              {/* Desktop Icons & Visibility Setting */}
              <div className={`border-t pt-4 ${isDark ? "border-white/10" : "border-black/10"}`}>
                <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                  <FiEye className="text-primary size-4" />
                  <span>Desktop Applications Visibility</span>
                </h4>
                <div className="flex items-center justify-between p-3 rounded-xl border"
                  style={{
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div>
                    <span className={`font-medium block text-xs ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Show Desktop Application Shortcuts</span>
                    <span className={`text-[10px] ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Toggle whether app icons and files appear directly on the desktop canvas</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDesktopIcons((prev) => !prev)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      showDesktopIcons
                        ? "bg-primary text-black font-bold"
                        : (isDark ? "bg-white/10 text-zinc-400 hover:text-zinc-200" : "bg-black/10 text-zinc-600 hover:text-zinc-900")
                    }`}
                  >
                    {showDesktopIcons ? "Visible (On)" : "Hidden (Off)"}
                  </button>
                </div>
              </div>

              {/* Tiling mode preference */}
              <div className={`border-t pt-4 ${isDark ? "border-white/10" : "border-black/10"}`}>
                <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                  <FiSliders className="text-primary size-4" />
                  <span>Window Manager Layout (Hyprland / i3)</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    { mode: "floating", label: "Floating Mode (Free Drag)", key: "Alt+F" },
                    { mode: "tiling-horizontal", label: "Horizontal Columns", key: "Alt+H" },
                    { mode: "tiling-vertical", label: "Vertical Rows", key: "Alt+V" },
                    { mode: "tiling-grid", label: "2x2 Tiling Grid", key: "Alt+G" },
                  ].map((l) => (
                    <button
                      key={l.mode}
                      type="button"
                      onClick={() => setLayoutMode(l.mode as LayoutMode)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                        layoutMode === l.mode
                          ? "bg-primary/20 border-primary text-primary"
                          : (isDark ? "border-white/10 text-zinc-300 hover:bg-white/5" : "border-black/10 text-zinc-700 hover:bg-black/5")
                      }`}
                      style={{
                        backgroundColor: layoutMode === l.mode ? `${currentTheme.primary}20` : undefined,
                      }}
                    >
                      <span>{l.label}</span>
                      <kbd className={`px-1 py-0.5 rounded text-[9px] ${isDark ? "bg-black/40 text-zinc-400" : "bg-black/5 text-zinc-600"}`}>
                        {l.key}
                      </kbd>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keyboard Shortcuts Reference */}
              <div className={`border-t pt-4 text-[11px] space-y-1.5 ${isDark ? "border-white/10 text-zinc-400" : "border-black/10 text-zinc-600"}`}>
                <span className={`font-semibold block ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Quick Keyboard Shortcuts:</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                  <div>
                    <kbd className={isDark ? "text-zinc-200" : "text-zinc-900"}>Alt + Space</kbd>: Spotlight App Launcher
                  </div>
                  <div>
                    <kbd className={isDark ? "text-zinc-200" : "text-zinc-900"}>Alt + Tab</kbd>: Cycle Open Windows
                  </div>
                  <div>
                    <kbd className={isDark ? "text-zinc-200" : "text-zinc-900"}>Alt + M</kbd>: Toggle Maximize
                  </div>
                  <div>
                    <kbd className={isDark ? "text-zinc-200" : "text-zinc-900"}>ESC</kbd>: Close Active Window / Menus
                  </div>
                  <div>
                    <kbd className={isDark ? "text-zinc-200" : "text-zinc-900"}>Alt + 1..7</kbd>: Direct App Launchers
                  </div>
                  <div>
                    <kbd className={isDark ? "text-zinc-200" : "text-zinc-900"}>Alt + H/V/G/F</kbd>: Hyprland Tiling
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. Task Manager Window */}
        {windows.taskmanager.isOpen && (
          <div
            style={{
              ...getTilingStyle("taskmanager"),
              backgroundColor: isDark ? `${currentTheme.bg}F8` : "#ffffffF8",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            onClick={() => focusWindow("taskmanager")}
            className={`flex flex-col rounded-xl border shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden ${
              windows.taskmanager.isMinimized ? "hidden" : ""
            }`}
          >
            {renderTitleBar("taskmanager", "Task Manager & System Resources")}

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 font-mono text-xs">
              {/* CPU & Memory Gauges */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg border space-y-2 ${isDark ? "bg-black/40 border-white/10" : "bg-black/5 border-black/10"}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>CPU UTILIZATION</span>
                    <span className="text-emerald-400 font-bold">{Math.round(cpuUsage)}%</span>
                  </div>
                  <div className="w-full h-2 rounded bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-300"
                      style={{ width: `${cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div className={`p-3 rounded-lg border space-y-2 ${isDark ? "bg-black/40 border-white/10" : "bg-black/5 border-black/10"}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>MEMORY IN USE</span>
                    <span className="text-primary font-bold">{memUsage.toFixed(1)} GB / 16 GB</span>
                  </div>
                  <div className="w-full h-2 rounded bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${(memUsage / 16) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Running Processes Table */}
              <div>
                <h4 className={`font-semibold mb-2 text-[11px] ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Active Window Processes</h4>
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className={`border-b text-[10px] ${isDark ? "bg-black/60 text-zinc-400 border-white/10" : "bg-black/10 text-zinc-700 border-black/10"}`}>
                      <tr>
                        <th className="p-2">APP / PROCESS</th>
                        <th className="p-2">STATUS</th>
                        <th className="p-2">MEMORY</th>
                        <th className="p-2 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {windowList.map((w) => (
                        <tr key={w.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-2 flex items-center gap-2">
                            <w.icon className="size-3.5 text-primary" />
                            <span className={`font-medium ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>{w.title}</span>
                          </td>
                          <td className="p-2">
                            {w.isOpen ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400">
                                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Running
                              </span>
                            ) : (
                              <span className="text-zinc-500">Stopped</span>
                            )}
                          </td>
                          <td className={`p-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            {w.isOpen ? `${Math.floor(Math.random() * 40 + 30)} MB` : "—"}
                          </td>
                          <td className="p-2 text-right">
                            {w.isOpen ? (
                              <button
                                type="button"
                                onClick={(e) => closeWindow(w.id, e)}
                                className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 text-[10px] cursor-pointer"
                              >
                                End Task
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => focusWindow(w.id)}
                                className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/30 text-[10px] cursor-pointer"
                              >
                                Start
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Context Menu (Right Click on Empty Desktop) */}
        {contextMenu.visible && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y}px`,
              backgroundColor: currentTheme.card,
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            className={`fixed z-50 w-52 rounded-xl border p-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 font-mono text-xs ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
          >
            <div className={`px-2.5 py-1 text-[10px] uppercase font-semibold border-b mb-1 ${isDark ? "text-zinc-400 border-white/10" : "text-zinc-600 border-black/10"}`}>
              Desktop
            </div>
            <button
              type="button"
              onClick={() => {
                focusWindow("terminal");
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
            >
              <FiTerminal className="size-3.5 text-primary" />
              <span>Open Terminal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLauncher(true);
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
            >
              <FiCommand className="size-3.5 text-primary" />
              <span>Launch Application</span>
            </button>
            <button
              type="button"
              onClick={() => {
                focusWindow("settings");
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${
                isDark ? "hover:bg-white/10" : "hover:bg-black/5"
              }`}
            >
              <FiSettings className="size-3.5 text-primary" />
              <span>Settings & Themes</span>
            </button>
            <button
              type="button"
              onClick={() => {
                focusWindow("taskmanager");
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
            >
              <FiActivity className="size-3.5 text-emerald-400" />
              <span>Task Manager</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDesktopIcons((prev) => !prev);
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
            >
              <div className="flex items-center gap-2">
                <FiEye className="size-3.5 text-primary" />
                <span>{showDesktopIcons ? "Hide Desktop Icons" : "Show Desktop Icons"}</span>
              </div>
              {showDesktopIcons && <FiCheck className="size-3 text-primary" />}
            </button>
            <button
              type="button"
              onClick={() => {
                resetDesktopShortcuts();
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
            >
              <FiRotateCcw className="size-3.5 text-zinc-400" />
              <span>Reset Desktop Icons</span>
            </button>
            <div className={`my-1 border-t ${isDark ? "border-white/10" : "border-black/10"}`} />
            <button
              type="button"
              onClick={() => {
                setLayoutMode((prev) => (prev === "tiling-grid" ? "floating" : "tiling-grid"));
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
            >
              <FiGrid className="size-3.5 text-primary" />
              <span>Toggle Tile Grid</span>
            </button>
            <button
              type="button"
              onClick={() => {
                toggleOsMode();
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors flex items-center gap-2 text-red-400 cursor-pointer"
            >
              <FiExternalLink className="size-3.5" />
              <span>Exit Desktop OS</span>
            </button>
          </div>
        )}

        {/* Application Specific Context Menu (Right Click on App Icon or Dock) */}
        {appContextMenu.visible && appContextMenu.windowId && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              left: `${appContextMenu.x}px`,
              top: `${appContextMenu.y}px`,
              backgroundColor: currentTheme.card,
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            className={`fixed z-50 w-52 rounded-xl border p-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 font-mono text-xs ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
          >
            <div className={`flex items-center gap-2 px-2.5 py-1 text-[10px] uppercase font-semibold border-b mb-1 ${isDark ? "text-zinc-400 border-white/10" : "text-zinc-600 border-black/10"}`}>
              <span>{windows[appContextMenu.windowId].title}</span>
            </div>

            {/* Open / Focus */}
            <button
              type="button"
              onClick={() => {
                if (appContextMenu.windowId) focusWindow(appContextMenu.windowId);
                setAppContextMenu((prev) => ({ ...prev, visible: false }));
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
            >
              <FiEye className="size-3.5 text-primary" />
              <span>
                {windows[appContextMenu.windowId].isOpen &&
                !windows[appContextMenu.windowId].isMinimized
                  ? "Focus Window"
                  : "Open Application"}
              </span>
            </button>

            {/* Minimize / Restore if running */}
            {windows[appContextMenu.windowId].isOpen && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (appContextMenu.windowId) {
                      if (windows[appContextMenu.windowId].isMinimized) {
                        focusWindow(appContextMenu.windowId);
                      } else {
                        minimizeWindow(appContextMenu.windowId);
                      }
                    }
                    setAppContextMenu((prev) => ({ ...prev, visible: false }));
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                >
                  <FiMinimize className="size-3.5 text-yellow-400" />
                  <span>
                    {windows[appContextMenu.windowId].isMinimized ? "Restore" : "Minimize"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (appContextMenu.windowId) toggleMaximize(appContextMenu.windowId);
                    setAppContextMenu((prev) => ({ ...prev, visible: false }));
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                >
                  <FiMaximize2 className="size-3.5 text-emerald-400" />
                  <span>
                    {windows[appContextMenu.windowId].isMaximized ? "Restore Size" : "Maximize"}
                  </span>
                </button>
              </>
            )}

            {/* Remove / Add Desktop Shortcut */}
            <div className={`my-1 border-t ${isDark ? "border-white/10" : "border-black/10"}`} />
            {desktopApps.includes(appContextMenu.windowId) ? (
              <button
                type="button"
                onClick={() => {
                  if (appContextMenu.windowId) removeDesktopShortcut(appContextMenu.windowId);
                  setAppContextMenu((prev) => ({ ...prev, visible: false }));
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${isDark ? "hover:bg-white/10 text-zinc-300" : "hover:bg-black/5 text-zinc-700"}`}
              >
                <FiTrash2 className="size-3.5 text-zinc-400" />
                <span>Remove Shortcut</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (appContextMenu.windowId) addDesktopShortcut(appContextMenu.windowId);
                  setAppContextMenu((prev) => ({ ...prev, visible: false }));
                }}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-white/10 text-primary transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FiPlus className="size-3.5" />
                <span>Add to Desktop</span>
              </button>
            )}

            {/* Close / Quit Application */}
            {windows[appContextMenu.windowId].isOpen ? (
              <button
                type="button"
                onClick={(e) => {
                  if (appContextMenu.windowId) closeWindow(appContextMenu.windowId, e);
                  setAppContextMenu((prev) => ({ ...prev, visible: false }));
                }}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FiX className="size-3.5" />
                <span>Quit / Close</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (appContextMenu.windowId) focusWindow(appContextMenu.windowId);
                  setAppContextMenu((prev) => ({ ...prev, visible: false }));
                }}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-emerald-500/20 text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FiPlay className="size-3.5" />
                <span>Launch Process</span>
              </button>
            )}
          </div>
        )}

        {/* Quick App Launcher Modal (Spotlight / Raycast style) */}
        {showLauncher && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm animate-in fade-in duration-100 p-4"
          >
            <div
              className="w-full max-w-lg rounded-2xl border shadow-2xl p-4 font-mono overflow-hidden flex flex-col gap-3"
              style={{
                backgroundColor: currentTheme.card,
                borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
              }}
            >
              {/* Launcher Header & Live Search Bar */}
              <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs ${isDark ? "bg-black/40 border-white/10" : "bg-black/5 border-black/10"}`}>
                <FiSearch className="size-4 text-primary shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={launcherSearch}
                  onChange={(e) => setLauncherSearch(e.target.value)}
                  placeholder="Search applications, tools, system specs (Alt+Space)..."
                  className={`w-full bg-transparent border-0 outline-none font-mono text-xs focus:ring-0 p-0 ${isDark ? "text-zinc-100 placeholder:text-zinc-500" : "text-zinc-900 placeholder:text-zinc-400"}`}
                />
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-zinc-400 shrink-0">
                  ESC
                </kbd>
              </div>

              {/* Grid of Applications filtered by search */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[360px] overflow-y-auto p-1">
                {(
                  [
                    {
                      id: "about",
                      label: "About Me",
                      sub: "Profile & Skills",
                      icon: FiUser,
                      key: "1",
                    },
                    {
                      id: "terminal",
                      label: "Terminal",
                      sub: "Interactive Shell",
                      icon: FiTerminal,
                      key: "2",
                    },
                    {
                      id: "projects",
                      label: "Projects",
                      sub: "Featured Repos",
                      icon: FiFolder,
                      key: "3",
                    },
                    {
                      id: "blog",
                      label: "Articles",
                      sub: "Technical Notes",
                      icon: FiBookOpen,
                      key: "4",
                    },
                    {
                      id: "resume",
                      label: "Resume",
                      sub: "PDF Previewer",
                      icon: FiFileText,
                      key: "5",
                    },
                    {
                      id: "settings",
                      label: "Settings",
                      sub: "Themes & Layout",
                      icon: FiSettings,
                      key: "6",
                    },
                    {
                      id: "taskmanager",
                      label: "Tasks",
                      sub: "Process Monitor",
                      icon: FiActivity,
                      key: "7",
                    },
                  ] as const
                )
                  .filter((app) => {
                    const q = launcherSearch.toLowerCase().trim();
                    if (!q) return true;
                    return (
                      app.label.toLowerCase().includes(q) ||
                      app.sub.toLowerCase().includes(q) ||
                      app.id.toLowerCase().includes(q)
                    );
                  })
                  .map((app) => (
                    <div
                      key={app.id}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border border-transparent transition-all group relative text-center ${isDark ? "hover:bg-white/10 hover:border-white/10" : "hover:bg-black/5 hover:border-black/10"}`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          focusWindow(app.id);
                          setShowLauncher(false);
                          setLauncherSearch("");
                        }}
                        className="flex flex-col items-center gap-1.5 w-full cursor-pointer"
                      >
                        <div
                          className="size-11 rounded-xl flex items-center justify-center border shadow-sm group-hover:scale-105 transition-transform"
                          style={{
                            backgroundColor: `${currentTheme.bg}CC`,
                            borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
                            color: currentTheme.primary,
                          }}
                        >
                          <app.icon className="size-5" />
                        </div>
                        <span className={`text-[11px] font-semibold truncate w-full ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                          {app.label}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-mono">Alt+{app.key}</span>
                      </button>

                      {/* Desktop shortcut pin toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (desktopApps.includes(app.id)) {
                            removeDesktopShortcut(app.id);
                          } else {
                            addDesktopShortcut(app.id);
                          }
                        }}
                        className={`text-[9px] px-1.5 py-0.5 rounded transition-colors cursor-pointer border ${
                          desktopApps.includes(app.id)
                            ? "bg-white/5 border-white/10 text-zinc-400 hover:text-red-400 hover:border-red-400/40"
                            : "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                        }`}
                        title={
                          desktopApps.includes(app.id)
                            ? "Remove from desktop"
                            : "Add shortcut to desktop"
                        }
                      >
                        {desktopApps.includes(app.id) ? "On Desktop (✕)" : "+ Desktop"}
                      </button>
                    </div>
                  ))}
              </div>

              {/* Launcher Footer Info */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-zinc-500 font-mono px-1">
                <span>Select app or press Alt+1..7</span>
                <span>Carbon OS v2.0</span>
              </div>
            </div>
          </div>
        )}

        {/* Alt+Tab Quick Switcher Overlay */}
        {showSwitcher && openWindows.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
              className="flex items-center gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl"
              style={{
                backgroundColor: `${currentTheme.card}F2`,
                borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
              }}
            >
              {openWindows.map((w) => (
                <div
                  key={w.id}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl min-w-[80px] transition-all ${
                    activeWindow === w.id
                      ? "border scale-105"
                      : "bg-white/5 border border-transparent"
                  }`}
                  style={{
                    backgroundColor: activeWindow === w.id ? `${currentTheme.primary}25` : undefined,
                    borderColor: activeWindow === w.id ? currentTheme.primary : "transparent",
                    color: activeWindow === w.id ? currentTheme.primary : "#a1a1aa",
                  }}
                >
                  <w.icon className="size-8" />
                  <span className="text-[11px] font-mono text-zinc-200 truncate max-w-[80px]">
                    {w.title.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Floating Dock */}
      <footer className="h-16 w-full flex items-center justify-center pb-2 z-50 pointer-events-auto">
        <div
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border backdrop-blur-xl shadow-2xl"
          style={{
            backgroundColor: isDark ? `${currentTheme.card}E6` : "rgba(255, 255, 255, 0.92)",
            borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.12)",
          }}
        >
          {(
            [
              { id: "about", label: "About", icon: FiUser },
              { id: "terminal", label: "Terminal", icon: FiTerminal },
              { id: "projects", label: "Projects", icon: FiFolder },
              { id: "blog", label: "Notes", icon: FiBookOpen },
              { id: "resume", label: "Resume", icon: FiFileText },
              { id: "settings", label: "Settings", icon: FiSettings },
              { id: "taskmanager", label: "Tasks", icon: FiActivity },
            ] as const
          ).map((item) => {
            const w = windows[item.id];
            const isRunning = w.isOpen;
            const isFocused = activeWindow === item.id && !w.isMinimized && w.isOpen;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleWindow(item.id)}
                onContextMenu={(e) => handleAppContextMenu(e, item.id)}
                className={`group relative flex flex-col items-center justify-center size-11 rounded-xl transition-all hover:scale-115 active:scale-95 cursor-pointer ${
                  isFocused ? "border" : (isDark ? "hover:bg-white/10 text-zinc-300" : "hover:bg-black/5 text-zinc-700")
                }`}
                style={{
                  backgroundColor: isFocused ? `${currentTheme.primary}25` : undefined,
                  borderColor: isFocused ? currentTheme.primary : "transparent",
                  color: isFocused ? currentTheme.primary : undefined,
                }}
                title={item.label}
              >
                <item.icon className="size-5 transition-transform group-hover:-translate-y-0.5" />
                {isRunning && (
                  <span
                    className="size-1 rounded-full absolute bottom-1"
                    style={{
                      backgroundColor: isFocused ? currentTheme.primary : "#a1a1aa",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
