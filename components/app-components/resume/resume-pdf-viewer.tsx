"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiMaximize2,
  FiMinimize2,
  FiMove,
  FiPrinter,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";

const Document = dynamic(() => import("react-pdf").then((mod) => mod.Document), {
  ssr: false,
});
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

export const ResumePdfViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [userZoomMultiplier, setUserZoomMultiplier] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Drag-to-pan state (mouse dragging on desktop when zoomed)
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    scrollLeft: number;
    scrollTop: number;
  }>({
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  // Set worker safely on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("react-pdf").then(({ pdfjs }) => {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      });
    }
  }, []);

  // Update container width and detect mobile viewport with ResizeObserver
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    if (!containerRef.current) return () => window.removeEventListener("resize", handleResize);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleZoomIn = () => setUserZoomMultiplier((prev) => Math.min(prev + 0.15, 2.5));
  const handleZoomOut = () => setUserZoomMultiplier((prev) => Math.max(prev - 0.15, 0.5));
  const handleResetZoom = () => setUserZoomMultiplier(1.0);

  const handlePrint = () => {
    window.open("/sagar-resume.pdf", "_blank")?.print();
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Mouse pan event handlers for desktop when zoomed in
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag with primary mouse button and not on interactive links/buttons
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("a, button, input, textarea")) return;

    if (!containerRef.current) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: containerRef.current.scrollLeft,
      scrollTop: containerRef.current.scrollTop,
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return;
      e.preventDefault();
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      containerRef.current.scrollLeft = dragStartRef.current.scrollLeft - dx;
      containerRef.current.scrollTop = dragStartRef.current.scrollTop - dy;
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Calculate target page width to naturally fit mobile while allowing zoom
  const targetPageWidth = containerWidth
    ? Math.max(260, Math.round((containerWidth - (isMobile ? 24 : 48)) * userZoomMultiplier))
    : undefined;

  const isZoomed = userZoomMultiplier > 1.0;

  return (
    <div
      className={`flex flex-col transition-all duration-200 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-background w-screen h-screen p-0"
          : "w-full h-[calc(100vh-8rem)] min-h-[520px] sm:min-h-[640px] rounded-xl overflow-hidden border border-border shadow-xl bg-card"
      }`}
    >
      {/* Top App Bar */}
      <header className="h-12 bg-muted/70 text-foreground px-2.5 sm:px-4 flex items-center justify-between border-b border-border select-none shrink-0 backdrop-blur-md">
        {/* Document Title */}
        <div className="flex items-center gap-2 min-w-0 pr-1">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
            <FiFileText className="size-4" />
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-tight text-foreground truncate">
            sagar-resume.pdf
          </span>
          <span className="hidden md:inline-block text-[11px] text-muted-foreground font-mono">
            (1 / 1)
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Zoom controls */}
          <div className="flex items-center bg-background/80 rounded-lg px-0.5 sm:px-1 py-0.5 border border-border">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={userZoomMultiplier <= 0.5}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <FiZoomOut className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-1.5 sm:px-2 font-mono text-[10px] sm:text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              {Math.round(userZoomMultiplier * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={userZoomMultiplier >= 2.5}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <FiZoomIn className="size-3.5" />
            </button>
          </div>

          {/* Print (hidden on narrow screens to save space) */}
          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:inline-flex p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            title="Print resume"
            aria-label="Print resume"
          >
            <FiPrinter className="size-4" />
          </button>

          {/* Download */}
          <Link
            href="/sagar-resume.pdf"
            download="sagar-resume.pdf"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            title="Download resume PDF"
            aria-label="Download resume PDF"
          >
            <FiDownload className="size-3.5 sm:size-4" />
          </Link>

          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <FiMinimize2 className="size-3.5 sm:size-4" />
            ) : (
              <FiMaximize2 className="size-3.5 sm:size-4" />
            )}
          </button>
        </div>
      </header>

      {/* PDF View Workspace with smooth bidirectional scrolling and pan cursor */}
      <main
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex-1 bg-muted/30 dark:bg-zinc-950/40 overflow-x-auto overflow-y-auto p-2 sm:p-6 touch-pan-x touch-pan-y overscroll-contain select-none ${
          isZoomed ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
        }`}
      >
        <div className="min-w-fit min-h-full flex items-start justify-center m-auto">
          <div className="shadow-lg rounded-sm bg-white overflow-visible border border-border/40 select-text">
            <Document
              file="/sagar-resume.pdf"
              loading={
                <div className="flex items-center justify-center p-12 text-xs text-muted-foreground font-mono">
                  Loading document...
                </div>
              }
              error={
                <div className="p-8 text-center text-xs text-destructive font-mono space-y-3">
                  <p>Failed to render PDF preview directly.</p>
                  <a
                    href="/sagar-resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary underline"
                  >
                    Open PDF in new tab <FiExternalLink className="size-3" />
                  </a>
                </div>
              }
            >
              <Page
                pageNumber={1}
                width={targetPageWidth}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </div>
        </div>
      </main>

      {/* Mobile helper hint when zoomed in */}
      {isZoomed && isMobile && (
        <div className="py-1 px-3 bg-primary/10 text-primary border-t border-border flex items-center justify-center gap-1.5 text-[11px] font-mono shrink-0 animate-fade-in">
          <FiMove className="size-3" />
          <span>Swipe horizontally or drag to navigate zoomed page</span>
        </div>
      )}
    </div>
  );
};

export default ResumePdfViewer;
