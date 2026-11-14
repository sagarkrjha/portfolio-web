"use client";

import React, { useState, useEffect } from "react";
import {
  FiTerminal,
  FiUser,
  FiFolder,
  FiFileText,
  FiBookOpen,
  FiX,
  FiMinus,
  FiMaximize2,
  FiGrid,
  FiWifi,
  FiVolume2,
  FiBatteryCharging,
  FiExternalLink,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useTheme } from "next-themes";
import { useOsMode } from "@/components/providers";
import { siteConfig } from "@/lib/config";
import TerminalModal from "@/components/app-components/terminal/terminal";
import { ResumePdfViewer } from "@/components/app-components/resume";
import cachedData from "@/lib/generated/portfolio-data.json";

type WindowId = "terminal" | "about" | "projects" | "blog" | "resume";

interface OsWindow {
  id: WindowId;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export const DesktopOs = () => {
  const { isOsMode, toggleOsMode } = useOsMode();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [time, setTime] = useState("");
  const [activeWindow, setActiveWindow] = useState<WindowId | null>("about");
  const [topZ, setTopZ] = useState(10);

  const [windows, setWindows] = useState<Record<WindowId, OsWindow>>({
    about: {
      id: "about",
      title: "About Sagar",
      icon: FiUser,
      isOpen: true,
      isMinimized: false,
      zIndex: 1,
    },
    terminal: {
      id: "terminal",
      title: "Carbon Shell (bash)",
      icon: FiTerminal,
      isOpen: false,
      isMinimized: false,
      zIndex: 2,
    },
    projects: {
      id: "projects",
      title: "Projects & Repositories",
      icon: FiFolder,
      isOpen: false,
      isMinimized: false,
      zIndex: 3,
    },
    blog: {
      id: "blog",
      title: "Technical Writings",
      icon: FiBookOpen,
      isOpen: false,
      isMinimized: false,
      zIndex: 4,
    },
    resume: {
      id: "resume",
      title: "Resume (PDF)",
      icon: FiFileText,
      isOpen: false,
      isMinimized: false,
      zIndex: 5,
    },
  });

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

  if (!isOsMode) return null;

  const focusWindow = (id: WindowId) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setActiveWindow(id);
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
        zIndex: nextZ,
      },
    }));
  };

  const closeWindow = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const minimizeWindow = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const toggleWindow = (id: WindowId) => {
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
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#1c1917] text-[#f4f4f4] font-sans select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top OS Menu Bar */}
      <header className="h-7 w-full bg-[#272220]/95 border-b border-white/10 px-3 flex items-center justify-between text-xs backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-primary">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span>Carbon OS</span>
          </div>
          <span className="text-white/20">|</span>
          <span className="font-medium text-zinc-300">
            {activeWindow ? windows[activeWindow].title : "Desktop"}
          </span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="hover:text-zinc-100 transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {isDark ? <FiSun className="size-3.5" /> : <FiMoon className="size-3.5" />}
          </button>
          <FiWifi className="size-3.5" />
          <FiVolume2 className="size-3.5" />
          <FiBatteryCharging className="size-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-zinc-200">{time}</span>

          {/* Return to standard Web Mode */}
          <button
            type="button"
            onClick={toggleOsMode}
            className="ml-2 px-2 py-0.5 rounded-none bg-primary hover:brightness-110 text-primary-foreground font-medium text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-xs"
            title="Exit OS Mode & Return to Web View"
          >
            <span>Exit OS</span>
            <FiExternalLink className="size-3" />
          </button>
        </div>
      </header>

      {/* Desktop Workspace */}
      <main className="relative flex-1 p-4 sm:p-6 overflow-hidden">
        {/* Desktop Shortcut Icons */}
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
              <div className="size-12 rounded-xl bg-[#272220] border border-white/10 flex items-center justify-center text-primary shadow-lg group-hover:scale-105 transition-transform">
                <item.icon className="size-6" />
              </div>
              <span className="text-[11px] font-mono text-zinc-300 drop-shadow-md truncate max-w-[76px]">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Windows Rendering Layer */}

        {/* 1. About Window */}
        {windows.about.isOpen && (
          <div
            style={{ zIndex: windows.about.zIndex }}
            onClick={() => focusWindow("about")}
            className={`absolute top-8 left-4 sm:left-28 w-[92vw] sm:w-[680px] max-h-[80vh] flex flex-col rounded-xl border border-white/10 bg-[#1c1917]/95 shadow-2xl backdrop-blur-md overflow-hidden ${
              windows.about.isMinimized ? "hidden" : ""
            }`}
          >
            {/* Titlebar */}
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/10 bg-[#272220]/95 select-none">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => closeWindow("about")}
                  className="size-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/80"
                />
                <button
                  type="button"
                  onClick={() => minimizeWindow("about")}
                  className="size-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/80"
                />
                <button
                  type="button"
                  className="size-3 rounded-full bg-[#27c93f] border border-[#1aab29]/80"
                />
              </div>
              <span className="text-xs font-medium text-zinc-300">About — {siteConfig.name}</span>
              <div className="w-12" />
            </div>

            {/* Content */}
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
                  <span className="text-zinc-400 block text-[10px]">CURRENT FOCUS</span>
                  <span className="text-zinc-100 font-medium">Systems, C++ & Rust</span>
                </div>
                <div className="p-2.5 rounded bg-[#272220] border border-white/5">
                  <span className="text-zinc-400 block text-[10px]">LEETCODE SOLVED</span>
                  <span className="text-primary font-bold">
                    {cachedData.leetcode?.totalSolved ?? 710}+ Problems
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Projects Window */}
        {windows.projects.isOpen && (
          <div
            style={{ zIndex: windows.projects.zIndex }}
            onClick={() => focusWindow("projects")}
            className={`absolute top-12 left-6 sm:left-40 w-[94vw] sm:w-[720px] max-h-[82vh] flex flex-col rounded-xl border border-white/10 bg-[#1c1917]/95 shadow-2xl backdrop-blur-md overflow-hidden ${
              windows.projects.isMinimized ? "hidden" : ""
            }`}
          >
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/10 bg-[#272220]/95 select-none">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => closeWindow("projects")}
                  className="size-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/80"
                />
                <button
                  type="button"
                  onClick={() => minimizeWindow("projects")}
                  className="size-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/80"
                />
                <button
                  type="button"
                  className="size-3 rounded-full bg-[#27c93f] border border-[#1aab29]/80"
                />
              </div>
              <span className="text-xs font-medium text-zinc-300">Repositories & Projects</span>
              <div className="w-12" />
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
            style={{ zIndex: windows.blog.zIndex }}
            onClick={() => focusWindow("blog")}
            className={`absolute top-16 left-8 sm:left-48 w-[92vw] sm:w-[640px] max-h-[80vh] flex flex-col rounded-xl border border-white/10 bg-[#1c1917]/95 shadow-2xl backdrop-blur-md overflow-hidden ${
              windows.blog.isMinimized ? "hidden" : ""
            }`}
          >
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/10 bg-[#272220]/95 select-none">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => closeWindow("blog")}
                  className="size-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/80"
                />
                <button
                  type="button"
                  onClick={() => minimizeWindow("blog")}
                  className="size-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/80"
                />
                <button
                  type="button"
                  className="size-3 rounded-full bg-[#27c93f] border border-[#1aab29]/80"
                />
              </div>
              <span className="text-xs font-medium text-zinc-300">Technical Articles</span>
              <div className="w-12" />
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

        {/* 4. Resume Viewer Window */}
        {windows.resume.isOpen && (
          <div
            style={{ zIndex: windows.resume.zIndex }}
            onClick={() => focusWindow("resume")}
            className={`absolute top-10 left-4 sm:left-36 w-[94vw] sm:w-[760px] h-[82vh] flex flex-col rounded-xl border border-white/10 bg-[#1c1917]/95 shadow-2xl backdrop-blur-md overflow-hidden ${
              windows.resume.isMinimized ? "hidden" : ""
            }`}
          >
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/10 bg-[#272220]/95 select-none shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => closeWindow("resume")}
                  className="size-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/80"
                />
                <button
                  type="button"
                  onClick={() => minimizeWindow("resume")}
                  className="size-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/80"
                />
                <button
                  type="button"
                  className="size-3 rounded-full bg-[#27c93f] border border-[#1aab29]/80"
                />
              </div>
              <span className="text-xs font-medium text-zinc-300">Resume Preview</span>
              <div className="w-12" />
            </div>

            <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
              <ResumePdfViewer />
            </div>
          </div>
        )}

        {/* 5. Terminal Window Triggered in OS mode */}
        {windows.terminal.isOpen && (
          <TerminalModal />
        )}
      </main>

      {/* Bottom Floating Dock */}
      <footer className="h-16 w-full flex items-center justify-center pb-2 z-50">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#272220]/90 border border-white/15 backdrop-blur-xl shadow-2xl">
          {(
            [
              { id: "about", label: "About", icon: FiUser },
              { id: "terminal", label: "Terminal", icon: FiTerminal },
              { id: "projects", label: "Projects", icon: FiFolder },
              { id: "blog", label: "Articles", icon: FiBookOpen },
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
