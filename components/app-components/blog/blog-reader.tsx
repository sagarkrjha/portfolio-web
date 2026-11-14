"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FiClock,
  FiCalendar,
  FiTag,
  FiExternalLink,
  FiLoader,
  FiAlertCircle,
  FiCode,
  FiEye,
  FiList,
  FiCopy,
  FiCheck,
  FiFileText,
  FiBookmark,
  FiShare2,
} from "react-icons/fi";
import { highlightCode } from "@/lib/prism";
import { Mermaid } from "@/components/ui/mermaid";

interface BlogPostData {
  meta: {
    slug: string;
    title: string;
    subtitle?: string;
    description: string;
    date: string;
    readTime: string;
    tags: string[];
  };
  content: string;
}

interface BlogReaderViewProps {
  slug: string;
  isDark: boolean;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

// Format LaTeX math expressions cleanly into readable text and symbols
function formatMathExpression(expr: string): string {
  return expr
    .replace(/\\Delta/g, "Δ")
    .replace(/\\in/g, "∈")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\ll/g, "≪")
    .replace(/\\gg/g, "≫")
    .replace(/\\dots/g, "…")
    .replace(/\\cdots/g, "⋯")
    .replace(/\\to/g, "→")
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, " · ")
    .replace(/\\{/g, "{")
    .replace(/\\}/g, "}")
    .replace(/_\{([^}]+)\}/g, "_$1")
    .replace(/\^\{([^}]+)\}/g, "^$1");
}

function renderInlineFormatted(text: string): React.ReactNode {
  const tokens = text.split(
    /(\[[^\]]+\]\([^\)]+\)|`[^`]+`|\$(?:[^\$\n]+)\$|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|(?<=\s|^)\*[^*\n]+?\*(?=\s|$|[.,:;!?]))/g,
  );

  return tokens.map((token, i) => {
    if (!token) return null;

    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4 font-medium hover:opacity-80 transition-opacity"
        >
          {renderInlineFormatted(label)}
        </a>
      );
    }

    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-black/10 dark:bg-white/10 px-1.5 py-0.5 font-mono text-xs font-medium border border-black/10 dark:border-white/10"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    if (token.startsWith("$") && token.endsWith("$") && token.length > 2) {
      const mathContent = formatMathExpression(token.slice(1, -1));
      return (
        <span
          key={i}
          className="font-mono text-xs bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded font-medium border border-black/10 dark:border-white/10 inline-block align-baseline whitespace-nowrap"
        >
          {mathContent}
        </span>
      );
    }

    if (token.startsWith("***") && token.endsWith("***") && token.length > 6) {
      return (
        <strong key={i} className="font-semibold italic">
          {renderInlineFormatted(token.slice(3, -3))}
        </strong>
      );
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {renderInlineFormatted(token.slice(2, -2))}
        </strong>
      );
    }

    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      return <em key={i} className="italic">{token.slice(1, -1)}</em>;
    }

    return token;
  });
}

function CodeBlockWithCopy({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { highlightedHtml, language } = highlightCode(code, lang);

  return (
    <div className="relative my-5 rounded-lg border border-black/10 dark:border-white/10 bg-[#1e1e1e] text-zinc-100 overflow-hidden font-mono shadow-md group">
      {/* VS Code editor file/tab header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-black/20 text-[11px] text-zinc-400 select-none">
        <span className="flex items-center gap-1.5 font-mono uppercase font-semibold text-[10px] text-zinc-300">
          <FiCode className="size-3 text-primary" />
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer text-[10px]"
          title="Copy code snippet"
        >
          {copied ? <FiCheck className="size-3 text-emerald-400" /> : <FiCopy className="size-3" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      <div className="p-4 overflow-x-auto text-xs sm:text-sm leading-relaxed">
        {highlightedHtml ? (
          <code
            className={`language-${language} font-mono`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <code>{code}</code>
        )}
      </div>
    </div>
  );
}

function renderMarkdownContent(content: string, postTitle?: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const firstLineEnd = part.indexOf("\n");
      const lang = part.slice(3, firstLineEnd).trim();
      const code = part.slice(firstLineEnd + 1, -3);

      if (lang === "mermaid") {
        return (
          <div key={index} className="my-6 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1817] p-4 shadow-sm overflow-x-auto">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-black/5 dark:border-white/5 text-[11px] font-mono opacity-70">
              <span className="flex items-center gap-1.5 font-semibold text-primary">
                <FiEye className="size-3" />
                Mermaid Diagram Preview
              </span>
            </div>
            <Mermaid chart={code} />
          </div>
        );
      }

      return <CodeBlockWithCopy key={index} code={code} lang={lang} />;
    }

    const paragraphs = part.split(/\n\n+/);
    return (
      <div key={index} className="space-y-4">
        {paragraphs.map((rawParagraph, pIdx) => {
          const trimmed = rawParagraph.trim();
          if (!trimmed) return null;

          if (trimmed === "---") {
            return <hr key={pIdx} className="my-8 border-black/10 dark:border-white/10" />;
          }

          if (trimmed.startsWith("# ")) {
            const h1Text = trimmed.replace("# ", "").trim();
            if (postTitle) {
              const cleanH1 = h1Text.replace(/[`*]/g, "").trim().toLowerCase();
              const cleanTitle = postTitle.replace(/[`*]/g, "").trim().toLowerCase();
              if (cleanH1 === cleanTitle || cleanH1.includes(cleanTitle) || cleanTitle.includes(cleanH1)) {
                return null;
              }
            }
            return (
              <h1 key={pIdx} className="text-2xl sm:text-3xl font-bold tracking-tight mt-8 mb-4">
                {renderInlineFormatted(h1Text)}
              </h1>
            );
          }
          if (trimmed.startsWith("## ")) {
            const h2Text = trimmed.replace("## ", "").trim();
            const headingId = h2Text.replace(/[`*]/g, "").toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
            return (
              <h2
                key={pIdx}
                id={headingId}
                className="scroll-mt-6 text-xl sm:text-2xl font-semibold tracking-tight mt-8 mb-3 border-b border-black/10 dark:border-white/10 pb-2"
              >
                {renderInlineFormatted(h2Text)}
              </h2>
            );
          }
          if (trimmed.startsWith("### ")) {
            const h3Text = trimmed.replace("### ", "").trim();
            const headingId = h3Text.replace(/[`*]/g, "").toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
            return (
              <h3
                key={pIdx}
                id={headingId}
                className="scroll-mt-6 text-lg sm:text-xl font-semibold tracking-tight mt-6 mb-2"
              >
                {renderInlineFormatted(h3Text)}
              </h3>
            );
          }
          if (trimmed.startsWith("#### ")) {
            return (
              <h4
                key={pIdx}
                className="text-base font-semibold tracking-tight mt-4 mb-1"
              >
                {renderInlineFormatted(trimmed.replace("#### ", ""))}
              </h4>
            );
          }

          if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
            const rawExpr = trimmed.slice(2, -2).trim();
            const formattedExpr = formatMathExpression(rawExpr);
            return (
              <div
                key={pIdx}
                className="my-5 py-4 px-5 rounded-lg bg-black/5 dark:bg-[#1a1716] border border-primary/20 text-center font-mono text-sm sm:text-base overflow-x-auto shadow-inner"
              >
                <div className="text-[10px] uppercase font-mono text-primary/70 mb-1 text-left select-none">
                  Mathematical Notation (LaTeX)
                </div>
                <div className="py-1">{formattedExpr}</div>
              </div>
            );
          }

          // Alerts or quotes
          if (trimmed.startsWith(">")) {
            const rawQuoteLines = trimmed.split("\n").map((l) => l.replace(/^>\s?/, ""));
            const firstLine = rawQuoteLines[0]?.trim() || "";
            const isAlert = firstLine.startsWith("[!");

            if (isAlert) {
              const alertTypeMatch = firstLine.match(/^\[!([A-Z]+)\]/i);
              const alertType = alertTypeMatch ? alertTypeMatch[1].toUpperCase() : "NOTE";
              const restLines = [firstLine.replace(/^\[![A-Z]+\]\s*/i, ""), ...rawQuoteLines.slice(1)].filter(
                (l) => l.trim().length > 0,
              );

              return (
                <div
                  key={pIdx}
                  className="my-4 rounded-lg border border-primary/40 bg-primary/10 p-4 text-sm leading-relaxed"
                >
                  <div className="font-semibold mb-2 text-xs uppercase tracking-wider text-primary">
                    {alertType}
                  </div>
                  <div className="space-y-2 opacity-90">
                    {restLines.map((rl, rIdx) => (
                      <p key={rIdx}>{renderInlineFormatted(rl)}</p>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <blockquote
                key={pIdx}
                className="my-4 border-l-2 border-primary/60 pl-4 py-1 space-y-2 text-sm sm:text-base italic opacity-80 bg-black/5 dark:bg-white/5 rounded-r-md"
              >
                {rawQuoteLines.map((ql, qIdx) => (
                  <p key={qIdx}>{renderInlineFormatted(ql)}</p>
                ))}
              </blockquote>
            );
          }

          // Process tables
          if (trimmed.includes("|") && trimmed.split("\n").length >= 2) {
            const tableLines = trimmed.split("\n").filter((l) => l.trim().startsWith("|") && l.trim().endsWith("|"));
            if (tableLines.length >= 2) {
              const parseRowCells = (rowStr: string): string[] => {
                const trimmedRow = rowStr.trim();
                const inner = trimmedRow.startsWith("|") && trimmedRow.endsWith("|")
                  ? trimmedRow.slice(1, -1)
                  : trimmedRow;
                const cells: string[] = [];
                let current = "";
                let inCode = false;
                for (let i = 0; i < inner.length; i++) {
                  const ch = inner[i];
                  if (ch === "`") {
                    inCode = !inCode;
                    current += ch;
                  } else if (ch === "\\" && i + 1 < inner.length && inner[i + 1] === "|") {
                    current += "|";
                    i++;
                  } else if (ch === "|" && !inCode) {
                    cells.push(current.trim());
                    current = "";
                  } else {
                    current += ch;
                  }
                }
                cells.push(current.trim());
                return cells;
              };

              const headerLine = tableLines[0];
              const delimiterLine = tableLines[1];
              if (delimiterLine.includes("---")) {
                const headerCells = parseRowCells(headerLine);
                const bodyLines = tableLines.slice(2);

                return (
                  <div key={pIdx} className="my-6 overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 font-semibold">
                        <tr>
                          {headerCells.map((h, hIdx) => (
                            <th key={hIdx} className="px-4 py-2.5">
                              {renderInlineFormatted(h)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 dark:divide-white/5">
                        {bodyLines.map((row, rIdx) => {
                          const cells = parseRowCells(row);
                          return (
                            <tr key={rIdx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                              {cells.map((cell, cIdx) => {
                                const subLines = cell.split(/<br\s*\/?>/i);
                                return (
                                  <td key={cIdx} className="px-4 py-2 opacity-90 align-top">
                                    {subLines.map((sub, sIdx) => (
                                      <div key={sIdx} className={sIdx > 0 ? "mt-1.5" : ""}>
                                        {renderInlineFormatted(sub.trim())}
                                      </div>
                                    ))}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }
            }
          }

          // Process line-by-line for structured content (nested lists, numbered steps, bullets, checkboxes, embedded math)
          const rawLines = trimmed.split("\n");
          const hasListItems = rawLines.some((l) => /^\s*(\*|-|\d+\.|- \[[ xX]\])\s/.test(l));

          if (hasListItems) {
            return (
              <div key={pIdx} className="space-y-2 my-3 text-sm sm:text-base opacity-90">
                {rawLines.map((line, lIdx) => {
                  const lineTrimmed = line.trim();
                  if (!lineTrimmed) return null;

                  // Block math within a list block:
                  if (lineTrimmed.startsWith("$$") && lineTrimmed.endsWith("$$")) {
                    const rawExpr = lineTrimmed.slice(2, -2).trim();
                    const formattedExpr = formatMathExpression(rawExpr);
                    return (
                      <div
                        key={lIdx}
                        className="my-2 py-2 px-3 rounded-md bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center font-mono text-sm sm:text-base overflow-x-auto mx-4"
                      >
                        {formattedExpr}
                      </div>
                    );
                  }

                  const isSubItem = /^\s{4,}/.test(line) || /^\t+/.test(line);
                  const isChecklist = /^\s*[-*]\s\[([ xX])\]\s/.test(line);
                  const isBullet = /^\s*[-*]\s/.test(line);
                  const isNumbered = /^\s*\d+\.\s/.test(line);

                  if (isChecklist) {
                    const checked = /\[[xX]\]/.test(lineTrimmed);
                    const cleanText = lineTrimmed.replace(/^[-*]\s\[([ xX])\]\s+/, "");
                    return (
                      <div key={lIdx} className="flex items-start gap-2.5 pt-1">
                        <input
                          type="checkbox"
                          checked={checked}
                          readOnly
                          className="mt-1 h-3.5 w-3.5 rounded accent-primary pointer-events-none"
                        />
                        <div className="leading-relaxed flex-1">
                          {renderInlineFormatted(cleanText)}
                        </div>
                      </div>
                    );
                  }

                  if (isNumbered) {
                    const cleanText = lineTrimmed.replace(/^\d+\.\s+/, "");
                    return (
                      <div key={lIdx} className="flex items-start gap-2 pt-2 first:pt-0">
                        <span className="font-semibold text-primary shrink-0 select-none">
                          {lineTrimmed.match(/^\d+\./)?.[0]}
                        </span>
                        <div className="leading-relaxed flex-1">
                          {renderInlineFormatted(cleanText)}
                        </div>
                      </div>
                    );
                  }

                  if (isBullet) {
                    const cleanText = lineTrimmed.replace(/^[-*]\s+/, "");
                    return (
                      <div
                        key={lIdx}
                        className={`flex items-start gap-2.5 ${isSubItem ? "pl-5 opacity-90" : "pt-1"}`}
                      >
                        <span className="text-primary mt-1.5 text-[8px] leading-none select-none">
                          {isSubItem ? "○" : "●"}
                        </span>
                        <div className="leading-relaxed flex-1">
                          {renderInlineFormatted(cleanText)}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={lIdx} className="leading-relaxed pl-5">
                      {renderInlineFormatted(lineTrimmed)}
                    </div>
                  );
                })}
              </div>
            );
          }

          if (trimmed.includes("\n")) {
            const lines = trimmed.split("\n");
            return (
              <p key={pIdx} className="text-sm sm:text-base leading-7 opacity-90">
                {lines.map((line, lIdx) => (
                  <React.Fragment key={lIdx}>
                    {lIdx > 0 && <br />}
                    {renderInlineFormatted(line.trim())}
                  </React.Fragment>
                ))}
              </p>
            );
          }
        })}
      </div>
    );
  });
}

export const BlogReaderView = ({ slug, isDark }: BlogReaderViewProps) => {
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");
  const [showToc, setShowToc] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetch(`/api/blog/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Article could not be loaded");
        return res.json();
      })
      .then((data) => {
        if (active) {
          setPost(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load article");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  // Extract table of contents headings
  const headings = useMemo<HeadingItem[]>(() => {
    if (!post?.content) return [];
    const list: HeadingItem[] = [];
    const lines = post.content.split("\n");
    for (const line of lines) {
      const match = line.match(/^(#{2,3})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim().replace(/[`*]/g, "");
        const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        list.push({ id, text, level });
      }
    }
    return list;
  }, [post?.content]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[380px] space-y-3 font-mono text-xs opacity-75">
        <FiLoader className="size-6 animate-spin text-primary" />
        <p>Loading article & compiling markdown AST...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[380px] p-6 text-center space-y-3">
        <FiAlertCircle className="size-8 text-amber-500" />
        <h3 className="font-semibold text-sm">Failed to open article</h3>
        <p className="text-xs opacity-75 max-w-sm">{error || "Article not found"}</p>
        <a
          href={`/blog/${slug}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-primary text-black font-semibold hover:opacity-90 transition-opacity"
        >
          <span>Open in standard browser</span>
          <FiExternalLink className="size-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full select-text">
      {/* VS Code like Editor / Markdown Header Bar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b select-none shrink-0 text-xs font-mono ${
        isDark ? "bg-[#1f1c1a] border-white/10 text-zinc-300" : "bg-[#f5f5f5] border-black/10 text-zinc-700"
      }`}>
        <div className="flex items-center gap-2 truncate">
          <FiFileText className="size-3.5 text-primary" />
          <span className="font-semibold truncate">{post.meta.slug}.md</span>
          <span className="text-[10px] opacity-60">({post.meta.readTime})</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Toggle Outline / Table of Contents */}
          {headings.length > 0 && (
            <button
              type="button"
              onClick={() => setShowToc((prev) => !prev)}
              className={`flex items-center gap-1 px-2 py-0.8 rounded text-[11px] transition-colors cursor-pointer border ${
                showToc
                  ? "bg-primary/20 text-primary border-primary/40 font-semibold"
                  : "hover:bg-black/5 dark:hover:bg-white/10 border-transparent"
              }`}
              title="Toggle Table of Contents"
            >
              <FiList className="size-3" />
              <span>Outline ({headings.length})</span>
            </button>
          )}

          {/* Toggle Markdown Preview vs Raw Source */}
          <div className="flex items-center rounded border border-black/10 dark:border-white/10 overflow-hidden text-[11px]">
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1 px-2.5 py-0.8 transition-colors cursor-pointer ${
                viewMode === "preview"
                  ? "bg-primary text-black font-bold"
                  : "hover:bg-black/5 dark:hover:bg-white/10 opacity-70"
              }`}
            >
              <FiEye className="size-3" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("raw")}
              className={`flex items-center gap-1 px-2.5 py-0.8 transition-colors cursor-pointer ${
                viewMode === "raw"
                  ? "bg-primary text-black font-bold"
                  : "hover:bg-black/5 dark:hover:bg-white/10 opacity-70"
              }`}
            >
              <FiCode className="size-3" />
              <span>Source</span>
            </button>
          </div>

          <a
            href={`/blog/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="p-1 hover:text-primary transition-colors ml-1"
            title="Open in new external browser tab"
          >
            <FiExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {/* Main Content Area: Split View when Outline is active */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table of Contents sidebar */}
        {showToc && headings.length > 0 && viewMode === "preview" && (
          <aside className={`w-56 shrink-0 border-r p-3 overflow-y-auto space-y-1 text-xs select-none ${
            isDark ? "bg-[#181514] border-white/5" : "bg-[#fbfbfb] border-black/5"
          }`}>
            <span className="text-[10px] font-mono uppercase font-bold text-primary block mb-2 px-1">
              Table of Contents
            </span>
            {headings.map((h, i) => (
              <button
                type="button"
                key={i}
                onClick={() => {
                  const el = document.getElementById(h.id);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className={`w-full text-left truncate py-1 px-1.5 rounded hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-[11px] ${
                  h.level === 3 ? "pl-4 opacity-80" : "font-medium"
                }`}
                title={h.text}
              >
                {h.text}
              </button>
            ))}
          </aside>
        )}

        {/* Article Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10">
          {viewMode === "raw" ? (
            <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap select-text opacity-90">
              {post.content}
            </pre>
          ) : (
            <article className="max-w-3xl mx-auto space-y-8 select-text">
              {/* Article Header */}
              <div className="space-y-4 border-b border-black/10 dark:border-white/10 pb-6">
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs opacity-75">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="size-3 text-primary" />
                    {post.meta.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FiClock className="size-3 text-primary" />
                    {post.meta.readTime}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {post.meta.title}
                </h1>

                {post.meta.subtitle && (
                  <p className="text-sm sm:text-base opacity-80 leading-relaxed font-normal">
                    {post.meta.subtitle}
                  </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {post.meta.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[11px] font-mono border border-primary/30 bg-primary/10 text-primary font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rendered Markdown Body */}
              <div className="space-y-5 leading-relaxed text-sm sm:text-base">
                {renderMarkdownContent(post.content, post.meta.title)}
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
};
