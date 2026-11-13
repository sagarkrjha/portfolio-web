"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiFastForward } from "react-icons/fi";

const WELCOME_TEXT = "Welcome";
const NAME_TEXT = "I am Sagar Kumar Jha";

export const IntroAnimation = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [stage, setStage] = useState<"welcome" | "name">("welcome");
  const [typedWelcome, setTypedWelcome] = useState("");
  const isInitialMount = useRef(true);

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    for (const t of timersRef.current) {
      clearTimeout(t);
    }
    timersRef.current = [];
  };

  const handleDismiss = useCallback(() => {
    clearTimers();
    setIsVisible(false);
  }, []);

  const runIntro = useCallback(() => {
    clearTimers();
    setIsVisible(true);
    setStage("welcome");
    setTypedWelcome("");

    // Start typing Welcome after 250ms initial delay
    const startTimer = setTimeout(() => {
      let idx = 0;
      const interval = setInterval(() => {
        idx += 1;
        setTypedWelcome(WELCOME_TEXT.slice(0, idx));

        if (idx >= WELCOME_TEXT.length) {
          clearInterval(interval);
          // Transition to Stage 2: Rotational reveal of "I am Sagar Kumar Jha"
          const tName = setTimeout(() => {
            setStage("name");
          }, 350);
          timersRef.current.push(tName);
        }
      }, 70);

      return () => clearInterval(interval);
    }, 250);

    timersRef.current = [startTimer];
  }, []);

  // Run on initial mount of "/" (page refresh on homepage)
  useEffect(() => {
    if (pathname === "/" && isInitialMount.current) {
      isInitialMount.current = false;
      runIntro();
      return;
    }
    isInitialMount.current = false;

    if (pathname !== "/") {
      setIsVisible(false);
      clearTimers();
    }
  }, [pathname, runIntro]);

  // When stage switches to name: hold then exit smoothly
  useEffect(() => {
    if (stage !== "name" || pathname !== "/" || !isVisible) return;

    const tExit = setTimeout(() => {
      handleDismiss();
    }, 1400);

    timersRef.current.push(tExit);
  }, [stage, pathname, isVisible, handleDismiss]);

  if (pathname !== "/" || !isVisible) return null;

  const words = NAME_TEXT.split(" ");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro-container"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "blur(8px)",
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground select-none overflow-hidden px-4"
        >
          {/* Subtle ambient theme glow in center */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background/80 to-background pointer-events-none" />

          {/* Quick Skip Button */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
            <button
              type="button"
              onClick={handleDismiss}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-card/80 hover:bg-card text-muted-foreground hover:text-foreground border border-border text-xs font-mono transition-colors cursor-pointer shadow-xs"
              title="Skip"
            >
              <span>Skip</span>
              <FiFastForward className="size-3" />
            </button>
          </div>

          {/* Center Focus Area without extra fluff */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-xl mx-auto w-full min-h-[160px]">
            <AnimatePresence mode="wait">
              {/* Item 1: Welcome (Typewriter effect) */}
              {stage === "welcome" && (
                <motion.div
                  key="stage-welcome"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="inline-flex items-center text-4xl sm:text-6xl md:text-7xl font-mono font-extrabold text-foreground tracking-tight"
                >
                  <span>{typedWelcome}</span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="inline-block w-3 sm:w-4 h-9 sm:h-14 bg-primary ml-1.5 align-middle"
                  />
                </motion.div>
              )}

              {/* Item 2: I am Sagar Kumar Jha (Rotational reveal animation) */}
              {stage === "name" && (
                <motion.div
                  key="stage-name"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5"
                  style={{ perspective: 1000 }}
                >
                  {words.map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{
                        opacity: 0,
                        rotateX: -90,
                        rotateY: 20,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        rotateX: 0,
                        rotateY: 0,
                        y: 0,
                      }}
                      transition={{
                        delay: i * 0.1,
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-sans inline-block ${
                        word === "Sagar" || word === "Kumar" || word === "Jha"
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
