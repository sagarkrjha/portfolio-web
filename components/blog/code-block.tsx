"use client";

import React, { useState } from "react";
import { FiCode, FiCopy, FiCheck } from "react-icons/fi";
import { highlightCode } from "@/lib/prism";

interface CodeBlockProps {
  code: string;
  lang: string;
  highlightedHtml?: string | null;
  language?: string;
}

export function CodeBlock({
  code,
  lang,
  highlightedHtml: initialHtml,
  language: initialLang,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If highlightedHtml wasn't precomputed (or in client component), compute it
  const { highlightedHtml, language } = React.useMemo(() => {
    if (initialHtml !== undefined) {
      return {
        highlightedHtml: initialHtml,
        language: initialLang || lang.toLowerCase(),
      };
    }
    return highlightCode(code, lang);
  }, [code, lang, initialHtml, initialLang]);

  return (
    <div className="relative my-5 rounded-lg border border-border bg-muted/60 p-4 font-mono text-xs sm:text-sm leading-relaxed text-foreground shadow-sm group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/50 text-[11px] text-muted-foreground select-none">
        <span className="flex items-center gap-1.5 font-mono uppercase font-semibold text-[10px] text-foreground/90">
          <FiCode className="size-3 text-primary" />
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-[10px]"
          title="Copy code snippet"
        >
          {copied ? <FiCheck className="size-3 text-emerald-400" /> : <FiCopy className="size-3" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      <div className="overflow-x-auto text-xs sm:text-sm leading-relaxed">
        {highlightedHtml ? (
          <code
            className={`language-${language} font-mono`}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Prism output is safe
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <code>{code}</code>
        )}
      </div>
    </div>
  );
}
