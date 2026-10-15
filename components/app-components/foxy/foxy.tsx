"use client";

import React, { useState, useEffect, useRef } from "react";

// Sprite mapping coordinates (multiplied by 32px) from foxy.gif
const SPRITES: Record<string, [number, number][]> = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [
    [-5, 0],
    [-6, 0],
    [-7, 0],
  ],
  tired: [[-3, -2]],
  sleeping: [
    [-2, 0],
    [-2, -1],
  ],
  N: [
    [-1, -2],
    [-1, -3],
  ],
  NE: [
    [0, -2],
    [0, -3],
  ],
  E: [
    [-3, 0],
    [-3, -1],
  ],
  SE: [
    [-5, -1],
    [-5, -2],
  ],
  S: [
    [-6, -3],
    [-7, -2],
  ],
  SW: [
    [-5, -3],
    [-6, -1],
  ],
  W: [
    [-4, -2],
    [-4, -3],
  ],
  NW: [
    [-1, 0],
    [-1, -1],
  ],
};

const DIALOGUES = [
  "I'm Foxy! 🐾",
  "Chasing your cursor! ✨",
  "Nice moves! 🚀",
  "Click me to switch mode! 🦊",
  "Exploring the portfolio with sagar... 🔍",
  "Purr... meow! 🐱",
  "Don't forget to check the terminal! 💻",
  "*happy foxy noises* 🎶",
];

export const Foxy = () => {
  // Check if device has an accurate pointing device (mouse / trackpad)
  const [hasMouse, setHasMouse] = useState<boolean>(false);

  // Mode: "watch" (stays in top-right corner, resting/watching) or "run" (chases cursor over whole screen)
  const [mode, setMode] = useState<"watch" | "run">("watch");
  const [speech, setSpeech] = useState<string | null>("Hi, I'm Foxy! 🦊");
  const [currentCoord, setCurrentCoord] = useState<[number, number]>([-3, -3]); // idle sprite
  const [pos, setPos] = useState({ x: 100, y: 100 });

  const cursorRef = useRef<{ x: number; y: number }>({ x: 200, y: 200 });
  const foxyPosRef = useRef<{ x: number; y: number }>({ x: 100, y: 100 });
  const frameCountRef = useRef(0);
  const idleTimeRef = useRef(0);
  const idleAnimRef = useRef<string | null>(null);
  const idleFrameRef = useRef(0);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect whether device has a precise pointer (mouse or trackpad)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(pointer: fine)");
    setHasMouse(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setHasMouse(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Initial greeting bubble timeout
  useEffect(() => {
    if (!hasMouse) return;

    speechTimeoutRef.current = setTimeout(() => {
      setSpeech(null);
    }, 4000);
    return () => {
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    };
  }, [hasMouse]);

  // Track cursor position
  useEffect(() => {
    if (!hasMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hasMouse]);

  // Animation & movement loop
  useEffect(() => {
    if (!hasMouse) return;

    let animId: number;

    const tick = () => {
      frameCountRef.current += 1;

      if (mode === "run") {
        const mouseX = cursorRef.current.x;
        const mouseY = cursorRef.current.y;
        const diffX = foxyPosRef.current.x - mouseX;
        const diffY = foxyPosRef.current.y - mouseY;
        const distance = Math.hypot(diffX, diffY);

        if (distance < 48) {
          // Reached cursor: idle animations
          idleTimeRef.current += 1;

          if (
            idleTimeRef.current > 10 &&
            Math.floor(Math.random() * 200) === 0 &&
            idleAnimRef.current === null
          ) {
            const anims = ["sleeping", "scratchSelf"];
            idleAnimRef.current = anims[Math.floor(Math.random() * anims.length)];
            idleFrameRef.current = 0;
          }

          if (idleAnimRef.current) {
            const frames = SPRITES[idleAnimRef.current];
            if (frames) {
              const frameIdx = Math.floor(frameCountRef.current / 16) % frames.length;
              setCurrentCoord(frames[frameIdx]);
              idleFrameRef.current += 1;
              if (idleFrameRef.current > 180) {
                idleAnimRef.current = null;
              }
            }
          } else {
            setCurrentCoord(SPRITES.idle[0]);
          }
        } else {
          // Chasing cursor: compute direction
          idleTimeRef.current = 0;
          idleAnimRef.current = null;

          let dir = "";
          if (diffY / distance > 0.5) dir = "N";
          else if (diffY / distance < -0.5) dir = "S";

          if (diffX / distance > 0.5) dir += "W";
          else if (diffX / distance < -0.5) dir += "E";

          const dirKey = dir || "idle";
          const frames = SPRITES[dirKey] || SPRITES.idle;
          const frameIdx = Math.floor(frameCountRef.current / 10) % frames.length;
          setCurrentCoord(frames[frameIdx]);

          // Move towards cursor at a relaxed, gentle pace
          const speed = Math.min(distance * 0.05, 4.5);
          foxyPosRef.current.x -= (diffX / distance) * speed;
          foxyPosRef.current.y -= (diffY / distance) * speed;

          setPos({ x: foxyPosRef.current.x, y: foxyPosRef.current.y });
        }
      } else {
        // "watch" mode: sit in top-right corner
        const mouseX = cursorRef.current.x;
        const mouseY = cursorRef.current.y;
        const cornerX = typeof window !== "undefined" ? window.innerWidth - 64 : 1000;
        const cornerY = 80;

        const diffX = cornerX - mouseX;
        const diffY = cornerY - mouseY;
        const distance = Math.hypot(diffX, diffY);

        let dir = "";
        if (diffY / distance > 0.5) dir = "N";
        else if (diffY / distance < -0.5) dir = "S";
        if (diffX / distance > 0.5) dir += "W";
        else if (diffX / distance < -0.5) dir += "E";

        const dirKey = dir || "idle";
        const frames = SPRITES[dirKey] || SPRITES.idle;
        // Stay still looking towards cursor
        setCurrentCoord(frames[0]);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [mode, hasMouse]);

  // Click toggle handler
  const handleToggle = () => {
    const nextMode = mode === "watch" ? "run" : "watch";
    setMode(nextMode);

    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }

    if (nextMode === "run") {
      // Start chase from top-right corner
      const startX = typeof window !== "undefined" ? window.innerWidth - 70 : 800;
      const startY = 80;
      foxyPosRef.current = { x: startX, y: startY };
      setPos({ x: startX, y: startY });
      setSpeech("Running toward your cursor! 🐾");
    } else {
      setSpeech("Stopped! Resting at top-right 🦊");
    }

    speechTimeoutRef.current = setTimeout(() => {
      setSpeech(null);
    }, 3200);
  };

  // Do not render Foxy if device does not have a mouse / precision pointer
  if (!hasMouse) {
    return null;
  }

  return (
    <>
      {/* Speech dialogue bubble */}
      {speech && (
        <div
          className="fixed z-50 whitespace-nowrap bg-background/95 text-foreground border border-amber-500/40 shadow-xl rounded-2xl px-3 py-1.5 text-xs font-mono font-medium backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 pointer-events-none max-w-[calc(100vw-32px)] truncate"
          style={{
            left:
              mode === "run"
                ? `${Math.max(16, Math.min(pos.x - 32, (typeof window !== "undefined" ? window.innerWidth : 800) - 220))}px`
                : "auto",
            right: mode === "run" ? "auto" : "16px",
            top: mode === "run" ? `${Math.max(16, pos.y - 44)}px` : "72px",
          }}
        >
          {speech}
        </div>
      )}

      {/* When in "run" mode: Foxy runs free over the entire viewport chasing cursor */}
      {mode === "run" && (
        <div
          onClick={handleToggle}
          title="Foxy is running! Click to stop 🐾"
          className="fixed z-50 cursor-pointer select-none transition-transform hover:scale-110 active:scale-95"
          style={{
            width: "32px",
            height: "32px",
            left: `${pos.x - 16}px`,
            top: `${pos.y - 16}px`,
            backgroundImage: "url('/foxy.gif')",
            imageRendering: "pixelated",
            backgroundPosition: `${currentCoord[0] * 32}px ${currentCoord[1] * 32}px`,
          }}
        />
      )}

      {/* Dock control button at top-right (responsive placement avoiding header interference) */}
      <div className="fixed top-16 sm:top-20 right-3 sm:right-6 z-40 select-none">
        <button
          type="button"
          onClick={handleToggle}
          title={
            mode === "watch" ? "Click to let Foxy run toward cursor 🐾" : "Click to stop Foxy 🦊"
          }
          className={`flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl backdrop-blur-md border shadow-lg transition-all cursor-pointer active:scale-95 ring-1 ${
            mode === "run"
              ? "bg-amber-500/15 border-amber-500 shadow-amber-500/25 ring-amber-500/30"
              : "bg-background/85 hover:bg-muted/80 border-border/80 shadow-lg hover:border-amber-500/50 ring-foreground/5"
          }`}
        >
          {/* Foxy Sprite in button */}
          <div className="relative size-8 flex items-center justify-center overflow-hidden shrink-0">
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundImage: "url('/foxy.gif')",
                imageRendering: "pixelated",
                backgroundPosition: `${currentCoord[0] * 32}px ${currentCoord[1] * 32}px`,
              }}
            />
          </div>

          {/* Label and Mode Indicator */}
          <div className="hidden sm:flex flex-col text-left pr-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-semibold text-foreground">Foxy</span>
              <span
                className={`size-1.5 rounded-full ${
                  mode === "run" ? "bg-amber-400 animate-ping" : "bg-emerald-500 animate-pulse"
                }`}
              />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {mode === "run" ? (
                <span className="text-amber-500 font-semibold">Running (click to stop)</span>
              ) : (
                <span>Click to run</span>
              )}
            </span>
          </div>
        </button>
      </div>
    </>
  );
};

export default Foxy;
