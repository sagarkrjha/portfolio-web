"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiDownload,
  FiExternalLink,
  FiMaximize2,
  FiMinimize2,
  FiRefreshCw,
  FiFileText,
  FiCheck,
} from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ResumeViewerProps {
  resumeUrl?: string;
  downloadName?: string;
  title?: string;
  lastUpdated?: string;
}

export const ResumeViewer = ({
  resumeUrl = "/sagar-resume.pdf",
  downloadName = "sagar-resume.pdf",
  title = "Sagar Kumar Jha — Resume",
  lastUpdated = "November 2026",
}: ResumeViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [key, setKey] = useState(0);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const reloadEmbed = () => {
    setKey((prev) => prev + 1);
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <div
      className={`flex flex-col transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-4 sm:p-6"
          : "w-full space-y-4"
      }`}
    >
      {/* Viewer Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:px-4 rounded-xl border border-border bg-card/80 backdrop-blur-sm shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <FiFileText className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-foreground truncate">
                {title}
              </h2>
              <Badge variant="outline" className="text-[10px] py-0 hidden sm:inline-flex">
                PDF
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              Updated {lastUpdated} • Systems & Developer Tools
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-1.5 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reloadEmbed}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            title="Reload PDF preview"
          >
            <FiRefreshCw className="size-3.5" />
            <span className="hidden sm:inline ml-1.5">Reload</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyShareLink}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            title="Copy share link"
          >
            {copied ? <FiCheck className="size-3.5 text-emerald-500" /> : <FiExternalLink className="size-3.5" />}
            <span className="hidden sm:inline ml-1.5">{copied ? "Copied" : "Share"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          >
            {isFullscreen ? <FiMinimize2 className="size-3.5" /> : <FiMaximize2 className="size-3.5" />}
            <span className="hidden sm:inline ml-1.5">
              {isFullscreen ? "Exit" : "Expand"}
            </span>
          </Button>

          <Button
            asChild
            size="sm"
            className="h-8 px-3 text-xs font-medium cursor-pointer shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href={resumeUrl} download={downloadName} target="_blank" rel="noreferrer">
              <FiDownload className="size-3.5 mr-1.5" />
              <span>Download PDF</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Embedded PDF Canvas Container */}
      <div
        className={`relative w-full rounded-xl border border-border/80 bg-muted/20 overflow-hidden shadow-inner flex flex-col ${
          isFullscreen ? "flex-1 mt-3" : "h-[75vh] sm:h-[82vh]"
        }`}
      >
        <object
          key={key}
          data={`${resumeUrl}#toolbar=1&navpanes=0&view=FitH`}
          type="application/pdf"
          className="w-full h-full rounded-xl"
          title="Sagar Kumar Jha Resume PDF Viewer"
        >
          {/* Fallback when native browser PDF viewer plugin is disabled */}
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <FiFileText className="size-6" />
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                Inline PDF Preview Unavailable
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your browser or device does not support embedded PDF frames. You can open or download the complete PDF directly.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Button asChild size="sm" variant="default" className="text-xs">
                <Link href={resumeUrl} target="_blank" rel="noreferrer">
                  <FiExternalLink className="size-3.5 mr-1.5" />
                  Open in New Tab
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="text-xs">
                <Link href={resumeUrl} download={downloadName}>
                  <FiDownload className="size-3.5 mr-1.5" />
                  Download PDF
                </Link>
              </Button>
            </div>
          </div>
        </object>
      </div>
    </div>
  );
};

export default ResumeViewer;
