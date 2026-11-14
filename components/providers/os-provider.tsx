"use client";

import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { siteConfig } from "@/lib/config";

interface OsContextType {
  isOsMode: boolean;
  isTransitioning: boolean;
  transitionPhase: "booting" | "shutting-down" | null;
  toggleOsMode: () => void;
  setOsMode: (enabled: boolean) => void;
}

const OsContext = createContext<OsContextType>({
  isOsMode: false,
  isTransitioning: false,
  transitionPhase: null,
  toggleOsMode: () => {},
  setOsMode: () => {},
});

export const OsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOsMode, setIsOsMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<"booting" | "shutting-down" | null>(null);

  useEffect(() => {
    try {
      // Disallow OS mode on mobile viewports (< 768px)
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setIsOsMode(false);
        return;
      }
      // Use sessionStorage so OS mode never permanently overwrites the primary browser session across new tabs/windows
      const savedSession = sessionStorage.getItem("portfolio_os_mode");
      if (savedSession === "true") {
        setIsOsMode(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setOsMode = (enabled: boolean) => {
    // Prevent OS mode on mobile devices
    if (enabled && typeof window !== "undefined" && window.innerWidth < 768) {
      return;
    }

    if (enabled === isOsMode || isTransitioning) return;

    setIsTransitioning(true);
    setTransitionPhase(enabled ? "booting" : "shutting-down");

    // Full 2000ms authentic macOS boot / shutdown sequence
    setTimeout(() => {
      setIsOsMode(enabled);
      try {
        sessionStorage.setItem("portfolio_os_mode", enabled ? "true" : "false");
        // Also remove legacy localStorage override so future browser sessions default cleanly to standard mode
        localStorage.removeItem("portfolio_os_mode");
      } catch {
        // Ignore
      }
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionPhase(null);
      }, 350);
    }, 2000);
  };

  const toggleOsMode = () => {
    setOsMode(!isOsMode);
  };

  useEffect(() => {
    if (isOsMode) {
      document.documentElement.classList.add("os-mode-active");
      document.body.classList.add("os-mode-active");
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.classList.remove("os-mode-active");
        document.body.classList.remove("os-mode-active");
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
      };
    } else {
      document.documentElement.classList.remove("os-mode-active");
      document.body.classList.remove("os-mode-active");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }, [isOsMode]);

  return (
    <OsContext.Provider
      value={{ isOsMode, isTransitioning, transitionPhase, toggleOsMode, setOsMode }}
    >
      {children}

      {/* Global 2-Second Carbon OS Transition Sequence */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="os-transition-curtain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center select-none"
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col items-center text-center gap-6"
            >
              {/* Apple / Carbon Boot Logo with Ambient Glow */}
              <div className="relative">
                <div className="absolute -inset-6 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <span className="text-white text-6xl sm:text-7xl font-light tracking-tighter drop-shadow-[0_0_35px_rgba(255,255,255,0.45)]">
                  
                </span>
              </div>

              {/* Exact Requested Typography: "Carbon OS \nbooting" */}
              <div className="space-y-1">
                <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight font-sans">
                  Carbon OS
                </h1>
                <p className="text-zinc-400 font-mono text-sm tracking-wider uppercase animate-pulse">
                  {transitionPhase === "booting" ? "booting" : "shutting down"}
                </p>
              </div>

              {/* Precise 2-Second Loading Progress Bar */}
              <div className="w-56 h-1.5 bg-zinc-800/90 rounded-full overflow-hidden border border-white/10 mt-1">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.9, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-zinc-100 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                />
              </div>

              <span className="text-zinc-500 font-mono text-[11px] tracking-widest uppercase">
                {siteConfig.terminal.unixUser}@{siteConfig.github.username}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </OsContext.Provider>
  );
};

export const useOsMode = () => useContext(OsContext);
