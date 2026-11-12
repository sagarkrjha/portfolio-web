"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  FiDownload,
  FiPrinter,
  FiRotateCw,
  FiZoomIn,
  FiZoomOut,
  FiMaximize2,
  FiMinimize2,
  FiFileText,
} from "react-icons/fi";

const Document = dynamic(() => import("react-pdf").then((mod) => mod.Document), {
  ssr: false,
});
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

export const ResumePdfViewer = () => {
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (typeof window !== "undefined") {
    import("react-pdf").then(({ pdfjs }) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    });
  }

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.15, 0.6));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleResetZoom = () => setScale(1.0);

  const handlePrint = () => {
    window.open("/sagar-resume.pdf", "_blank")?.print();
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-col transition-all duration-200 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-background w-screen h-screen p-0"
          : "w-full h-[calc(100vh-8rem)] min-h-[620px] rounded-xl overflow-hidden border border-border shadow-xl bg-card"
      }`}
    >
      {/* Top App Bar — Adaptive Theme Colors */}
      <header className="h-12 bg-muted/70 text-foreground px-3 sm:px-4 flex items-center justify-between border-b border-border select-none shrink-0 backdrop-blur-md">
        {/* Document Title */}
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <FiFileText className="size-4" />
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-tight text-foreground truncate">
            sagar-resume.pdf
          </span>
          <span className="hidden sm:inline-block text-[11px] text-muted-foreground font-mono">
            (1 / 1)
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Zoom controls */}
          <div className="flex items-center bg-background/80 rounded-lg px-1 py-0.5 border border-border">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={scale <= 0.6}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <FiZoomOut className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={scale >= 2.0}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <FiZoomIn className="size-3.5" />
            </button>
          </div>

          {/* Rotate clockwise */}
          <button
            type="button"
            onClick={handleRotate}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            title="Rotate clockwise"
            aria-label="Rotate clockwise"
          >
            <FiRotateCw className="size-4" />
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
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
            <FiDownload className="size-4" />
          </Link>

          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <FiMinimize2 className="size-4" /> : <FiMaximize2 className="size-4" />}
          </button>
        </div>
      </header>

      {/* PDF View Workspace — Adaptive theme background */}
      <main className="flex-1 bg-muted/30 dark:bg-zinc-950/40 overflow-auto p-4 sm:p-6 flex items-start justify-center">
        <div className="shadow-lg rounded-sm bg-white overflow-hidden border border-border/40">
          <Document
            file="/sagar-resume.pdf"
            loading={
              <div className="flex items-center justify-center p-16 text-xs text-muted-foreground font-mono">
                Loading document...
              </div>
            }
            error={
              <div className="p-8 text-center text-xs text-destructive font-mono">
                Failed to render PDF document.
              </div>
            }
          >
            <Page
              pageNumber={1}
              scale={scale}
              rotate={rotation}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      </main>
    </div>
  );
};

export default ResumePdfViewer;
