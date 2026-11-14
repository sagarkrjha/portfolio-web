"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiActivity,
  FiAward,
  FiBatteryCharging,
  FiBookOpen,
  FiCheck,
  FiClock,
  FiCode,
  FiColumns,
  FiCommand,
  FiCpu,
  FiDroplet,
  FiExternalLink,
  FiEye,
  FiFileText,
  FiFolder,
  FiGithub,
  FiGlobe,
  FiGrid,
  FiLayers,
  FiMaximize2,
  FiMessageSquare,
  FiMinimize,
  FiMinimize2,
  FiMinus,
  FiMoon,
  FiPlay,
  FiPlus,
  FiRefreshCw,
  FiRotateCcw,
  FiSearch,
  FiSettings,
  FiSliders,
  FiSquare,
  FiSun,
  FiTerminal,
  FiTrash2,
  FiUser,
  FiVolume2,
  FiWifi,
  FiX,
  FiPower,
  FiCopy,
  FiShare2,
} from "react-icons/fi";
import { AboutView } from "@/components/app-components/about";
import { BlogReaderView } from "@/components/app-components/blog";
import { MessagesApp } from "@/components/app-components/messages";
import { ResumePdfViewer } from "@/components/app-components/resume";
import TerminalModal from "@/components/app-components/terminal/terminal";
import { useOsMode } from "@/components/providers";
import { aboutConfig, blogConfig, heroConfig, siteConfig, themeConfig } from "@/lib/config";
import type { OsThemeColors, OsThemeKey } from "@/lib/config";
import cachedData from "@/lib/generated/portfolio-data.json";
import { formatBlogDate } from "@/lib/utils";

export type WindowId =
  | "about"
  | "terminal"
  | "projects"
  | "blog"
  | "reader"
  | "resume"
  | "settings"
  | "taskmanager"
  | "browser"
  | "messages";

export type LayoutMode = "floating" | "tiling-horizontal" | "tiling-vertical" | "tiling-grid";
export type WallpaperKey = "hero";
export type { OsThemeKey };

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

const OS_THEMES = themeConfig.osThemes;

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
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);
  const [topZ, setTopZ] = useState(100);
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>("floating");
  const [osTheme, setOsThemeState] = useState<OsThemeKey>(themeConfig.defaultOsTheme);
  const [showDesktopIcons, setShowDesktopIconsState] = useState<boolean>(true);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);
  const [showAddAppPicker, setShowAddAppPicker] = useState(false);
  const [launcherSearch, setLauncherSearch] = useState("");
  const [activeSpace, setActiveSpace] = useState<number>(0);
  const [isMissionControl, setIsMissionControl] = useState(false);
  const [minimizeEffect, setMinimizeEffect] = useState<"genie" | "scale">("genie");

  const handleExitOs = () => {
    toggleOsMode();
  };

  // Customizable Desktop Shortcuts list from central config
  const [desktopApps, setDesktopApps] = useState<WindowId[]>(
    themeConfig.defaultDesktopApps as WindowId[],
  );

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
      if (savedTheme && savedTheme in OS_THEMES) {
        setOsThemeState(savedTheme);
      }
      const savedLayout = localStorage.getItem("portfolio_layout_mode") as LayoutMode | null;
      if (
        savedLayout &&
        ["floating", "tiling-horizontal", "tiling-vertical", "tiling-grid"].includes(savedLayout)
      ) {
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
    saveDesktopApps(themeConfig.defaultDesktopApps as WindowId[]);
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
    selectedText?: string;
    contextType?: "app" | "window" | "blog" | "project" | "text";
    metaTitle?: string;
    metaSlug?: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    windowId: null,
  });

  // Simulated system task metrics
  const [cpuUsage, setCpuUsage] = useState(14);
  const [memUsage, setMemUsage] = useState(2.4);

  // Dragging & Resizing state
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

  const resizeRef = useRef<{
    windowId: WindowId | null;
    direction: "e" | "w" | "s" | "n" | "se" | "sw" | "ne" | "nw" | null;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  }>({
    windowId: null,
    direction: null,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    origW: 0,
    origH: 0,
  });

  const [windows, setWindows] = useState<Record<WindowId, WindowState>>({
    about: {
      id: "about",
      title: "About Sagar",
      icon: FiUser,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
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
      zIndex: 20,
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
      zIndex: 30,
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
      zIndex: 40,
      position: { x: 160, y: 50 },
      size: { width: 700, height: 520 },
    },
    reader: {
      id: "reader",
      title: "Article Reader (Markdown)",
      icon: FiFileText,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 45,
      position: { x: 90, y: 30 },
      size: { width: 880, height: 620 },
    },
    resume: {
      id: "resume",
      title: "Resume (PDF)",
      icon: FiFileText,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 50,
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
      zIndex: 60,
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
      zIndex: 70,
      position: { x: 150, y: 70 },
      size: { width: 640, height: 460 },
    },
    browser: {
      id: "browser",
      title: "Safari Preview (Interactive)",
      icon: FiGlobe,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 80,
      position: { x: 70, y: 35 },
      size: { width: 840, height: 600 },
    },
    messages: {
      id: "messages",
      title: "Messages (Sequoia Motion Typography)",
      icon: FiMessageSquare,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 85,
      position: { x: 130, y: 55 },
      size: { width: 580, height: 530 },
    },
  });

  // Browser state for interactive iframes
  const [browserUrl, setBrowserUrl] = useState("https://sagarkrjha.vercel.app");
  const [browserTitle, setBrowserTitle] = useState("Live Project Demo");
  const [inputUrl, setInputUrl] = useState("https://sagarkrjha.vercel.app");

  // Separate dedicated Reader Window state
  const [activeArticleSlug, setActiveArticleSlug] = useState<string>("dsa-sheet-2027");
  const [activeArticleTitle, setActiveArticleTitle] = useState<string>(
    "Data Structures & Algorithmic Patterns",
  );

  // Track if user is actively dragging or resizing a window (to disable transition smoothing during gestures)
  const [isInteracting, setIsInteracting] = useState(false);

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
      // Ensure active/system windows receive guaranteed highest stacking priority
      const boost = id === "settings" || id === "taskmanager" ? 10 : 2;
      const nextZ = prev + boost;
      setWindows((wPrev) => {
        const cur = wPrev[id];
        // Ensure settings window has safe visible coordinates
        let posX = cur.position.x;
        let posY = cur.position.y;
        if (id === "settings" && (posX < 20 || posY < 20 || posX > 600 || posY > 400)) {
          posX = 140;
          posY = 50;
        }
        return {
          ...wPrev,
          [id]: {
            ...cur,
            isOpen: true,
            isMinimized: false,
            position: { x: posX, y: posY },
            zIndex: nextZ,
          },
        };
      });
      return nextZ;
    });
    setActiveWindow(id);
  }, []);

  const openInBrowser = useCallback(
    (url: string, title?: string) => {
      setBrowserUrl(url);
      setInputUrl(url);
      if (title) setBrowserTitle(title);
      focusWindow("browser");
    },
    [focusWindow],
  );

  const openInReader = useCallback(
    (slug: string, title: string) => {
      setActiveArticleSlug(slug);
      setActiveArticleTitle(title);
      focusWindow("reader");
    },
    [focusWindow],
  );

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
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

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
        if (showControlCenter) {
          setShowControlCenter(false);
          return;
        }
        if (showLauncher) {
          setShowLauncher(false);
          return;
        }
        if (showAddAppPicker) {
          setShowAddAppPicker(false);
          return;
        }
        if (isMissionControl) {
          setIsMissionControl(false);
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

      // 4. Alt+Q: Clean Shut Down Carbon OS & Return to Web Mode (avoiding browser Cmd/Ctrl+Q conflicts)
      if (e.altKey && !e.ctrlKey && !e.shiftKey && (e.key === "q" || e.key === "Q")) {
        e.preventDefault();
        handleExitOs();
        return;
      }

      // 5. Alt+W: Close active window
      if (e.altKey && !e.ctrlKey && !e.shiftKey && (e.key === "w" || e.key === "W")) {
        e.preventDefault();
        if (activeWindow) closeWindow(activeWindow);
        return;
      }

      // Only check non-input shortcuts below
      if (isInput) return;

      // 6. Alt + 1..0: Quick App Launcher shortcuts
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const appKeys: Record<string, WindowId> = {
          "1": "about",
          "2": "terminal",
          "3": "projects",
          "4": "blog",
          "5": "reader",
          "6": "resume",
          "7": "settings",
          "8": "taskmanager",
          "9": "browser",
          "0": "messages",
        };
        if (appKeys[e.key]) {
          e.preventDefault();
          toggleWindow(appKeys[e.key]);
          return;
        }
      }

      // 7. Alt + M: Toggle Window Maximize / Restore
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && (e.key === "m" || e.key === "M")) {
        e.preventDefault();
        if (activeWindow) toggleMaximize(activeWindow);
        return;
      }

      // 8. Ctrl + Up / Alt + Up: Mission Control
      if ((e.ctrlKey || e.altKey) && e.key === "ArrowUp") {
        e.preventDefault();
        setIsMissionControl((prev) => !prev);
        return;
      }

      // 9. Ctrl + Left / Right: Switch Spaces
      if ((e.ctrlKey || e.altKey) && e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveSpace((prev) => (prev > 0 ? prev - 1 : 2));
        return;
      }
      if ((e.ctrlKey || e.altKey) && e.key === "ArrowRight") {
        e.preventDefault();
        setActiveSpace((prev) => (prev < 2 ? prev + 1 : 0));
        return;
      }

      // 10. Floating window shortcut: Alt+F (center/focus)
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        if (activeWindow) focusWindow(activeWindow);
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
    setIsInteracting(true);
    dragRef.current = {
      windowId: id,
      startX: e.clientX,
      startY: e.clientY,
      origX: windows[id].position.x,
      origY: windows[id].position.y,
    };
  };

  // Window Resize Handlers
  const handleMouseDownResize = (
    e: React.MouseEvent,
    id: WindowId,
    direction: "e" | "w" | "s" | "n" | "se" | "sw" | "ne" | "nw",
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (layoutMode !== "floating" || windows[id].isMaximized) return;
    focusWindow(id);
    setIsInteracting(true);
    resizeRef.current = {
      windowId: id,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      origX: windows[id].position.x,
      origY: windows[id].position.y,
      origW: windows[id].size.width,
      origH: windows[id].size.height,
    };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // 1. Handle Dragging
    if (dragRef.current.windowId) {
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
      return;
    }

    // 2. Handle Resizing
    if (resizeRef.current.windowId && resizeRef.current.direction) {
      const { windowId, direction, startX, startY, origX, origY, origW, origH } = resizeRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const MIN_WIDTH = 340;
      const MIN_HEIGHT = 220;

      let newX = origX;
      let newY = origY;
      let newW = origW;
      let newH = origH;

      if (direction.includes("e")) {
        newW = Math.max(MIN_WIDTH, origW + dx);
      }
      if (direction.includes("s")) {
        newH = Math.max(MIN_HEIGHT, origH + dy);
      }
      if (direction.includes("w")) {
        const potentialW = origW - dx;
        if (potentialW >= MIN_WIDTH) {
          newW = potentialW;
          newX = origX + dx;
        } else {
          newW = MIN_WIDTH;
          newX = origX + (origW - MIN_WIDTH);
        }
      }
      if (direction.includes("n")) {
        const potentialH = origH - dy;
        if (potentialH >= MIN_HEIGHT) {
          newH = potentialH;
          newY = Math.max(0, origY + dy);
        } else {
          newH = MIN_HEIGHT;
          newY = origY + (origH - MIN_HEIGHT);
        }
      }

      setWindows((prev) => ({
        ...prev,
        [windowId]: {
          ...prev[windowId],
          position: { x: newX, y: newY },
          size: { width: newW, height: newH },
        },
      }));
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsInteracting(false);
    dragRef.current.windowId = null;
    resizeRef.current.windowId = null;
    resizeRef.current.direction = null;
  }, []);

  // Desktop Canvas & Smart Context Menu Handler
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if user has highlighted text
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : "";

    if (selectedText) {
      setContextMenu((prev) => ({ ...prev, visible: false }));
      setAppContextMenu({
        visible: true,
        x: Math.min(window.innerWidth - 220, e.clientX),
        y: Math.min(window.innerHeight - 240, e.clientY),
        windowId: activeWindow,
        selectedText,
        contextType: "text",
      });
      return;
    }

    setAppContextMenu((prev) => ({ ...prev, visible: false }));
    setContextMenu({
      visible: true,
      x: Math.min(window.innerWidth - 220, e.clientX),
      y: Math.min(window.innerHeight - 270, e.clientY),
    });
  };

  // Application Icon, Window, Blog, or Project Item Right Click Handler
  const handleAppContextMenu = (
    e: React.MouseEvent,
    id: WindowId,
    type: "app" | "window" | "blog" | "project" = "app",
    meta?: { title?: string; slug?: string },
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if right-clicking while text is selected inside a window
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : "";

    setContextMenu((prev) => ({ ...prev, visible: false }));
    setAppContextMenu({
      visible: true,
      x: Math.min(window.innerWidth - 220, e.clientX),
      y: Math.min(window.innerHeight - 260, e.clientY),
      windowId: id,
      selectedText: selectedText || undefined,
      contextType: selectedText ? "text" : type,
      metaTitle: meta?.title,
      metaSlug: meta?.slug,
    });
  };

  if (!isOsMode) return null;

  // Defensive guard: Desktop OS is exclusively tailored for desktop screens (>= 768px)
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return null;
  }

  // Compute Tiling Styles if Tiling Layout is active
  const getWindowStyle = (id: WindowId): React.CSSProperties => {
    const w = windows[id];
    const computedZ =
      id === "settings" && activeWindow === "settings"
        ? Math.max(w.zIndex, 500)
        : activeWindow === id
          ? Math.max(w.zIndex, 200)
          : w.zIndex;

    if (w.isMinimized) {
      if (minimizeEffect === "genie") {
        return {
          position: "absolute",
          left: `${w.position.x + w.size.width / 4}px`,
          top: "calc(100vh - 60px)",
          width: `${w.size.width * 0.25}px`,
          height: "40px",
          opacity: 0,
          transform: "scale(0.08, 0.08) perspective(600px) rotateX(45deg) translateY(120px)",
          transformOrigin: "bottom center",
          pointerEvents: "none",
          zIndex: computedZ,
          transition: "all 380ms cubic-bezier(0.4, 0, 0.2, 1)",
        };
      }
      return {
        position: "absolute",
        left: `${w.position.x}px`,
        top: `${w.position.y}px`,
        width: `${w.size.width}px`,
        height: `${w.size.height}px`,
        opacity: 0,
        transform: "scale(0.7) translateY(40px)",
        pointerEvents: "none",
        zIndex: computedZ,
        transition: "all 260ms cubic-bezier(0.16, 1, 0.3, 1)",
      };
    }

    if (w.isMaximized) {
      return {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        zIndex: computedZ,
        transition: isInteracting
          ? "none"
          : "top 240ms cubic-bezier(0.16, 1, 0.3, 1), left 240ms cubic-bezier(0.16, 1, 0.3, 1), width 240ms cubic-bezier(0.16, 1, 0.3, 1), height 240ms cubic-bezier(0.16, 1, 0.3, 1)",
      };
    }
    return {
      position: "absolute",
      left: `${w.position.x}px`,
      top: `${w.position.y}px`,
      width: `${w.size.width}px`,
      height: `${w.size.height}px`,
      maxWidth: "96vw",
      maxHeight: "84vh",
      zIndex: computedZ,
      transition: isInteracting
        ? "none"
        : "left 200ms cubic-bezier(0.16, 1, 0.3, 1), top 200ms cubic-bezier(0.16, 1, 0.3, 1), width 200ms cubic-bezier(0.16, 1, 0.3, 1), height 200ms cubic-bezier(0.16, 1, 0.3, 1)",
    };
  };

  const selectedTheme = OS_THEMES[osTheme] || OS_THEMES.carbon;
  const currentTheme = {
    name: selectedTheme.name,
    primary: selectedTheme.primary,
    accent: selectedTheme.accent,
    ...(isDark ? selectedTheme.dark : selectedTheme.light),
  };

  // Helper renderer for Window Titlebar with fixed stop-propagation close button
  const renderTitleBar = (id: WindowId, title: string) => (
    <>
      {renderResizeHandles(id)}
      <div
        onMouseDown={(e) => handleMouseDownHeader(e, id)}
        onContextMenu={(e) => handleAppContextMenu(e, id, "window", { title })}
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

        <span
          className={`text-xs font-semibold pointer-events-none truncate max-w-[65%] font-mono ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
        >
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
    </>
  );

  // Helper renderer for Smart Window Resize Handles (Edges and Corners)
  // Attached cleanly on the outer boundary with an outward margin so it NEVER overlaps the inner scrolling track
  const renderResizeHandles = (id: WindowId) => {
    if (layoutMode !== "floating" || windows[id].isMaximized) return null;

    return (
      <div className="pointer-events-none select-none">
        {/* Cardinal Edges: placed outside/edge without inner overlap */}
        <div
          onMouseDown={(e) => handleMouseDownResize(e, id, "n")}
          className="absolute -top-1 left-4 right-4 h-2 cursor-ns-resize z-50 pointer-events-auto hover:bg-primary/30 transition-colors"
        />
        <div
          onMouseDown={(e) => handleMouseDownResize(e, id, "s")}
          className="absolute -bottom-1 left-4 right-4 h-2 cursor-ns-resize z-50 pointer-events-auto hover:bg-primary/30 transition-colors"
        />
        <div
          onMouseDown={(e) => handleMouseDownResize(e, id, "w")}
          className="absolute top-4 bottom-4 -left-1 w-2 cursor-ew-resize z-50 pointer-events-auto hover:bg-primary/30 transition-colors"
        />
        <div
          onMouseDown={(e) => handleMouseDownResize(e, id, "e")}
          className="absolute top-4 bottom-4 -right-1 w-2 cursor-ew-resize z-50 pointer-events-auto hover:bg-primary/30 transition-colors"
        />

        {/* Diagonal Corners */}
        <div
          onMouseDown={(e) => handleMouseDownResize(e, id, "nw")}
          className="absolute -top-1 -left-1 size-3.5 cursor-nwse-resize z-50 pointer-events-auto hover:bg-primary/40"
        />
        <div
          onMouseDown={(e) => handleMouseDownResize(e, id, "ne")}
          className="absolute -top-1 -right-1 size-3.5 cursor-nesw-resize z-50 pointer-events-auto hover:bg-primary/40"
        />
        <div
          onMouseDown={(e) => handleMouseDownResize(e, id, "sw")}
          className="absolute -bottom-1 -left-1 size-3.5 cursor-nesw-resize z-50 pointer-events-auto hover:bg-primary/40"
        />
        <div
          onMouseDown={(e) => handleMouseDownResize(e, id, "se")}
          className="absolute -bottom-1 -right-1 size-4 cursor-nwse-resize z-50 pointer-events-auto hover:bg-primary/50 flex items-end justify-end p-0.5 group"
          title="Drag to resize window"
        >
          <svg
            className="size-2 text-zinc-400 group-hover:text-primary transition-colors pointer-events-none"
            viewBox="0 0 6 6"
            fill="currentColor"
          >
            <circle cx="5" cy="5" r="0.8" />
            <circle cx="5" cy="2.5" r="0.8" />
            <circle cx="2.5" cy="5" r="0.8" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      style={getHeroWallpaperStyle(isDark)}
      className={`fixed inset-0 z-[9990] flex flex-col font-sans select-none overflow-hidden transition-all duration-300 ${
        isDark ? "text-zinc-100" : "text-zinc-900"
      }`}
    >
      {/* macOS Native Top Menu Bar */}
      <header
        className={`h-7 w-full border-b px-2.5 sm:px-3 flex items-center justify-between text-xs backdrop-blur-xl z-[10000] shadow-sm select-none ${
          isDark ? "text-zinc-200" : "text-zinc-800"
        }`}
        style={{
          backgroundColor: isDark ? `${currentTheme.card}F5` : "rgba(255, 255, 255, 0.94)",
          borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left Side: Active Window App Name & Menus */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Active Application Name */}
          <span
            className={`font-bold px-1.5 py-0.5 rounded text-xs ${isDark ? "text-zinc-100" : "text-zinc-950"}`}
          >
            {activeWindow ? windows[activeWindow].title.split(" ")[0] : "Finder"}
          </span>

          {/* Top App Menus */}
          <div className="hidden md:flex items-center gap-0.5 text-xs">
            <button
              type="button"
              onClick={() => focusWindow("settings")}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                isDark
                  ? "hover:bg-white/10 text-zinc-300 hover:text-zinc-100"
                  : "hover:bg-black/5 text-zinc-700 hover:text-zinc-900"
              }`}
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() => setShowLauncher(true)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                isDark
                  ? "hover:bg-white/10 text-zinc-300 hover:text-zinc-100"
                  : "hover:bg-black/5 text-zinc-700 hover:text-zinc-900"
              }`}
            >
              Window
            </button>
            <button
              type="button"
              onClick={() => setShowDesktopIcons((prev) => !prev)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                isDark
                  ? "hover:bg-white/10 text-zinc-300 hover:text-zinc-100"
                  : "hover:bg-black/5 text-zinc-700 hover:text-zinc-900"
              }`}
            >
              {showDesktopIcons ? "Hide Desktop" : "Show Desktop"}
            </button>
            <button
              type="button"
              onClick={() => focusWindow("about")}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                isDark
                  ? "hover:bg-white/10 text-zinc-300 hover:text-zinc-100"
                  : "hover:bg-black/5 text-zinc-700 hover:text-zinc-900"
              }`}
            >
              Help
            </button>
          </div>
        </div>

        {/* Right Status Tray (Control Center, Battery, Clock) */}
        <div
          className={`flex items-center gap-1.5 sm:gap-2.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
        >
          {/* Spotlight Search Icon */}
          <button
            type="button"
            onClick={() => setShowLauncher(true)}
            className={`p-1 rounded cursor-pointer transition-colors ${
              isDark
                ? "hover:bg-white/10 text-zinc-300 hover:text-zinc-100"
                : "hover:bg-black/5 text-zinc-700 hover:text-zinc-900"
            }`}
            title="Spotlight Search (Alt+Space)"
          >
            <FiSearch className="size-3.5" />
          </button>

          {/* Control Center Button */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowControlCenter((prev) => !prev);
              }}
              className={`p-1 rounded cursor-pointer transition-colors flex items-center gap-1 ${
                showControlCenter
                  ? "bg-primary text-black"
                  : isDark
                    ? "hover:bg-white/10 text-zinc-300 hover:text-zinc-100"
                    : "hover:bg-black/5 text-zinc-700 hover:text-zinc-900"
              }`}
              title="Control Center (Quick Settings)"
            >
              <FiSliders className="size-3.5" />
            </button>

            {/* macOS Control Center Flyout Modal */}
            {showControlCenter && (
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute right-0 top-full mt-1.5 w-72 rounded-2xl border p-3 shadow-2xl backdrop-blur-2xl z-[10010] pointer-events-auto animate-in fade-in zoom-in-95 duration-100 font-sans text-xs ${
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
                      {isDark ? (
                        <FiMoon className="size-4 text-primary" />
                      ) : (
                        <FiSun className="size-4 text-amber-500" />
                      )}
                      <span className="text-[10px] font-mono font-bold uppercase">
                        {isDark ? "Dark" : "Light"}
                      </span>
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
                        : isDark
                          ? "bg-white/5 border-white/10 hover:bg-white/10"
                          : "bg-black/5 border-black/10 hover:bg-black/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <FiEye className="size-4" />
                      <span className="text-[10px] font-mono font-bold uppercase">
                        {showDesktopIcons ? "ON" : "OFF"}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium">Desktop Icons</span>
                  </button>
                </div>

                {/* Quick Link to Full System Settings */}
                <button
                  type="button"
                  onClick={() => {
                    focusWindow("settings");
                    setShowControlCenter(false);
                  }}
                  className={`w-full py-1.5 px-2.5 rounded-xl border text-center font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5 mb-2.5 ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300"
                      : "bg-black/5 border-black/10 hover:bg-black/10 text-zinc-700"
                  }`}
                >
                  <FiSettings className="size-3 text-primary" />
                  <span>Open System Settings...</span>
                </button>

                {/* Integrated Shut Down Action in Control Center */}
                <button
                  type="button"
                  onClick={() => {
                    setShowControlCenter(false);
                    handleExitOs();
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium cursor-pointer transition-all flex items-center justify-between active:scale-98 shadow-sm"
                  title="Shut Down Carbon OS & Return to Web Mode"
                >
                  <div className="flex items-center gap-2">
                    <FiPower className="size-3.5 text-red-400" />
                    <span className="font-semibold text-xs">Shut Down Carbon OS</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-70">Alt+Q / ⌘Q</span>
                </button>
              </div>
            )}
          </div>

          <FiWifi className="size-3.5 hidden sm:inline" />
          <FiBatteryCharging className="size-3.5 text-emerald-400" />
          <span className={`font-mono text-[11px] ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
            {time}
          </span>
        </div>
      </header>

      {/* Desktop Canvas */}
      <main
        className="relative flex-1 p-4 sm:p-6 overflow-hidden"
        onClick={() => {
          setShowControlCenter(false);
          setShowLauncher(false);
          setShowAddAppPicker(false);
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
                { id: "reader", label: "Reader.app", icon: FiFileText, key: "5" },
                { id: "resume", label: "Resume.pdf", icon: FiFileText, key: "6" },
                { id: "settings", label: "Settings.app", icon: FiSettings, key: "7" },
                { id: "taskmanager", label: "Tasks.app", icon: FiActivity, key: "8" },
                { id: "browser", label: "Browser.app", icon: FiGlobe, key: "9" },
                { id: "messages", label: "Messages.app", icon: FiMessageSquare, key: "0" },
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
                        backgroundColor: isDark
                          ? `${currentTheme.card}E6`
                          : "rgba(255, 255, 255, 0.9)",
                        borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.12)",
                        color: currentTheme.primary,
                      }}
                    >
                      <item.icon className="size-6" />
                      <span
                        className={`absolute bottom-0.5 right-1 text-[8px] font-mono opacity-60 group-hover:opacity-100 ${
                          isDark ? "text-zinc-400" : "text-zinc-600"
                        }`}
                      >
                        ⌥{item.key}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-mono drop-shadow-md truncate max-w-[76px] font-medium ${
                        isDark ? "text-zinc-200" : "text-zinc-900"
                      }`}
                    >
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

            {/* Quick "Add App" Desktop Tile if any shortcuts are missing */}
            {desktopApps.length < 10 && (
              <div className="relative group w-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddAppPicker((prev) => !prev);
                  }}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border border-dashed transition-all cursor-pointer w-full text-center ${
                    showAddAppPicker
                      ? "border-primary bg-primary/10 text-primary"
                      : isDark
                        ? "hover:bg-white/5 border-white/20 hover:border-primary/50"
                        : "hover:bg-black/5 border-black/20 hover:border-primary/50"
                  }`}
                  title="Add Application Shortcut to Desktop"
                >
                  <div
                    className={`size-12 rounded-xl flex items-center justify-center transition-colors ${
                      showAddAppPicker
                        ? "text-primary"
                        : isDark
                          ? "text-zinc-400 group-hover:text-primary"
                          : "text-zinc-500 group-hover:text-primary"
                    }`}
                  >
                    <FiPlus className="size-5" />
                  </div>
                  <span
                    className={`text-[10px] font-mono ${
                      showAddAppPicker
                        ? "text-primary font-bold"
                        : isDark
                          ? "text-zinc-400 group-hover:text-zinc-200"
                          : "text-zinc-600 group-hover:text-zinc-900"
                    }`}
                  >
                    + Add App
                  </span>
                </button>

                {/* Direct Inline Add App Picker Dropdown */}
                {showAddAppPicker && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute left-0 top-full mt-2 w-56 rounded-xl border p-1.5 shadow-2xl backdrop-blur-xl z-[10020] animate-in fade-in zoom-in-95 duration-100 font-sans text-xs ${
                      isDark ? "text-zinc-200" : "text-zinc-800"
                    }`}
                    style={{
                      backgroundColor: isDark ? `${currentTheme.card}F8` : "rgba(255, 255, 255, 0.98)",
                      borderColor: currentTheme.border,
                    }}
                  >
                    <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-white/10 text-[10px] font-mono font-semibold text-zinc-400">
                      <span>Add to Desktop</span>
                      <button
                        type="button"
                        onClick={() => setShowAddAppPicker(false)}
                        className="hover:text-zinc-100 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-0.5">
                      {[
                        { id: "about", label: "About.app", icon: FiUser },
                        { id: "terminal", label: "Terminal.app", icon: FiTerminal },
                        { id: "projects", label: "Projects.app", icon: FiFolder },
                        { id: "blog", label: "Notes.app", icon: FiBookOpen },
                        { id: "reader", label: "Reader.app", icon: FiFileText },
                        { id: "resume", label: "Resume.pdf", icon: FiFileText },
                        { id: "settings", label: "Settings.app", icon: FiSettings },
                        { id: "taskmanager", label: "Tasks.app", icon: FiActivity },
                        { id: "browser", label: "Browser.app", icon: FiGlobe },
                        { id: "messages", label: "Messages.app", icon: FiMessageSquare },
                      ]
                        .filter((app) => !desktopApps.includes(app.id as WindowId))
                        .map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => {
                              addDesktopShortcut(app.id as WindowId);
                              setShowAddAppPicker(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                              isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <app.icon className="size-3.5 text-primary" />
                              <span className="font-medium text-xs">{app.label}</span>
                            </div>
                            <span className="text-[10px] font-mono text-primary font-bold">+ Add</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Windows Rendering Layer */}

        {/* 1. About Window */}
        {windows.about.isOpen && (
          <div
            style={{
              ...getWindowStyle("about"),
              backgroundColor: isDark ? `${currentTheme.bg}F5` : "#ffffffF5",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            onClick={() => focusWindow("about")}
            className={`flex flex-col rounded-xl border shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out ${
              windows.about.isMinimized ? "hidden" : ""
            }`}
          >
            {renderTitleBar("about", `About — ${siteConfig.name}`)}

            <div
              className={`p-4 sm:p-6 overflow-y-auto space-y-4 text-xs leading-relaxed font-sans ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              <AboutView metrics={cachedData?.profile} />
            </div>
          </div>
        )}

        {/* 2. Embedded Terminal Window */}
        {windows.terminal.isOpen && (
          <div
            style={{
              ...getWindowStyle("terminal"),
              backgroundColor: isDark ? "#1c1917" : "#24292e",
              borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.15)",
            }}
            onClick={() => focusWindow("terminal")}
            className={`flex flex-col rounded-xl border shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out ${
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
              ...getWindowStyle("projects"),
              backgroundColor: isDark ? `${currentTheme.bg}F5` : "#ffffffF5",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            onClick={() => focusWindow("projects")}
            className={`flex flex-col rounded-xl border shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out ${
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
                  onContextMenu={(e) =>
                    handleAppContextMenu(e, "projects", "project", { title: p.title })
                  }
                  className="p-3.5 rounded-lg border space-y-2 hover:border-primary/50 transition-colors"
                  style={{
                    backgroundColor: isDark ? `${currentTheme.card}CC` : "rgba(255, 255, 255, 0.9)",
                    borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-semibold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}
                      >
                        {p.title}
                      </h4>
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
                      {/* GitHub Source Code Interactive View */}
                      {p.githubUrl && (
                        <button
                          type="button"
                          onClick={() => openInBrowser(p.githubUrl!, `${p.title} Source (GitHub)`)}
                          className={`px-2 py-0.5 transition-colors flex items-center gap-1 rounded border text-[11px] font-mono cursor-pointer ${
                            isDark
                              ? "bg-white/5 border-white/10 text-zinc-300 hover:text-zinc-100 hover:bg-white/10"
                              : "bg-black/5 border-black/10 text-zinc-700 hover:text-zinc-950 hover:bg-black/10"
                          }`}
                          title="View GitHub repository and code in interactive OS browser"
                        >
                          <FiGithub className="size-3 text-primary" />
                          <span>Source</span>
                        </button>
                      )}

                      {/* Interactive Demo (Live hosted app or CLI simulation) */}
                      {p.liveUrl ? (
                        <button
                          type="button"
                          onClick={() =>
                            openInBrowser(p.liveUrl!, `${p.title} (Interactive Live Demo)`)
                          }
                          className="px-2 py-0.5 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 transition-colors flex items-center gap-1 rounded text-[11px] font-mono font-semibold cursor-pointer shadow-xs"
                          title={`Launch ${p.title} interactive web preview`}
                        >
                          <FiGlobe className="size-3" />
                          <span>Live Demo</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => focusWindow("terminal")}
                          className="px-2 py-0.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-colors flex items-center gap-1 rounded text-[11px] font-mono font-semibold cursor-pointer"
                          title="Run interactive terminal command demo"
                        >
                          <FiTerminal className="size-3" />
                          <span>CLI Demo</span>
                        </button>
                      )}

                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-400 hover:text-primary transition-colors p-1"
                          title="Open live link externally in new browser tab"
                        >
                          <FiExternalLink className="size-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                  >
                    {p.description}
                  </p>
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
              ...getWindowStyle("blog"),
              backgroundColor: isDark ? `${currentTheme.bg}F5` : "#ffffffF5",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            onClick={() => focusWindow("blog")}
            className={`flex flex-col rounded-xl border shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out ${
              windows.blog.isMinimized ? "hidden" : ""
            }`}
          >
            {renderTitleBar("blog", "Engineering Notes & Articles")}

            <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
              {blogConfig.posts.map((article) => (
                <div
                  key={article.slug}
                  onClick={() => openInReader(article.slug, article.title)}
                  onContextMenu={(e) =>
                    handleAppContextMenu(e, "blog", "blog", {
                      title: article.title,
                      slug: article.slug,
                    })
                  }
                  className="block p-3.5 rounded-lg border hover:border-primary/50 transition-colors group cursor-pointer"
                  style={{
                    backgroundColor: isDark ? `${currentTheme.card}CC` : "rgba(255, 255, 255, 0.9)",
                    borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs font-semibold group-hover:text-primary transition-colors ${
                        isDark ? "text-zinc-100" : "text-zinc-900"
                      }`}
                    >
                      {article.title}
                    </p>
                    <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                      {article.readTime}
                    </span>
                  </div>
                  {article.subtitle && (
                    <p
                      className={`text-[11px] mt-1 line-clamp-1 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
                    >
                      {article.subtitle}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2 font-mono text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className={isDark ? "text-zinc-500" : "text-zinc-600"}>
                        {formatBlogDate(article.date)}
                      </span>
                      <span className="text-zinc-400">•</span>
                      <div className="flex flex-wrap gap-1">
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
                    <span className="text-[10px] text-primary group-hover:underline flex items-center gap-1 font-medium">
                      Open in Reader <FiExternalLink className="size-2.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dedicated Article Reader Window (VS Code Style) */}
        {windows.reader.isOpen && (
          <div
            style={{
              ...getWindowStyle("reader"),
              backgroundColor: isDark ? "#181514FA" : "#ffffffFA",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.15)",
            }}
            onClick={() => focusWindow("reader")}
            className={`flex flex-col rounded-xl border shadow-[0_30px_90px_-10px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out ${
              windows.reader.isMinimized ? "hidden" : ""
            }`}
          >
            {renderTitleBar("reader", `${activeArticleTitle} — Markdown Reader`)}

            <div className="flex-1 overflow-hidden">
              <BlogReaderView
                slug={activeArticleSlug}
                isDark={isDark}
                onSelectArticle={(slug, title) => {
                  setActiveArticleSlug(slug);
                  setActiveArticleTitle(title);
                }}
              />
            </div>
          </div>
        )}

        {/* 5. Resume Window */}
        {windows.resume.isOpen && (
          <div
            style={{
              ...getWindowStyle("resume"),
              backgroundColor: isDark ? `${currentTheme.bg}F5` : "#ffffffF5",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            onClick={() => focusWindow("resume")}
            className={`flex flex-col rounded-xl border shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out ${
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
              ...getWindowStyle("settings"),
              backgroundColor: isDark ? `${currentTheme.bg}F8` : "#ffffffF8",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            onClick={() => focusWindow("settings")}
            className={`flex flex-col rounded-xl border shadow-[0_30px_90px_-10px_rgba(0,0,0,0.9)] backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out transition-all ${
              activeWindow === "settings" ? "ring-1 ring-primary/40" : ""
            } ${windows.settings.isMinimized ? "hidden" : ""}`}
          >
            {renderTitleBar("settings", "Settings & Personalization")}

            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs font-mono">
              {/* OS Theme selection section */}
              <div>
                <h4
                  className={`font-semibold mb-2 flex items-center gap-2 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}
                >
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
                          active
                            ? "border-primary ring-2 ring-primary/40 shadow-lg"
                            : "border-white/10"
                        }`}
                        style={{
                          backgroundColor: isDark ? t.dark.card : t.light.card,
                          borderColor: active ? t.primary : isDark ? t.dark.border : t.light.border,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[11px] font-bold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}
                          >
                            {t.name}
                          </span>
                          {active && <FiCheck className="size-3 text-primary" />}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="size-3.5 rounded-full border border-black/10 dark:border-white/20"
                            style={{ backgroundColor: isDark ? t.dark.bg : t.light.bg }}
                            title="Background"
                          />
                          <span
                            className="size-3.5 rounded-full border border-black/10 dark:border-white/20"
                            style={{ backgroundColor: t.primary }}
                            title="Primary Color"
                          />
                          <span
                            className="size-3.5 rounded-full border border-black/10 dark:border-white/20"
                            style={{ backgroundColor: t.accent }}
                            title="Accent Color"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Window Transition Physics & Dock Minimization Setting */}
              <div className={`border-t pt-4 ${isDark ? "border-white/10" : "border-black/10"}`}>
                <h4
                  className={`font-semibold mb-2 flex items-center gap-2 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}
                >
                  <FiSliders className="text-primary size-4" />
                  <span>Window & Dock Motion Physics</span>
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMinimizeEffect("genie")}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                      minimizeEffect === "genie"
                        ? "border-primary bg-primary/20 text-primary"
                        : isDark
                          ? "border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300"
                          : "border-black/10 bg-black/5 hover:bg-black/10 text-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px]">🧞 Genie Effect</span>
                      {minimizeEffect === "genie" && <FiCheck className="size-3" />}
                    </div>
                    <span className="text-[10px] opacity-75">Curved warp dock morph</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMinimizeEffect("scale")}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                      minimizeEffect === "scale"
                        ? "border-primary bg-primary/20 text-primary"
                        : isDark
                          ? "border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300"
                          : "border-black/10 bg-black/5 hover:bg-black/10 text-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px]">📐 Scale Effect</span>
                      {minimizeEffect === "scale" && <FiCheck className="size-3" />}
                    </div>
                    <span className="text-[10px] opacity-75">Swift geometric scale</span>
                  </button>
                </div>
              </div>

              {/* Desktop Icons & Visibility Setting */}
              <div className={`border-t pt-4 ${isDark ? "border-white/10" : "border-black/10"}`}>
                <h4
                  className={`font-semibold mb-2 flex items-center gap-2 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}
                >
                  <FiEye className="text-primary size-4" />
                  <span>Desktop Applications Visibility</span>
                </h4>
                <div
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div>
                    <span
                      className={`font-medium block text-xs ${isDark ? "text-zinc-200" : "text-zinc-900"}`}
                    >
                      Show Desktop Application Shortcuts
                    </span>
                    <span className={`text-[10px] ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                      Toggle whether app icons and files appear directly on the desktop canvas
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDesktopIcons((prev) => !prev)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      showDesktopIcons
                        ? "bg-primary text-black font-bold"
                        : isDark
                          ? "bg-white/10 text-zinc-400 hover:text-zinc-200"
                          : "bg-black/10 text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {showDesktopIcons ? "Visible (On)" : "Hidden (Off)"}
                  </button>
                </div>
              </div>

              {/* Keyboard Shortcuts Reference */}
              <div
                className={`border-t pt-4 text-[11px] space-y-2.5 ${isDark ? "border-white/10 text-zinc-400" : "border-black/10 text-zinc-600"}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold ${isDark ? "text-zinc-200" : "text-zinc-900"}`}
                  >
                    Conflict-Free Keyboard Shortcuts
                  </span>
                  <span className="text-[10px] font-mono opacity-60">
                    Works across macOS, Windows & Linux
                  </span>
                </div>
                <p className="text-[10px] leading-relaxed opacity-75">
                  Scoped with <kbd className="font-semibold text-primary">Alt / ⌥</kbd> modifiers to guarantee zero collisions with browser native shortcuts (such as browser back/refresh, address bar, or system tab switching).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                    <span className="text-zinc-400">Spotlight App Launcher</span>
                    <kbd className={`font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Alt + Space</kbd>
                  </div>
                  <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                    <span className="text-zinc-400">Cycle Open Windows</span>
                    <kbd className={`font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Alt + Tab</kbd>
                  </div>
                  <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                    <span className="text-zinc-400">Shut Down Carbon OS</span>
                    <kbd className="font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">Alt + Q</kbd>
                  </div>
                  <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                    <span className="text-zinc-400">Close Active Window</span>
                    <kbd className={`font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Alt + W / ESC</kbd>
                  </div>
                  <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                    <span className="text-zinc-400">Toggle Maximize / Restore</span>
                    <kbd className={`font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Alt + M</kbd>
                  </div>
                  <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                    <span className="text-zinc-400">Center Active Window</span>
                    <kbd className={`font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Alt + F</kbd>
                  </div>
                  <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                    <span className="text-zinc-400">Launch Apps by Number</span>
                    <kbd className={`font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Alt + 1..0</kbd>
                  </div>
                  <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                    <span className="text-zinc-400">Mission Control</span>
                    <kbd className={`font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Ctrl/Alt + ↑</kbd>
                  </div>
                  <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                    <span className="text-zinc-400">Integrated Terminal Toggle</span>
                    <kbd className={`font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Ctrl + ` / ⌃`</kbd>
                  </div>
                  <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                    <span className="text-zinc-400">Switch Virtual Space</span>
                    <kbd className={`font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Ctrl/Alt + ← / →</kbd>
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
              ...getWindowStyle("taskmanager"),
              backgroundColor: isDark ? `${currentTheme.bg}F8` : "#ffffffF8",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            onClick={() => focusWindow("taskmanager")}
            className={`flex flex-col rounded-xl border shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out ${
              windows.taskmanager.isMinimized ? "hidden" : ""
            }`}
          >
            {renderTitleBar("taskmanager", "Task Manager & System Resources")}

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 font-mono text-xs">
              {/* CPU & Memory Gauges */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`p-3 rounded-lg border space-y-2 ${isDark ? "bg-black/40 border-white/10" : "bg-black/5 border-black/10"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                      CPU UTILIZATION
                    </span>
                    <span className="text-emerald-400 font-bold">{Math.round(cpuUsage)}%</span>
                  </div>
                  <div className="w-full h-2 rounded bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-300"
                      style={{ width: `${cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border space-y-2 ${isDark ? "bg-black/40 border-white/10" : "bg-black/5 border-black/10"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                      MEMORY IN USE
                    </span>
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
                <h4
                  className={`font-semibold mb-2 text-[11px] ${isDark ? "text-zinc-200" : "text-zinc-900"}`}
                >
                  Active Window Processes
                </h4>
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead
                      className={`border-b text-[10px] ${isDark ? "bg-black/60 text-zinc-400 border-white/10" : "bg-black/10 text-zinc-700 border-black/10"}`}
                    >
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
                            <span
                              className={`font-medium ${isDark ? "text-zinc-200" : "text-zinc-900"}`}
                            >
                              {w.title}
                            </span>
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

        {/* 8. Interactive Hosted Projects & GitHub iframe Window */}
        {windows.browser.isOpen && (
          <div
            style={{
              ...getWindowStyle("browser"),
              backgroundColor: isDark ? `${currentTheme.bg}FA` : "#ffffffFA",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.15)",
            }}
            onClick={() => focusWindow("browser")}
            className={`flex flex-col rounded-xl border shadow-[0_30px_90px_-10px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out ${
              windows.browser.isMinimized ? "hidden" : ""
            }`}
          >
            {renderResizeHandles("browser")}
            {/* Titlebar with address bar */}
            <div
              onMouseDown={(e) => handleMouseDownHeader(e, "browser")}
              onContextMenu={(e) => handleAppContextMenu(e, "browser")}
              onDoubleClick={() => toggleMaximize("browser")}
              className={`flex items-center justify-between px-3.5 py-2.5 border-b select-none cursor-move shrink-0 ${
                isDark ? "bg-[#272220] border-white/10" : "bg-[#f4f4f4] border-black/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => closeWindow("browser", e)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="size-3.5 rounded-full bg-[#ff5f56] hover:brightness-125 border border-[#e0443e] cursor-pointer flex items-center justify-center group"
                  title="Close (ESC)"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/80 leading-none">
                    ✕
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => minimizeWindow("browser", e)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="size-3.5 rounded-full bg-[#ffbd2e] hover:brightness-125 border border-[#dea123] cursor-pointer flex items-center justify-center group"
                  title="Minimize"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/80 leading-none">
                    −
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMaximize("browser");
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="size-3.5 rounded-full bg-[#27c93f] hover:brightness-125 border border-[#1aab29] cursor-pointer flex items-center justify-center group"
                  title="Maximize / Restore"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[7px] font-bold text-black/80 leading-none">
                    {windows.browser.isMaximized ? "⤓" : "⤢"}
                  </span>
                </button>
              </div>

              {/* Interactive Address URL Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inputUrl) setBrowserUrl(inputUrl);
                }}
                className={`flex-1 max-w-md mx-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono ${
                  isDark
                    ? "bg-black/40 border-white/10 text-zinc-200"
                    : "bg-white border-black/10 text-zinc-900"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <FiGlobe className="size-3.5 text-primary shrink-0" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none p-0 text-xs font-mono"
                  placeholder="Enter URL to preview..."
                />
                <a
                  href={browserUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-400 hover:text-primary transition-colors p-0.5"
                  title="Open externally in new tab"
                >
                  <FiExternalLink className="size-3" />
                </a>
              </form>

              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => toggleMaximize("browser")}
                  className={`cursor-pointer p-0.5 transition-colors ${
                    isDark
                      ? "text-zinc-400 hover:text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {windows.browser.isMaximized ? (
                    <FiMinimize2 className="size-3.5" />
                  ) : (
                    <FiMaximize2 className="size-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Browser Secondary Status & Navigation Bar */}
            <div
              className={`px-3 py-1.5 border-b flex items-center justify-between text-[11px] font-mono ${
                isDark
                  ? "bg-[#1f1b19] border-white/10 text-zinc-400"
                  : "bg-[#f0f0f0] border-black/10 text-zinc-600"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold truncate">{browserTitle}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const cur = browserUrl;
                    setBrowserUrl("");
                    setTimeout(() => setBrowserUrl(cur), 50);
                  }}
                  className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                  title="Reload Interactive View"
                >
                  <FiRefreshCw className="size-3" />
                  <span>Reload</span>
                </button>
                <span>|</span>
                <a
                  href={browserUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                  title="Open in new external tab"
                >
                  <FiExternalLink className="size-3" />
                  <span>External Tab</span>
                </a>
              </div>
            </div>

            {/* Embedded Live View / External IFrame (Sandboxed & Isolated from host session) */}
            <div className="flex-1 w-full h-full min-h-[420px] relative bg-white">
              <iframe
                key={browserUrl}
                src={browserUrl}
                title={browserTitle}
                className={`w-full h-full border-0 absolute inset-0 bg-white ${
                  isInteracting ? "pointer-events-none" : "pointer-events-auto"
                }`}
                sandbox="allow-scripts allow-forms allow-popups allow-modals allow-downloads"
                loading="lazy"
              />
              {/* Drag/Resize transparent overlay shield to capture mouse events smoothly */}
              {isInteracting && <div className="absolute inset-0 z-30 bg-transparent" />}
            </div>
          </div>
        )}

        {/* 9. Sequoia Messages Window */}
        {windows.messages.isOpen && (
          <div
            style={{
              ...getWindowStyle("messages"),
              backgroundColor: isDark ? `${currentTheme.bg}F8` : "#ffffffF8",
              borderColor: isDark ? currentTheme.border : "rgba(0,0,0,0.12)",
            }}
            onClick={() => focusWindow("messages")}
            className={`flex flex-col rounded-xl border shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out ${
              windows.messages.isMinimized ? "hidden" : ""
            }`}
          >
            {renderTitleBar("messages", "Messages — Sagar Kumar Jha")}

            <div className="flex-1 overflow-hidden">
              <MessagesApp isDark={isDark} />
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
              backgroundColor: isDark ? `${currentTheme.card}F5` : "rgba(255, 255, 255, 0.98)",
              borderColor: currentTheme.border,
            }}
            className={`fixed z-[10020] w-52 rounded-xl border p-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 font-mono text-xs ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
          >
            <div
              className={`px-2.5 py-1 text-[10px] uppercase font-semibold border-b mb-1 ${isDark ? "text-zinc-400 border-white/10" : "text-zinc-600 border-black/10"}`}
            >
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
                setShowAddAppPicker(true);
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
            >
              <FiPlus className="size-3.5 text-primary" />
              <span>Add App Shortcut...</span>
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
                handleExitOs();
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-red-500/10 text-red-400 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FiPower className="size-3.5 text-red-400" />
              <span>Shut Down Carbon OS</span>
            </button>
          </div>
        )}

        {/* Application & Smart Context Menu (Right Click on App Icon, Dock, Window, or Highlighted Text) */}
        {appContextMenu.visible && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              left: `${appContextMenu.x}px`,
              top: `${appContextMenu.y}px`,
              backgroundColor: isDark ? `${currentTheme.card}F5` : "rgba(255, 255, 255, 0.98)",
              borderColor: currentTheme.border,
            }}
            className={`fixed z-[10020] w-56 rounded-xl border p-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 font-mono text-xs ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
          >
            {/* Context Header */}
            <div
              className={`flex items-center justify-between px-2.5 py-1 text-[10px] uppercase font-semibold border-b mb-1 ${isDark ? "text-zinc-400 border-white/10" : "text-zinc-600 border-black/10"}`}
            >
              <span className="truncate max-w-[150px]">
                {appContextMenu.selectedText
                  ? "Selection"
                  : appContextMenu.metaTitle
                  ? appContextMenu.metaTitle
                  : appContextMenu.windowId
                  ? windows[appContextMenu.windowId].title
                  : "Context Actions"}
              </span>
              <span className="text-[9px] px-1 rounded bg-primary/20 text-primary font-mono lowercase">
                {appContextMenu.contextType || "action"}
              </span>
            </div>

            {/* 1. Selected Text Actions */}
            {appContextMenu.selectedText && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(appContextMenu.selectedText || "");
                    setAppContextMenu((prev) => ({ ...prev, visible: false }));
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                >
                  <FiCopy className="size-3.5 text-primary" />
                  <span>Copy Selection</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openInBrowser(
                      `https://www.google.com/search?q=${encodeURIComponent(appContextMenu.selectedText || "")}`,
                      `Search: ${appContextMenu.selectedText?.slice(0, 20)}`,
                    );
                    setAppContextMenu((prev) => ({ ...prev, visible: false }));
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                >
                  <FiSearch className="size-3.5 text-cyan-400" />
                  <span>Search in Web Browser</span>
                </button>
                <div className={`my-1 border-t ${isDark ? "border-white/10" : "border-black/10"}`} />
              </>
            )}

            {/* 2. Blog Specific Context Actions */}
            {appContextMenu.contextType === "blog" && appContextMenu.metaSlug && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    openInReader(
                      appContextMenu.metaSlug || "",
                      appContextMenu.metaTitle || "Article Reader",
                    );
                    setAppContextMenu((prev) => ({ ...prev, visible: false }));
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                >
                  <FiBookOpen className="size-3.5 text-primary" />
                  <span>Read in Reader Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/blog/${appContextMenu.metaSlug}`,
                    );
                    setAppContextMenu((prev) => ({ ...prev, visible: false }));
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                >
                  <FiShare2 className="size-3.5 text-zinc-400" />
                  <span>Copy Article URL</span>
                </button>
                <div className={`my-1 border-t ${isDark ? "border-white/10" : "border-black/10"}`} />
              </>
            )}

            {/* 3. Window & Application Context Actions */}
            {appContextMenu.windowId && (
              <>
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
                    <span>Remove from Desktop</span>
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
                    <span>Quit Application</span>
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
              </>
            )}
          </div>
        )}

        {/* Quick App Launcher Modal (Spotlight / Raycast style) */}
        {showLauncher && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[10030] flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm animate-in fade-in duration-100 p-4"
          >
            <div
              className="w-full max-w-lg rounded-2xl border shadow-2xl p-4 font-mono overflow-hidden flex flex-col gap-3"
              style={{
                backgroundColor: isDark ? `${currentTheme.card}F8` : "rgba(255, 255, 255, 0.98)",
                borderColor: currentTheme.border,
              }}
            >
              {/* Launcher Header & Live Search Bar */}
              <div
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs ${isDark ? "bg-black/40 border-white/10" : "bg-black/5 border-black/10"}`}
              >
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
                    {
                      id: "browser",
                      label: "Safari Preview",
                      sub: "Web Projects",
                      icon: FiGlobe,
                      key: "8",
                    },
                    {
                      id: "messages",
                      label: "Messages",
                      sub: "Sequoia Motion",
                      icon: FiMessageSquare,
                      key: "9",
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
                        <span
                          className={`text-[11px] font-semibold truncate w-full ${isDark ? "text-zinc-200" : "text-zinc-900"}`}
                        >
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

        {/* Mission Control Spaces Overview Overlay */}
        {isMissionControl && (
          <div
            onClick={() => setIsMissionControl(false)}
            className="fixed inset-0 z-[10030] bg-black/60 backdrop-blur-md flex flex-col p-6 animate-in fade-in duration-200"
          >
            {/* Spaces Bar Top */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {[0, 1, 2].map((sIndex) => (
                <button
                  key={sIndex}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSpace(sIndex);
                    setIsMissionControl(false);
                  }}
                  className={`w-36 h-20 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeSpace === sIndex
                      ? "ring-2 ring-primary border-primary bg-primary/20 scale-105"
                      : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-zinc-100">
                    Desktop {sIndex + 1}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {sIndex === 0 ? "Main Space" : sIndex === 1 ? "Development" : "Research"}
                  </span>
                </button>
              ))}
            </div>

            {/* Mission Control Windows Grid */}
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full p-4">
                {openWindows.map((w) => (
                  <motion.div
                    key={w.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      focusWindow(w.id);
                      setIsMissionControl(false);
                    }}
                    className="p-4 rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-3 cursor-pointer group hover:border-primary/60 transition-colors"
                  >
                    <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <w.icon className="size-7" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-100 truncate max-w-full text-center">
                      {w.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {w.isMinimized ? "Minimized" : "Active"}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center text-zinc-400 font-mono text-xs">
              Click any window or press ESC to exit Mission Control
            </div>
          </div>
        )}

        {/* Alt+Tab Quick Switcher Overlay */}
        {showSwitcher && openWindows.length > 0 && (
          <div className="fixed inset-0 z-[10040] flex items-center justify-center pointer-events-none">
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
                    backgroundColor:
                      activeWindow === w.id ? `${currentTheme.primary}25` : undefined,
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
      <footer className="h-16 w-full flex items-center justify-center pb-2 z-[10000] pointer-events-auto">
        <div
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border backdrop-blur-xl shadow-2xl"
          style={{
            backgroundColor: isDark ? `${currentTheme.card}E6` : "rgba(255, 255, 255, 0.92)",
            borderColor: isDark ? currentTheme.border : "rgba(0, 0, 0, 0.12)",
          }}
        >
          {/* Dedicated "All Apps" / Launchpad button at start of dock */}
          <button
            type="button"
            onClick={() => setShowLauncher((prev) => !prev)}
            className={`group relative flex flex-col items-center justify-center size-11 rounded-xl transition-all hover:scale-115 active:scale-95 cursor-pointer ${
              showLauncher
                ? "border"
                : isDark
                  ? "hover:bg-white/10 text-zinc-300"
                  : "hover:bg-black/5 text-zinc-700"
            }`}
            style={{
              backgroundColor: showLauncher ? `${currentTheme.primary}25` : undefined,
              borderColor: showLauncher ? currentTheme.primary : "transparent",
              color: showLauncher ? currentTheme.primary : undefined,
            }}
            title="All Apps / Launchpad (Alt+Space)"
          >
            <FiGrid className="size-5 transition-transform group-hover:-translate-y-0.5" />
            <span
              className={`size-1 rounded-full absolute bottom-1 transition-colors ${
                showLauncher ? "bg-primary" : "opacity-0"
              }`}
            />
          </button>

          {/* Separator */}
          <div className={`h-6 w-px ${isDark ? "bg-white/10" : "bg-black/10"}`} />

          {(
            [
              { id: "about", label: "About", icon: FiUser },
              { id: "terminal", label: "Terminal", icon: FiTerminal },
              { id: "projects", label: "Projects", icon: FiFolder },
              { id: "blog", label: "Notes", icon: FiBookOpen },
              { id: "resume", label: "Resume", icon: FiFileText },
              { id: "settings", label: "Settings", icon: FiSettings },
              { id: "taskmanager", label: "Tasks", icon: FiActivity },
              { id: "browser", label: "Web", icon: FiGlobe },
              { id: "messages", label: "Messages", icon: FiMessageSquare },
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
                  isFocused
                    ? "border"
                    : isDark
                      ? "hover:bg-white/10 text-zinc-300"
                      : "hover:bg-black/5 text-zinc-700"
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
