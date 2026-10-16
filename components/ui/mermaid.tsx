"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { FiZoomIn, FiZoomOut, FiRotateCcw, FiMaximize2, FiX } from "react-icons/fi";

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const [svgContent, setSvgContent] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalScale, setModalScale] = useState<number>(1);
  const [modalPan, setModalPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!chart.trim()) return;

      try {
        const mermaid = (await import("mermaid")).default;
        const isDark = resolvedTheme === "dark";

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "neutral",
          securityLevel: "loose",
          fontFamily: "inherit",
          themeVariables: {
            darkMode: isDark,
            background: isDark ? "#0f172a" : "#ffffff",
            primaryColor: isDark ? "#38bdf8" : "#0284c7",
            primaryTextColor: isDark ? "#f8fafc" : "#0f172a",
            lineColor: isDark ? "#64748b" : "#94a3b8",
            fontSize: "13px",
          },
        });

        const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`;
        const { svg } = await mermaid.render(id, chart.trim());

        if (isMounted) {
          setSvgContent(svg);
          setHasError(false);
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        if (isMounted) {
          setHasError(true);
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, resolvedTheme]);

  // Handle escape key to close modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    }
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Zoom controls for inline view
  const handleZoomIn = () => setScale((s) => Number((Math.min(s + 0.2, 3.0)).toFixed(2)));
  const handleZoomOut = () => setScale((s) => Number((Math.max(s - 0.2, 0.4)).toFixed(2)));
  const handleResetZoom = () => setScale(1);

  // Zoom controls for modal view
  const handleModalZoomIn = () => setModalScale((s) => Number((Math.min(s + 0.25, 4.0)).toFixed(2)));
  const handleModalZoomOut = () => setModalScale((s) => Number((Math.max(s - 0.25, 0.3)).toFixed(2)));
  const handleModalReset = () => {
    setModalScale(1);
    setModalPan({ x: 0, y: 0 });
  };

  const openModal = () => {
    setModalScale(1);
    setModalPan({ x: 0, y: 0 });
    setIsModalOpen(true);
  };

  // Pan dragging in modal
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - modalPan.x,
      y: e.clientY - modalPan.y,
    };
  }, [modalPan]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setModalPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    },
    [isDragging],
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (hasError) {
    return (
      <div className="my-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-xs font-mono text-destructive">
        <p className="font-semibold mb-1">Failed to render diagram:</p>
        <pre className="overflow-x-auto text-[11px] whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div className="my-6 flex items-center justify-center rounded-lg border border-border bg-muted/20 py-12 text-xs text-muted-foreground animate-pulse">
        Rendering diagram...
      </div>
    );
  }

  return (
    <>
      <div className="group relative my-6 rounded-lg border border-border bg-muted/30 overflow-hidden">
        {/* Floating Toolbar */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 rounded-md border border-border/80 bg-background/95 px-2 py-1 backdrop-blur-md opacity-90 group-hover:opacity-100 transition-opacity shadow-sm">
          <span className="text-[10px] font-mono text-muted-foreground mr-1 select-none">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <FiZoomIn className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <FiZoomOut className="size-3.5" />
          </button>
          {scale !== 1 && (
            <button
              type="button"
              onClick={handleResetZoom}
              title="Reset Zoom"
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-[10px] font-mono cursor-pointer"
            >
              <FiRotateCcw className="size-3.5" />
            </button>
          )}
          <div className="h-3 w-px bg-border mx-0.5" />
          <button
            type="button"
            onClick={openModal}
            title="Full-Screen View"
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <FiMaximize2 className="size-3.5" />
          </button>
        </div>

        {/* Inline Diagram View */}
        <div
          ref={containerRef}
          className="overflow-auto p-4 sm:p-8 flex justify-center items-center min-h-[180px]"
        >
          <div
            style={{
              zoom: scale !== 1 ? scale : undefined,
              transform: typeof window !== "undefined" && !("zoom" in document.documentElement.style) && scale !== 1 ? `scale(${scale})` : undefined,
              transformOrigin: "center center",
            }}
            className="transition-transform duration-100 ease-out flex justify-center [&_svg]:max-w-none [&_svg]:h-auto"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Mermaid SVG output is trusted
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      </div>

      {/* Full-Screen Modal View */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 sm:p-8"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Modal Container */}
          <div
            className="relative flex flex-col w-full h-full max-w-6xl max-h-[92vh] rounded-xl border border-border bg-background shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Toolbar */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/40 select-none">
              <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <span>Diagram Preview</span>
                <span className="text-[11px] font-mono bg-muted px-2 py-0.5 rounded text-foreground">
                  {Math.round(modalScale * 100)}%
                </span>
                <span className="hidden sm:inline text-[11px] text-muted-foreground/80">
                  (Click and drag to pan)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleModalZoomIn}
                  title="Zoom In"
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <FiZoomIn className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleModalZoomOut}
                  title="Zoom Out"
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <FiZoomOut className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleModalReset}
                  title="Reset View"
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <FiRotateCcw className="size-4" />
                </button>
                <div className="h-4 w-px bg-border mx-1" />
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  title="Close (Esc)"
                  className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                >
                  <FiX className="size-4" />
                </button>
              </div>
            </div>

            {/* Modal Interactive Canvas */}
            <div
              ref={modalContainerRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              className={`flex-1 overflow-hidden flex items-center justify-center p-6 bg-muted/10 relative ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
            >
              <div
                style={{
                  transform: `translate(${modalPan.x}px, ${modalPan.y}px) scale(${modalScale})`,
                  transformOrigin: "center center",
                }}
                className="select-none transition-transform duration-75 ease-out flex justify-center [&_svg]:max-w-none [&_svg]:h-auto"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Mermaid SVG output is trusted
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
