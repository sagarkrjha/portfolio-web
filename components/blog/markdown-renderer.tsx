import React from "react";
import Link from "next/link";
import { highlightCode } from "@/lib/prism";
import { Mermaid } from "@/components/ui/mermaid";
import { CodeBlock } from "@/components/blog/code-block";
import { type HeadingItem } from "@/components/blog/table-of-contents";

// Format LaTeX math expressions cleanly into readable text and symbols
export function formatMathExpression(expr: string): string {
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

// Helper to format inline code, bold, italics, math, and links without broken symbols
export function renderInlineFormatted(text: string): React.ReactNode {
  // Regex:
  // 1. Markdown link: [text](url)
  // 2. Inline code: `...`
  // 3. Inline math: $...$
  // 4. Bold-italic: ***...***
  // 5. Bold: **...**
  // 6. Italic: *...*
  const tokens = text.split(
    /(\[[^\]]+\]\([^\)]+\)|`[^`]+`|\$(?:[^\$\n]+)\$|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|(?<=\s|^)\*[^*\n]+?\*(?=\s|$|[.,:;!?]))/g,
  );

  return tokens.map((token, i) => {
    if (!token) return null;

    // Link: [label](url)
    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isInternal = url.startsWith("/");
      if (isInternal) {
        return (
          <Link
            key={i}
            href={url}
            className="text-primary underline underline-offset-4 font-medium hover:text-primary/80 transition-colors"
          >
            {renderInlineFormatted(label)}
          </Link>
        );
      }
      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4 font-medium hover:text-primary/80 transition-colors"
        >
          {renderInlineFormatted(label)}
        </a>
      );
    }

    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground font-medium border border-border/50"
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
          className="font-mono text-xs sm:text-[13px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground font-medium border border-border/40 inline-block align-baseline whitespace-nowrap"
        >
          {mathContent}
        </span>
      );
    }

    if (token.startsWith("***") && token.endsWith("***") && token.length > 6) {
      return (
        <strong key={i} className="font-semibold italic text-foreground">
          {renderInlineFormatted(token.slice(3, -3))}
        </strong>
      );
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {renderInlineFormatted(token.slice(2, -2))}
        </strong>
      );
    }

    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      return (
        <em key={i} className="italic text-foreground">
          {token.slice(1, -1)}
        </em>
      );
    }

    return token;
  });
}

// Extract table of contents headings from raw markdown content
export function extractHeadings(content: string): HeadingItem[] {
  const list: HeadingItem[] = [];
  const lines = content.split("\n");
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
}

// Custom markdown content renderer with syntax highlighting and rich element support
export function MarkdownRenderer({
  content,
  postTitle,
}: {
  content: string;
  postTitle?: string;
}) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const firstLineEnd = part.indexOf("\n");
      const lang = (firstLineEnd !== -1 ? part.slice(3, firstLineEnd) : "").trim().toLowerCase();
      const rawCode = firstLineEnd !== -1 ? part.slice(firstLineEnd + 1, -3) : part.slice(3, -3);
      const code = rawCode.replace(/^\r?\n/, "").replace(/\r?\n\s*$/, "");

      if (lang === "mermaid") {
        return (
          <div
            key={index}
            className="my-6 rounded-lg border border-border bg-card p-4 shadow-sm overflow-x-auto"
          >
            <Mermaid chart={code} />
          </div>
        );
      }

      const { highlightedHtml, language } = highlightCode(code, lang);

      return (
        <CodeBlock
          key={index}
          code={code}
          lang={lang}
          highlightedHtml={highlightedHtml}
          language={language}
        />
      );
    }

    // Process normal markdown sections by paragraphs
    const paragraphs = part.split(/\n\n+/);
    return (
      <div key={index} className="space-y-4">
        {paragraphs.map((rawParagraph, pIdx) => {
          const trimmed = rawParagraph.trim();
          if (!trimmed) return null;

          if (trimmed === "---") {
            return <hr key={pIdx} className="my-8 border-border" />;
          }

          if (trimmed.startsWith("# ")) {
            const h1Text = trimmed.replace("# ", "").trim();
            // If the H1 in markdown repeats the post's page title, skip rendering it to avoid duplicate titles
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
            const headingId = h2Text
              .replace(/[`*]/g, "")
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-");
            return (
              <h2
                key={pIdx}
                id={headingId}
                className="scroll-mt-24 text-xl sm:text-2xl font-semibold tracking-tight mt-8 mb-3 border-b border-border pb-2"
              >
                {renderInlineFormatted(h2Text)}
              </h2>
            );
          }
          if (trimmed.startsWith("### ")) {
            const h3Text = trimmed.replace("### ", "").trim();
            const headingId = h3Text
              .replace(/[`*]/g, "")
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-");
            return (
              <h3
                key={pIdx}
                id={headingId}
                className="scroll-mt-24 text-lg sm:text-xl font-semibold tracking-tight mt-6 mb-2 text-foreground"
              >
                {renderInlineFormatted(h3Text)}
              </h3>
            );
          }
          if (trimmed.startsWith("#### ")) {
            return (
              <h4
                key={pIdx}
                className="text-base font-semibold tracking-tight mt-4 mb-1 text-foreground"
              >
                {renderInlineFormatted(trimmed.replace("#### ", ""))}
              </h4>
            );
          }

          // Block math expression ($$...$$)
          if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
            const rawExpr = trimmed.slice(2, -2).trim();
            const formattedExpr = formatMathExpression(rawExpr);
            return (
              <div
                key={pIdx}
                className="my-5 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-center font-mono text-sm leading-relaxed text-foreground shadow-sm"
              >
                {formattedExpr}
              </div>
            );
          }

          // Blockquote or GitHub Alert Callouts (> [!IMPORTANT] ...)
          if (trimmed.startsWith(">")) {
            const rawQuoteLines = trimmed.split("\n").map((l) => l.replace(/^>\s?/, ""));
            const firstLine = rawQuoteLines[0]?.trim() || "";
            const isAlert = firstLine.startsWith("[!");

            if (isAlert) {
              const alertTypeMatch = firstLine.match(/^\[!([A-Z]+)\]/i);
              const alertType = alertTypeMatch ? alertTypeMatch[1].toUpperCase() : "NOTE";
              const restLines = [
                firstLine.replace(/^\[![A-Z]+\]\s*/i, ""),
                ...rawQuoteLines.slice(1),
              ].filter((l) => l.trim().length > 0);

              const alertColors: Record<
                string,
                { border: string; bg: string; title: string; text: string }
              > = {
                NOTE: { border: "border-blue-500/40", bg: "bg-blue-500/10", title: "text-blue-500", text: "Note" },
                IMPORTANT: { border: "border-amber-500/40", bg: "bg-amber-500/10", title: "text-amber-500", text: "Important" },
                WARNING: { border: "border-yellow-500/40", bg: "bg-yellow-500/10", title: "text-yellow-500", text: "Warning" },
                TIP: { border: "border-emerald-500/40", bg: "bg-emerald-500/10", title: "text-emerald-500", text: "Tip" },
                CAUTION: { border: "border-red-600/40", bg: "bg-red-600/10", title: "text-red-600", text: "Caution" },
              };

              const conf = alertColors[alertType] || alertColors.NOTE;

              return (
                <div
                  key={pIdx}
                  className={`my-4 rounded-lg border ${conf.border} ${conf.bg} p-4 text-sm leading-relaxed`}
                >
                  <div className={`font-semibold mb-2 text-xs uppercase tracking-wider ${conf.title}`}>
                    [!{conf.text}]
                  </div>
                  <div className="space-y-2 text-foreground/90">
                    {restLines.map((line, rIdx) => (
                      <p key={rIdx}>{renderInlineFormatted(line)}</p>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <blockquote
                key={pIdx}
                className="my-4 border-l-2 border-primary/60 pl-4 py-1 space-y-2 text-sm sm:text-base text-muted-foreground bg-muted/20 rounded-r-md"
              >
                {rawQuoteLines.map((ql, qIdx) => {
                  const lineTrimmed = ql.trim();
                  if (!lineTrimmed) return null;
                  return <p key={qIdx}>{renderInlineFormatted(lineTrimmed)}</p>;
                })}
              </blockquote>
            );
          }

          // Markdown Table
          if (trimmed.includes("|") && trimmed.split("\n").length >= 2) {
            const tableLines = trimmed
              .split("\n")
              .filter((l) => l.trim().startsWith("|") && l.trim().endsWith("|"));
            if (tableLines.length >= 2) {
              const parseRowCells = (rowStr: string) => {
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
                  <div key={pIdx} className="my-6 overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/50 border-b border-border text-foreground font-semibold">
                        <tr>
                          {headerCells.map((h, hIdx) => (
                            <th key={hIdx} className="px-4 py-2.5">
                              {renderInlineFormatted(h)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {bodyLines.map((row, rIdx) => {
                          const cells = parseRowCells(row);
                          return (
                            <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                              {cells.map((cell, cIdx) => {
                                const subLines = cell.split(/<br\s*\/?>/i);
                                return (
                                  <td key={cIdx} className="px-4 py-2 text-muted-foreground align-top">
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
          const hasListItems = rawLines.some((l) => {
            const lt = l.trim();
            return (
              lt.startsWith("- ") ||
              lt.startsWith("* ") ||
              lt.startsWith("+ ") ||
              /^\d+\.\s/.test(lt) ||
              lt.startsWith("[ ] ") ||
              lt.startsWith("[x] ")
            );
          });

          if (hasListItems) {
            return (
              <div key={pIdx} className="space-y-2 my-3 text-sm sm:text-base text-muted-foreground">
                {rawLines.map((line, lIdx) => {
                  const lineTrimmed = line.trim();
                  if (!lineTrimmed) return null;

                  const leadingWhitespace = line.search(/\S|$/);
                  const isSubItem = leadingWhitespace >= 2;

                  if (lineTrimmed.startsWith("- [ ] ") || lineTrimmed.startsWith("- [x] ")) {
                    const isChecked = lineTrimmed.startsWith("- [x] ");
                    const labelText = lineTrimmed.replace(/^- \[[ x]\]\s*/, "");
                    return (
                      <div
                        key={lIdx}
                        className={`flex items-start gap-2.5 text-foreground leading-relaxed ${isSubItem ? "pl-6 sm:pl-8 text-xs sm:text-sm" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="mt-1 h-3.5 w-3.5 rounded border-border text-primary focus:ring-0 cursor-default"
                        />
                        <div className="flex-1">{renderInlineFormatted(labelText)}</div>
                      </div>
                    );
                  }

                  const numMatch = lineTrimmed.match(/^(\d+)\.\s+(.*)$/);
                  if (numMatch) {
                    const [, stepNum, stepContent] = numMatch;
                    return (
                      <div
                        key={lIdx}
                        className={`flex items-start gap-2.5 text-foreground leading-relaxed ${isSubItem ? "pl-6 sm:pl-8 text-xs sm:text-sm" : ""}`}
                      >
                        <span className="font-mono font-bold text-primary shrink-0 select-none text-xs sm:text-sm mt-0.5">
                          {stepNum}.
                        </span>
                        <div className="flex-1">{renderInlineFormatted(stepContent)}</div>
                      </div>
                    );
                  }

                  const bulletMatch = lineTrimmed.match(/^[-*+]\s+(.*)$/);
                  if (bulletMatch) {
                    const cleanText = bulletMatch[1];
                    return (
                      <div
                        key={lIdx}
                        className={`flex items-start gap-2.5 text-foreground leading-relaxed ${isSubItem ? "pl-6 sm:pl-8 text-xs sm:text-sm" : ""}`}
                      >
                        <span className="text-primary/70 shrink-0 select-none mt-1">
                          {isSubItem ? "◦" : "•"}
                        </span>
                        <div className="flex-1">{renderInlineFormatted(cleanText)}</div>
                      </div>
                    );
                  }

                  return (
                    <div key={lIdx} className="leading-relaxed pl-8">
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
              <p key={pIdx} className="text-sm sm:text-base leading-7 text-muted-foreground">
                {lines.map((line, lIdx) => (
                  <React.Fragment key={lIdx}>
                    {lIdx > 0 && <br />}
                    {renderInlineFormatted(line.trim())}
                  </React.Fragment>
                ))}
              </p>
            );
          }

          return (
            <p key={pIdx} className="text-sm sm:text-base leading-7 text-muted-foreground">
              {renderInlineFormatted(trimmed)}
            </p>
          );
        })}
      </div>
    );
  });
}
