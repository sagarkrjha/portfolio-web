import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-python";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-toml";
import "prismjs/components/prism-docker";

// Custom grammar for expressive pseudocode, algorithmic steps, and domain models
if (!Prism.languages.pseudocode) {
  Prism.languages.pseudocode = Prism.languages.extend("clike", {
    keyword:
      /\b(?:function|func|procedure|algorithm|struct|class|interface|type|var|let|const|val|return|returns|yield|if|then|else|elif|while|do|for|in|to|downto|step|each|repeat|until|break|continue|new|null|nil|true|false|and|or|not|xor|match|case|switch|try|catch|finally|throw|import|export|from|as|public|private|protected|static|override|virtual|abstract|final|byte_buffer|file_handle|slice|status|string|int|float|double|bool|boolean|void|Collection|Predicate|Map|Key|Value|List|Record|Options|ID|Version|HistoryEntry|Profile|Project|SkillCategory|SiteConfig)\b/i,
    operator: /[-+*\/%&|^!=<>]=?|<<|>>|&&|\|\||=>|->|\.\./,
  });
}

const LANGUAGE_MAP: Record<string, string> = {
  ts: "typescript",
  typescript: "typescript",
  js: "javascript",
  javascript: "javascript",
  jsx: "jsx",
  tsx: "tsx",
  sh: "bash",
  bash: "bash",
  shell: "bash",
  zsh: "bash",
  json: "json",
  css: "css",
  html: "markup",
  markup: "markup",
  xml: "markup",
  svg: "markup",
  md: "markdown",
  markdown: "markdown",
  mdx: "markdown",
  py: "python",
  python: "python",
  yml: "yaml",
  yaml: "yaml",
  sql: "sql",
  diff: "diff",
  c: "c",
  cpp: "cpp",
  "c++": "cpp",
  cxx: "cpp",
  cc: "cpp",
  h: "c",
  hpp: "cpp",
  rust: "rust",
  rs: "rust",
  go: "go",
  golang: "go",
  java: "java",
  toml: "toml",
  docker: "docker",
  dockerfile: "docker",
  pseudo: "pseudocode",
  pseudocode: "pseudocode",
  algorithm: "pseudocode",
  algo: "pseudocode",
  text: "plain",
  txt: "plain",
  plain: "plain",
  plaintext: "plain",
};

export function highlightCode(
  code: string,
  rawLanguage?: string,
): { highlightedHtml: string | null; language: string } {
  if (!rawLanguage) {
    return { highlightedHtml: null, language: "" };
  }

  const language = LANGUAGE_MAP[rawLanguage.toLowerCase()] || rawLanguage.toLowerCase();
  const grammar = Prism.languages[language];

  if (!grammar) {
    return { highlightedHtml: null, language };
  }

  try {
    return {
      highlightedHtml: Prism.highlight(code, grammar, language),
      language,
    };
  } catch {
    return { highlightedHtml: null, language };
  }
}
