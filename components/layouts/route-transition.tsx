"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface RouteTransitionProps {
  children: ReactNode;
}

const getRouteLabel = (path: string): string => {
  if (path === "/" || !path) return "Home";
  if (path.startsWith("/blog/")) {
    const slug = path.replace("/blog/", "");
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  const clean = path.replace(/^\//, "").split("/")[0];
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

export const RouteTransition = ({ children }: RouteTransitionProps) => {
  const pathname = usePathname();
  // Holds route label if full-screen loading animation is active
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;

    // If refreshing directly on "/" (prev was "/" and still "/"), IntroAnimation handles it
    if (pathname === "/" && prev === "/") {
      setLoadingRoute(null);
      return;
    }

    // When navigating to Home from any other route, or navigating between subroutes
    const label = getRouteLabel(pathname);
    setLoadingRoute(label);

    const timer = setTimeout(() => {
      setLoadingRoute(null);
    }, 450);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="relative w-full">
      {/* Full-Screen Loading Animation for route transitions & subroute refreshes */}
      <AnimatePresence>
        {loadingRoute && (
          <motion.div
            key={`route-loading-${pathname}`}
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.25, ease: "easeOut" },
            }}
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-background text-foreground select-none px-4"
          >
            {/* Subtle radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background/80 to-background pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              {/* Spinner */}
              <div className="relative flex items-center justify-center size-14 rounded-none border-2 border-primary/20 bg-card shadow-xl">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                  className="absolute inset-0 rounded-none border-2 border-transparent border-t-primary"
                />
                <div className="size-2 rounded-none bg-primary animate-pulse" />
              </div>

              {/* Loading <route name> Text */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1"
              >
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                  Loading{" "}
                  <span className="text-primary font-mono">{loadingRoute}</span>
                </h2>
                <p className="text-xs font-mono text-muted-foreground">
                  Preparing views and data...
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main page transition */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default RouteTransition;
