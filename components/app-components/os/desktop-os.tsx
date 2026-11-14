"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiTerminal,
  FiUser,
  FiFolder,
  FiFileText,
  FiBookOpen,
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
  FiImage,
  FiColumns,
  FiLayers,
  FiCommand,
} from "react-icons/fi";
import { useTheme } from "next-themes";
import { useOsMode } from "@/components/providers";
import { siteConfig } from "@/lib/config";
import TerminalModal from "@/components/app-components/terminal/terminal";
import { ResumePdfViewer } from "@/components/app-components/resume";
import cachedData from "@/lib/generated/portfolio-data.json";

export type WindowId = "about" | "terminal" | "projects" | "blog" | "resume";
export type LayoutMode = "floating" | "tiling-horizontal" | "tiling-vertical" | "tiling-grid";
export type WallpaperKey = "carbon" | "aurora" | "matrix" | "minimal" | "cover";

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

const WALLPAPERS: Record<WallpaperKey, { name: string; style: React.CSSProperties }> = {
  carbon: {
    name: "Carbon Gradient",
    style: {
      background:
        "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(51, 177, 255, 0.12), rgba(28, 25, 23, 1))",
    },
  },
  aurora: {
    name: "Nordic Aurora",
    style: {
      background:
        "radial-gradient(circle at 20% 20%, rgba(39, 201, 63, 0.18), transparent 45%), radial-gradient(circle at 80% 80%, rgba(51, 177, 255, 0.15), rgba(28, 25, 23, 1) 70%)",
    },
  },
  matrix: {
    name: "Cyber Grid",
    style: {
      backgroundColor: "#161616",
      backgroundImage:
        "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
    },
  },
  minimal: {
    name: "Deep Stone",
    style: {
      backgroundColor: "#1c1917",
    },
  },
  cover: {
    name: "Cover Art",
    style: {
      backgroundImage: "linear-gradient(rgba(28, 25, 23, 0.85), rgba(28, 25, 23, 0.95)), url('/cover-image.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
  },
};

export const DesktopOs = () => {
  const { isOsMode, toggleOsMode } = useOsMode();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [time, setTime] = useState("");
  const [activeWindow, setActiveWindow] = useState<WindowId | null>("about");
  const [topZ, setTopZ] = useState(10);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("floating");
  const [wallpaper, setWallpaper] = useState<WallpaperKey>("carbon");
  const [showWallpaperMenu, setShowWallpaperMenu] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);

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
      position: { x: 40, y: 30 },
      size: { width: 620, height: 460 },
    },
    terminal: {
      id: "terminal",
      title: "Carbon Shell (bash)",
      icon: FiTerminal,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 2,
      position: { x: 120, y: 60 },
      size: { width: 680, height: 500 },
    },
    projects: {
      id: "projects",
      title: "Projects & Repositories",
      icon: FiFolder,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 3,
      position: { x: 180, y: 50 },
      size: { width: 700, height: 520 },
    },
    blog: {
      id: "blog",
      title: "Technical Writings",
      icon: FiBookOpen,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 4,
      position: { x: 220, y: 70 },
      size: { width: 640, height: 480 },
    },
    resume: {
      id: "resume",
      title: "Resume (PDF)",
      icon: FiFileText,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 5,
      position: { x: 140, y: 40 },
      size: { width: 740, height: 560 },
    },
  });

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const focusWindow = useCallback(
    (id: WindowId) => {
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
    },
    [],
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

  const closeWindow = useCallback(
    (id: WindowId) => {
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], isOpen: false },
      }));
      if (activeWindow === id) {
        setActiveWindow(null);
      }
    },
    [activeWindow],
  );

  const minimizeWindow = useCallback(
    (id: WindowId) => {
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

  // Tab Switching (Alt+Tab / Cmd+K style)
  const windowList = Object.values(windows);
  const openWindows = windowList.filter((w) => w.isOpen);

  const cycleNextWindow = useCallback(() => {
    if (openWindows.length <= 1) return;
    const currentIndex = openWindows.findIndex((w) => w.id === activeWindow);
    const nextIndex = (currentIndex + 1) % openWindows.length;
    const nextId = openWindows[nextIndex].id;
    focusWindow(nextId);
  }, [openWindows, activeWindow, focusWindow]);

  // Global Keyboard Navigation (Hyprland / i3 Tiling keys & Alt+Tab)
  useEffect(() => {
    if (!isOsMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close active window
      if (e.key === "Escape" && activeWindow) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          closeWindow(activeWindow);
        }
      }

      // Alt+Tab window cycling
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        setShowSwitcher(true);
        cycleNextWindow();
      }

      // Super/Alt + M: toggle maximize
      if ((e.altKey || e.metaKey) && (e.key === "m" || e.key === "M")) {
        e.preventDefault();
        if (activeWindow) toggleMaximize(activeWindow);
      }

      // Super/Alt + H/V/G: Hyprland-like tiling layouts
      if ((e.altKey || e.metaKey) && (e.key === "h" || e.key === "H")) {
        e.preventDefault();
        setLayoutMode((prev) => (prev === "tiling-horizontal" ? "floating" : "tiling-horizontal"));
      }
      if ((e.altKey || e.metaKey) && (e.key === "v" || e.key === "V")) {
        e.preventDefault();
        setLayoutMode((prev) => (prev === "tiling-vertical" ? "floating" : "tiling-vertical"));
      }
      if ((e.altKey || e.metaKey) && (e.key === "g" || e.key === "G")) {
        e.preventDefault();
        setLayoutMode((prev) => (prev === "tiling-grid" ? "floating" : "tiling-grid"));
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
  }, [isOsMode, activeWindow, closeWindow, cycleNextWindow, toggleMaximize]);

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
        maxHeight: "82vh",
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

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={WALLPAPERS[wallpaper].style}
      className="fixed inset-0 z-50 flex flex-col text-[#f4f4f4] font-sans select-none overflow-hidden animate-in fade-in duration-200 transition-all"
    >
      {/* Top Hyprland / macOS Bar */}
      <header className="h-7.5 w-full bg-[#272220]/95 border-b border-white/10 px-3 flex items-center justify-between text-xs backdrop-blur-md z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-primary">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono">CARBON-OS</span>
          </div>
          <span className="text-white/20">|</span>

          {/* Active Window Title */}
          <span className="font-medium text-zinc-300 hidden sm:inline">
            {activeWindow ? windows[activeWindow].title : "Desktop"}
          </span>

          {/* Hyprland Tiling Mode Pills */}
          <div className="flex items-center gap-1 bg-black/30 p-0.5 rounded border border-white/5 text-[10px] font-mono">
            {(
              [
                { mode: "floating", label: "Float", icon: FiLayers },
                { mode: "tiling-horizontal", label: "Columns", icon: FiColumns },
                { mode: "tiling-vertical", label: "Rows", icon: FiMinus },
                { mode: "tiling-grid", label: "Grid", icon: FiGrid },
              ] as const
            ).map((l) => (
              <button
                key={l.mode}
                type="button"
                onClick={() => setLayoutMode(l.mode)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                  layoutMode === l.mode
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
                title={`Switch layout to ${l.label} (Alt+${l.label[0]})`}
              >
                <l.icon className="size-2.5" />
                <span className="hidden md:inline">{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Status Tray */}
        <div className="flex items-center gap-2.5 text-zinc-400">
          {/* Wallpaper Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowWallpaperMenu((prev) => !prev)}
              className="flex items-center gap-1 hover:text-zinc-100 transition-colors cursor-pointer text-[11px] px-1.5 py-0.5 rounded border border-white/10 bg-white/5"
              title="Change Desktop Wallpaper"
            >
              <FiImage className="size-3 text-primary" />
              <span className="hidden sm:inline font-mono">{WALLPAPERS[wallpaper].name}</span>
            </button>

            {showWallpaperMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1.5 w-44 rounded-lg bg-[#272220] border border-white/10 p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 text-xs font-mono"
              >
                <div className="px-2 py-1 text-[10px] text-zinc-400 uppercase font-semibold">
                  Wallpapers
                </div>
                {(Object.keys(WALLPAPERS) as WallpaperKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setWallpaper(key);
                      setShowWallpaperMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1 rounded transition-colors cursor-pointer flex items-center justify-between ${
                      wallpaper === key
                        ? "bg-primary text-primary-foreground font-bold"
                        : "hover:bg-white/10 text-zinc-300"
                    }`}
                  >
                    <span>{WALLPAPERS[key].name}</span>
                    {wallpaper === key && <span className="size-1.5 rounded-full bg-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="hover:text-zinc-100 transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {isDark ? <FiSun className="size-3.5" /> : <FiMoon className="size-3.5" />}
          </button>

          <FiWifi className="size-3.5" />
          <FiVolume2 className="size-3.5" />
          <FiBatteryCharging className="size-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-zinc-200">{time}</span>

          {/* Exit OS Mode */}
          <button
            type="button"
            onClick={toggleOsMode}
            className="ml-1 px-2 py-0.5 rounded-none bg-primary hover:brightness-110 text-primary-foreground font-medium text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-xs"
            title="Exit Desktop OS"
          >
            <span>Exit OS</span>
            <FiExternalLink className="size-3" />
          </button>
        </div>
      </header>

      {/* Desktop Canvas */}
      <main
        className="relative flex-1 p-4 sm:p-6 overflow-hidden"
        onClick={() => setShowWallpaperMenu(false)}
      >
        {/* Desktop Application Icons */}
        <div className="grid grid-flow-col grid-rows-4 sm:grid-rows-6 gap-4 sm:gap-6 w-max">
          {(
            [
              { id: "about", label: "About.app", icon: FiUser },
              { id: "terminal", label: "Terminal.app", icon: FiTerminal },
              { id: "projects", label: "Projects.app", icon: FiFolder },
              { id: "blog", label: "Notes.app", icon: FiBookOpen },
              { id: "resume", label: "Resume.pdf", icon: FiFileText },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => focusWindow(item.id)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group w-20 text-center"
            >
              <div className="size-12 rounded-xl bg-[#272220]/90 border border-white/10 flex items-center justify-center text-primary shadow-lg group-hover:scale-105 transition-transform backdrop-blur-xs">
                <item.icon className="size-6" />
              </div>
              <span className="text-[11px] font-mono text-zinc-200 drop-shadow-md truncate max-w-[76px]">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Windows Rendering Layer */}

        {/* 1. About Window */}
        {windows.about.isOpen && (
          <div
            style={getTilingStyle("about")}
            onClick={() => focusWindow("about")}
            className={`flex flex-col rounded-xl border border-white/10 bg-[#1c1917]/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden ${
              windows.about.isMinimized ? "hidden" : ""
            }`}
          >
            {/* Draggable Titlebar with Single / Double Tap */}
            <div
              onMouseDown={(e) => handleMouseDownHeader(e, "about")}
              onDoubleClick={() => toggleMaximize("about")}
              className="flex items-center justify-between px-3.5 py-2 border-b border-white/10 bg-[#272220]/95 select-none cursor-move shrink-0"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => closeWindow("about")}
                  className="size-3 rounded-full bg-[#ff5f56] hover:brightness-110 border border-[#e0443e]/80 cursor-pointer"
                  title="Close (ESC)"
                />
                <button
                  type="button"
                  onClick={() => minimizeWindow("about")}
                  className="size-3 rounded-full bg-[#ffbd2e] hover:brightness-110 border border-[#dea123]/80 cursor-pointer"
                  title="Minimize"
                />
                <button
                  type="button"
                  onClick={() => toggleMaximize("about")}
                  className="size-3 rounded-full bg-[#27c93f] hover:brightness-110 border border-[#1aab29]/80 cursor-pointer"
                  title="Maximize / Restore (Double Tap)"
                />
              </div>
              <span className="text-xs font-medium text-zinc-300 pointer-events-none truncate max-w-[60%]">
                About — {siteConfig.name}
              </span>
              <button
                type="button"
                onClick={() => toggleMaximize("about")}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                {windows.about.isMaximized ? (
                  <FiMinimize2 className="size-3" />
                ) : (
                  <FiMaximize2 className="size-3" />
                )}
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-zinc-300 font-sans">
              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundImage: "url('/foxy.gif')",
                    imageRendering: "pixelated",
                    backgroundPosition: "-96px -96px",
                  }}
                  className="shrink-0 size-12 rounded-lg bg-[#272220] border border-white/10 p-1"
                />
                <div>
                  <h3 className="text-base font-bold text-zinc-100">{siteConfig.name}</h3>
                  <p className="text-primary font-mono text-[11px]">{siteConfig.role}</p>
                </div>
              </div>

              <p className="text-zinc-200">{siteConfig.bio}</p>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2.5 rounded bg-[#272220] border border-white/5">
                  <span className="text-zinc-400 block text-[10px]">CORE DOMAIN</span>
                  <span className="text-zinc-100 font-medium">Systems, C++ & Rust</span>
                </div>
                <div className="p-2.5 rounded bg-[#272220] border border-white/5">
                  <span className="text-zinc-400 block text-[10px]">LEETCODE SOLVED</span>
                  <span className="text-primary font-bold">
                    {cachedData.leetcode?.totalSolved ?? 710}+ Solved
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Projects Window */}
        {windows.projects.isOpen && (
          <div
            style={getTilingStyle("projects")}
            onClick={() => focusWindow("projects")}
            className={`flex flex-col rounded-xl border border-white/10 bg-[#1c1917]/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden ${
              windows.projects.isMinimized ? "hidden" : ""
            }`}
          >
            <div
              onMouseDown={(e) => handleMouseDownHeader(e, "projects")}
              onDoubleClick={() => toggleMaximize("projects")}
              className="flex items-center justify-between px-3.5 py-2 border-b border-white/10 bg-[#272220]/95 select-none cursor-move shrink-0"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => closeWindow("projects")}
                  className="size-3 rounded-full bg-[#ff5f56] hover:brightness-110 border border-[#e0443e]/80 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => minimizeWindow("projects")}
                  className="size-3 rounded-full bg-[#ffbd2e] hover:brightness-110 border border-[#dea123]/80 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => toggleMaximize("projects")}
                  className="size-3 rounded-full bg-[#27c93f] hover:brightness-110 border border-[#1aab29]/80 cursor-pointer"
                />
              </div>
              <span className="text-xs font-medium text-zinc-300 pointer-events-none truncate max-w-[60%]">
                Repositories & Projects
              </span>
              <button
                type="button"
                onClick={() => toggleMaximize("projects")}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                {windows.projects.isMaximized ? (
                  <FiMinimize2 className="size-3" />
                ) : (
                  <FiMaximize2 className="size-3" />
                )}
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
              {siteConfig.featuredProjects.map((p) => (
                <div
                  key={p.title}
                  className="p-3 rounded-lg bg-[#272220]/80 border border-white/5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-zinc-100">{p.title}</h4>
                    {p.stars !== undefined && p.stars > 0 && (
                      <span className="text-[11px] font-mono text-primary font-bold">
                        ★ {p.stars}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-300 mt-1 line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {p.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/40 text-zinc-400 border border-white/5"
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

        {/* 3. Blog Notes Window */}
        {windows.blog.isOpen && (
          <div
            style={getTilingStyle("blog")}
            onClick={() => focusWindow("blog")}
            className={`flex flex-col rounded-xl border border-white/10 bg-[#1c1917]/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden ${
              windows.blog.isMinimized ? "hidden" : ""
            }`}
          >
            <div
              onMouseDown={(e) => handleMouseDownHeader(e, "blog")}
              onDoubleClick={() => toggleMaximize("blog")}
              className="flex items-center justify-between px-3.5 py-2 border-b border-white/10 bg-[#272220]/95 select-none cursor-move shrink-0"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => closeWindow("blog")}
                  className="size-3 rounded-full bg-[#ff5f56] hover:brightness-110 border border-[#e0443e]/80 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => minimizeWindow("blog")}
                  className="size-3 rounded-full bg-[#ffbd2e] hover:brightness-110 border border-[#dea123]/80 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => toggleMaximize("blog")}
                  className="size-3 rounded-full bg-[#27c93f] hover:brightness-110 border border-[#1aab29]/80 cursor-pointer"
                />
              </div>
              <span className="text-xs font-medium text-zinc-300 pointer-events-none truncate max-w-[60%]">
                Notes & Articles
              </span>
              <button
                type="button"
                onClick={() => toggleMaximize("blog")}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                {windows.blog.isMaximized ? (
                  <FiMinimize2 className="size-3" />
                ) : (
                  <FiMaximize2 className="size-3" />
                )}
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
              {[
                {
                  title: "Anatomy of a File System Race Condition",
                  slug: "anatomy-of-a-file-system-race-condition",
                  date: "2026-11-10",
                },
                {
                  title: "Myers Diff Algorithm in Deep Dive",
                  slug: "myers-diff-algorithm",
                  date: "2026-10-24",
                },
                {
                  title: "DSA Sheet 2027: Systems & Algorithmic Patterns",
                  slug: "dsa-sheet-2027",
                  date: "2026-09-15",
                },
              ].map((article) => (
                <a
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="block p-3 rounded-lg bg-[#272220]/80 border border-white/5 hover:border-primary/50 transition-colors group"
                >
                  <p className="text-xs font-semibold text-zinc-100 group-hover:text-primary transition-colors">
                    {article.title}
                  </p>
                  <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                    {article.date}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 4. Resume Window */}
        {windows.resume.isOpen && (
          <div
            style={getTilingStyle("resume")}
            onClick={() => focusWindow("resume")}
            className={`flex flex-col rounded-xl border border-white/10 bg-[#1c1917]/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden ${
              windows.resume.isMinimized ? "hidden" : ""
            }`}
          >
            <div
              onMouseDown={(e) => handleMouseDownHeader(e, "resume")}
              onDoubleClick={() => toggleMaximize("resume")}
              className="flex items-center justify-between px-3.5 py-2 border-b border-white/10 bg-[#272220]/95 select-none cursor-move shrink-0"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => closeWindow("resume")}
                  className="size-3 rounded-full bg-[#ff5f56] hover:brightness-110 border border-[#e0443e]/80 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => minimizeWindow("resume")}
                  className="size-3 rounded-full bg-[#ffbd2e] hover:brightness-110 border border-[#dea123]/80 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => toggleMaximize("resume")}
                  className="size-3 rounded-full bg-[#27c93f] hover:brightness-110 border border-[#1aab29]/80 cursor-pointer"
                />
              </div>
              <span className="text-xs font-medium text-zinc-300 pointer-events-none truncate max-w-[60%]">
                Resume Preview (PDF)
              </span>
              <button
                type="button"
                onClick={() => toggleMaximize("resume")}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                {windows.resume.isMaximized ? (
                  <FiMinimize2 className="size-3" />
                ) : (
                  <FiMaximize2 className="size-3" />
                )}
              </button>
            </div>

            <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
              <ResumePdfViewer />
            </div>
          </div>
        )}

        {/* 5. Terminal Window */}
        {windows.terminal.isOpen && <TerminalModal />}

        {/* Alt+Tab Quick Switcher Overlay */}
        {showSwitcher && openWindows.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#272220]/95 border border-white/20 shadow-2xl backdrop-blur-xl">
              {openWindows.map((w) => (
                <div
                  key={w.id}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl min-w-[80px] transition-all ${
                    activeWindow === w.id
                      ? "bg-primary/20 border border-primary/50 scale-105"
                      : "bg-white/5 border border-transparent"
                  }`}
                >
                  <w.icon
                    className={`size-8 ${activeWindow === w.id ? "text-primary" : "text-zinc-400"}`}
                  />
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
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#272220]/90 border border-white/15 backdrop-blur-xl shadow-2xl">
          {(
            [
              { id: "about", label: "About", icon: FiUser },
              { id: "terminal", label: "Terminal", icon: FiTerminal },
              { id: "projects", label: "Projects", icon: FiFolder },
              { id: "blog", label: "Notes", icon: FiBookOpen },
              { id: "resume", label: "Resume", icon: FiFileText },
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
                className={`group relative flex flex-col items-center justify-center size-11 rounded-xl transition-all hover:scale-115 active:scale-95 cursor-pointer ${
                  isFocused
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "hover:bg-white/10 text-zinc-300"
                }`}
                title={item.label}
              >
                <item.icon className="size-5 transition-transform group-hover:-translate-y-0.5" />
                {isRunning && (
                  <span
                    className={`size-1 rounded-full absolute bottom-1 ${
                      isFocused ? "bg-primary" : "bg-zinc-400"
                    }`}
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
