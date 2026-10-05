"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiTerminal, FiFolder } from "react-icons/fi";
import { siteConfig } from "@/lib/config";
import cachedData from "@/lib/generated/portfolio-data.json";
import type { MergedProject } from "@/lib/services/github";

interface TerminalModalProps {
  projects?: MergedProject[];
}

interface CommandHistoryItem {
  command: string;
  output: string | React.ReactNode;
}

const AVAILABLE_COMMANDS = [
  "neofetch",
  "fox",
  "foxy",
  "mascot",
  "help",
  "about",
  "skills",
  "projects",
  "leetcode",
  "github",
  "social",
  "blog",
  "resume",
  "whoami",
  "uname",
  "pwd",
  "ls",
  "cat",
  "date",
  "echo",
  "history",
  "clear",
  "exit",
];

// ASCII Art Fox Mascot for neofetch and mascot command
const FoxMascot = () => (
  <div className="text-amber-500 font-mono text-xs leading-snug whitespace-pre select-none font-bold shrink-0">
{`          /\\   /\\
         //\\\\_//\\\\
         \\_     _/
          / · · \\
         =\\_ Y _/=
          /     \\
         (       )
         /   |   \\
        (____|____)`}
    <div className="text-center text-[10px] text-zinc-500 font-normal mt-1">[fox-mascot]</div>
  </div>
);

// Neofetch command output with Fox mascot and system specifications in macOS Terminal style
const NeofetchOutput = () => {
  const { unixUser, hostname } = siteConfig.terminal;
  const totalSolved = cachedData.leetcode?.totalSolved ?? 710;
  const primaryLangs =
    cachedData.profile?.primaryLanguages?.slice(0, 3).join(", ") ||
    siteConfig.statusCards?.coreLanguagesFallback ||
    "TypeScript, C++";
  const pinnedProject = siteConfig.featuredProjects.find((p) => p.featured) ?? siteConfig.featuredProjects[0];
  const featuredLabel = pinnedProject
    ? `${pinnedProject.title} (${pinnedProject.stars ?? 0}★ ${pinnedProject.techStack[0]})`
    : "—";

  return (
    <div className="flex flex-col sm:flex-row items-start gap-6 py-2">
      <FoxMascot />

      <div className="space-y-1 text-xs font-mono">
        <div className="font-bold">
          <span className="text-amber-400">{unixUser}</span>
          <span className="text-zinc-400">@</span>
          <span className="text-emerald-400">{hostname}</span>
        </div>
        <div className="text-zinc-600">------------------------------</div>
        <div className="grid grid-cols-[85px_1fr] sm:grid-cols-[100px_1fr] gap-x-2 gap-y-0.5 text-zinc-300 min-w-0">
          <span className="text-amber-400 font-semibold">OS:</span>
          <span className="break-all sm:break-normal">GitHub Cloud Shell ({siteConfig.github.username})</span>
          <span className="text-amber-400 font-semibold">Host:</span>
          <span className="text-zinc-100 font-medium break-all sm:break-normal">github.com/{siteConfig.github.username}</span>
          <span className="text-amber-400 font-semibold">Role:</span>
          <span className="text-zinc-200">{siteConfig.role}</span>
          <span className="text-amber-400 font-semibold">Kernel:</span>
          <span>github-vfs 2.0.0-x86_64</span>
          <span className="text-amber-400 font-semibold">Uptime:</span>
          <span className="text-emerald-400">24/7 (Always building &amp; learning)</span>
          <span className="text-amber-400 font-semibold">Packages:</span>
          <span>{siteConfig.github.repositoryCount ?? 4} (repos), {totalSolved}+ (LeetCode)</span>
          <span className="text-amber-400 font-semibold">Shell:</span>
          <span>bash 5.2.0 (github-workspace)</span>
          <span className="text-amber-400 font-semibold">Terminal:</span>
          <span>xterm-256color</span>
          <span className="text-amber-400 font-semibold">Primary:</span>
          <span className="text-cyan-400">{primaryLangs}</span>
          <span className="text-amber-400 font-semibold">Featured:</span>
          <span className="text-emerald-400 break-words">{featuredLabel}</span>
          <span className="text-amber-400 font-semibold">Status:</span>
          <span className="text-zinc-100">{siteConfig.availability}</span>
          <span className="text-amber-400 font-semibold">Location:</span>
          <span>{siteConfig.location}</span>
        </div>

        {/* Neofetch 8-color terminal palette blocks */}
        <div className="flex items-center gap-1 pt-2.5">
          <span className="inline-block size-3 rounded-xs bg-zinc-800" />
          <span className="inline-block size-3 rounded-xs bg-red-500" />
          <span className="inline-block size-3 rounded-xs bg-emerald-500" />
          <span className="inline-block size-3 rounded-xs bg-yellow-400" />
          <span className="inline-block size-3 rounded-xs bg-blue-500" />
          <span className="inline-block size-3 rounded-xs bg-purple-500" />
          <span className="inline-block size-3 rounded-xs bg-cyan-400" />
          <span className="inline-block size-3 rounded-xs bg-zinc-200" />
        </div>
      </div>
    </div>
  );
};


export const TerminalModal = ({ projects = [] }: TerminalModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [sessionCommands, setSessionCommands] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [draftInput, setDraftInput] = useState("");
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl+`");

  // Detect OS for authentic VS Code terminal keyboard shortcut label
  useEffect(() => {
    const isMac =
      typeof navigator !== "undefined" &&
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
    setShortcutLabel(isMac ? "⌃`" : "Ctrl+`");
  }, []);

  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: "welcome",
      output: (
        <div className="space-y-1.5 font-mono text-xs">
          <p className="text-emerald-400 font-semibold">
            Last login: {new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} on ttys001
          </p>
          <p className="text-zinc-300">
            Welcome to {siteConfig.name}&apos;s terminal
          </p>
          <p className="text-zinc-400">
            Type <span className="text-amber-400 font-medium">neofetch</span> to view system specs with the fox mascot, or <span className="text-yellow-400">help</span> for all commands.
          </p>
          <p className="text-zinc-500 text-[11px]">
            Shortcuts: <kbd className="text-zinc-400 font-mono">Tab</kbd> autocomplete • <kbd className="text-zinc-400 font-mono">↑</kbd>/<kbd className="text-zinc-400 font-mono">↓</kbd> history • <kbd className="text-zinc-400 font-mono">Ctrl+L</kbd> clear • <kbd className="text-zinc-400 font-mono">ESC</kbd> close
          </p>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // VS Code Terminal Toggle shortcut based on OS (⌃` on macOS, Ctrl+` on Windows/Linux)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isBackquote = e.key === "`" || e.code === "Backquote" || e.key === "~";
      // VS Code integrated terminal toggle: Ctrl+` (or Cmd+` on Mac)
      const isTerminalToggle = (e.ctrlKey || e.metaKey) && isBackquote;

      if (isTerminalToggle) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input and lock background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();

    if (!trimmed) {
      setHistory((prev) => [...prev, { command: "", output: "" }]);
      return;
    }

    setSessionCommands((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setDraftInput("");

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (command === "clear") {
      setHistory([]);
      return;
    }

    if (command === "exit" || command === "quit") {
      setIsOpen(false);
      return;
    }

    let outputNode: React.ReactNode = null;

    switch (command) {
      case "neofetch":
      case "fastfetch":
        outputNode = <NeofetchOutput />;
        break;

      case "fox":
      case "mascot":
      case "foxy":
        outputNode = (
          <div className="space-y-3 py-1 font-mono">
            <FoxMascot />
            <p className="text-zinc-300 text-xs">
              🦊 <span className="text-amber-400 font-semibold">Foxy:</span> &quot;Greetings from {siteConfig.github.username}&apos;s shell! Click me on the bottom-left to make me run towards your cursor! 🐾&quot;
            </p>
          </div>
        );
        break;

      case "help":
        outputNode = (
          <div className="space-y-2 text-xs font-mono">
            <p className="font-semibold text-zinc-100">Terminal Commands ({siteConfig.github.username}@github):</p>
            <div className="grid grid-cols-[110px_1fr] gap-x-2 gap-y-1 text-zinc-400">
              <span className="text-amber-400">neofetch</span>
              <span>Display system specs & fox mascot</span>
              <span className="text-yellow-400">about</span>
              <span>Display developer summary and interests</span>
              <span className="text-yellow-400">skills</span>
              <span>List primary technologies & tools</span>
              <span className="text-yellow-400">projects</span>
              <span>List featured repositories and live demos</span>
              <span className="text-yellow-400">leetcode</span>
              <span>View LeetCode profile information</span>
              <span className="text-yellow-400">github</span>
              <span>View GitHub username and repository link</span>
              <span className="text-yellow-400">social</span>
              <span>List social media and contact links</span>
              <span className="text-yellow-400">blog</span>
              <span>List blog navigation and recent articles</span>
              <span className="text-yellow-400">resume</span>
              <span>Open and download developer resume (PDF)</span>
              <span className="text-yellow-400">fox</span>
              <span>Display the portfolio fox mascot ASCII</span>
              <span className="text-yellow-400">whoami</span>
              <span>Display current shell user</span>
              <span className="text-yellow-400">uname -a</span>
              <span>Display system & kernel architecture</span>
              <span className="text-yellow-400">pwd</span>
              <span>Print working directory</span>
              <span className="text-yellow-400">ls</span>
              <span>List directory contents</span>
              <span className="text-yellow-400">cat &lt;file&gt;</span>
              <span>Display file content (e.g. cat mascot.fox)</span>
              <span className="text-yellow-400">date</span>
              <span>Display current date and time</span>
              <span className="text-yellow-400">echo &lt;text&gt;</span>
              <span>Print text to terminal</span>
              <span className="text-yellow-400">history</span>
              <span>Display command history</span>
              <span className="text-yellow-400">clear</span>
              <span>Clear terminal screen</span>
              <span className="text-yellow-400">exit</span>
              <span>Close terminal</span>
            </div>
          </div>
        );
        break;

      case "whoami":
        outputNode = (
          <p className="text-xs text-emerald-400 font-mono">
            {siteConfig.terminal.unixUser} (github: {siteConfig.github.username})
          </p>
        );
        break;

      case "uname":
        outputNode = (
          <p className="text-xs text-zinc-300 font-mono">
            Linux github-{siteConfig.github.username} 6.5.0-github-vfs #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux
          </p>
        );
        break;

      case "pwd":
        outputNode = <p className="text-xs text-zinc-300 font-mono">{siteConfig.terminal.homePath}</p>;
        break;

      case "ls":
      case "dir":
        outputNode = (
          <div className="flex flex-wrap gap-4 text-xs font-mono">
            <span className="text-blue-400 font-medium">projects/</span>
            <span className="text-blue-400 font-medium">blog/</span>
            <span className="text-emerald-400">about.md</span>
            <span className="text-yellow-400">skills.json</span>
            <span className="text-purple-400">leetcode.stats</span>
            <span className="text-red-400 font-semibold">sagar-resume.pdf</span>
            <span className="text-amber-400">mascot.fox</span>
          </div>
        );
        break;

      case "cat": {
        const file = args[0]?.toLowerCase();
        if (!file) {
          outputNode = <p className="text-xs text-red-400 font-mono">cat: missing file argument. Try &apos;cat mascot.fox&apos; or &apos;ls&apos;.</p>;
        } else if (file === "mascot.fox") {
          outputNode = <FoxMascot />;
        } else if (file === "about.md") {
          outputNode = (
            <div className="space-y-1 text-xs font-mono">
              <p className="font-semibold text-zinc-100">{siteConfig.name} — {siteConfig.role}</p>
              <p className="text-zinc-400">{siteConfig.bio}</p>
            </div>
          );
        } else if (file === "skills.json") {
          outputNode = (
            <pre className="text-xs text-zinc-300 font-mono overflow-x-auto">
              {JSON.stringify(siteConfig.skills.map((c) => ({ category: c.title, skills: c.skills.map((s) => s.name) })), null, 2)}
            </pre>
          );
        } else if (file === "leetcode.stats") {
          outputNode = (
            <p className="text-xs text-zinc-300 font-mono">
              LeetCode User: {siteConfig.leetcode.username} ({cachedData.leetcode?.totalSolved ?? 710}+ Solved across Easy, Medium, Hard)
            </p>
          );
        } else if (file === "sagar-resume.pdf" || file === "resume.pdf") {
          outputNode = (
            <p className="text-xs text-zinc-300 font-mono">
              Binary PDF file. Download or view online at:{" "}
              <a href="/sagar-resume.pdf" download="sagar-resume.pdf" className="text-emerald-400 underline hover:opacity-80">
                /sagar-resume.pdf
              </a>
            </p>
          );
        } else {
          outputNode = <p className="text-xs text-red-400 font-mono">cat: {args[0]}: No such file or directory</p>;
        }
        break;
      }

      case "date":
        outputNode = <p className="text-xs text-zinc-300 font-mono">{new Date().toUTCString()}</p>;
        break;

      case "echo":
        outputNode = <p className="text-xs text-zinc-200 font-mono">{args.join(" ")}</p>;
        break;

      case "history":
        outputNode = (
          <div className="space-y-0.5 text-xs font-mono text-zinc-300">
            {sessionCommands.map((c, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-zinc-500 w-6 text-right">{i + 1}</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        );
        break;

      case "sudo":
        outputNode = (
          <p className="text-xs text-amber-400 font-mono">
            Password: 🔑 User {siteConfig.terminal.unixUser} is already logged into the primary shell session.
          </p>
        );
        break;

      case "about":
        outputNode = (
          <div className="space-y-2 text-xs font-mono">
            <p className="font-semibold text-zinc-100">{siteConfig.name} — {siteConfig.role}</p>
            <p className="text-zinc-400">{siteConfig.bio}</p>
            <div className="mt-2">
              <p className="font-medium text-zinc-200">Hobbies & Interests:</p>
              <ul className="list-disc list-inside text-zinc-400 mt-1 space-y-0.5">
                {siteConfig.hobbies.map((h) => (
                  <li key={h.title}>
                    <strong className="text-zinc-200">{h.title}:</strong> {h.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
        break;

      case "skills":
        outputNode = (
          <div className="space-y-2 text-xs font-mono">
            {siteConfig.skills.map((cat) => (
              <div key={cat.title}>
                <span className="font-semibold text-zinc-200">{cat.title}: </span>
                <span className="text-zinc-400">
                  {cat.skills.map((s) => s.name).join(", ")}
                </span>
              </div>
            ))}
          </div>
        );
        break;

      case "projects": {
        const displayProjects = projects.length > 0 ? projects : siteConfig.featuredProjects;
        outputNode = (
          <div className="space-y-2 text-xs font-mono">
            <p className="font-semibold text-zinc-100">Projects & Repositories:</p>
            <div className="space-y-1.5">
              {displayProjects.map((p) => (
                <div key={p.title} className="border-l-2 border-emerald-500/60 pl-2">
                  <p className="font-medium text-zinc-100">{p.title}</p>
                  <p className="text-zinc-400 line-clamp-1">{p.description}</p>
                  <p className="text-[11px] text-zinc-500">
                    Stack: {p.techStack.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
        break;
      }

      case "leetcode":
        outputNode = (
          <div className="space-y-1 text-xs font-mono">
            <p className="font-semibold text-zinc-100">LeetCode Profile</p>
            <p className="text-zinc-400">
              Username: <span className="text-yellow-400">{siteConfig.leetcode.username}</span>
            </p>
            <p className="text-zinc-400">
              Profile:{" "}
              <a
                href={siteConfig.leetcode.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 underline hover:opacity-80"
              >
                {siteConfig.leetcode.profileUrl}
              </a>
            </p>
          </div>
        );
        break;

      case "github":
        outputNode = (
          <div className="space-y-1 text-xs font-mono">
            <p className="font-semibold text-zinc-100">GitHub Profile</p>
            <p className="text-zinc-400">
              Username: <span className="text-yellow-400">{siteConfig.github.username}</span>
            </p>
            <p className="text-zinc-400">
              URL:{" "}
              <a
                href={`https://github.com/${siteConfig.github.username}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 underline hover:opacity-80"
              >
                https://github.com/{siteConfig.github.username}
              </a>
            </p>
          </div>
        );
        break;

      case "social":
      case "contact":
      case "socials":
        outputNode = (
          <div className="space-y-1.5 text-xs font-mono">
            <p className="font-semibold text-zinc-100">Connect & Social Media:</p>
            <div className="space-y-1">
              {siteConfig.socialLinks.map((s) => (
                <div key={s.platform} className="flex items-center gap-2">
                  <span className="text-yellow-400 w-20">{s.label}:</span>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 underline hover:opacity-80"
                  >
                    {s.href}
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case "blog":
        outputNode = (
          <div className="space-y-1 text-xs font-mono">
            <p className="font-semibold text-zinc-100">Technical Blog</p>
            <p className="text-zinc-400">
              Explore deep dives into software architecture, developer tooling, and algorithms.
            </p>
            <p className="text-zinc-400">
              Route: <a href="/blog" className="text-emerald-400 underline">/blog</a>
            </p>
          </div>
        );
        break;

      case "resume":
      case "cv":
        outputNode = (
          <div className="space-y-1.5 text-xs font-mono">
            <p className="font-semibold text-zinc-100">Developer Resume (PDF)</p>
            <p className="text-zinc-400">
              Download or view Sagar Kumar Jha&apos;s resume:
            </p>
            <p className="text-zinc-400">
              File:{" "}
              <a
                href="/sagar-resume.pdf"
                download="sagar-resume.pdf"
                className="text-emerald-400 underline hover:opacity-80 font-medium"
              >
                /sagar-resume.pdf (Click to Download)
              </a>
            </p>
          </div>
        );
        break;

      default:
        outputNode = (
          <p className="text-xs text-red-400 font-mono">
            zsh: command not found: {trimmed}. Type <span className="text-yellow-400">help</span> for commands, or <span className="text-amber-400">neofetch</span>.
          </p>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: rawCmd, output: outputNode }]);
  };

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // ArrowUp: History previous
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (sessionCommands.length === 0) return;

      if (historyIndex === -1) {
        setDraftInput(inputVal);
        const newIdx = sessionCommands.length - 1;
        setHistoryIndex(newIdx);
        setInputVal(sessionCommands[newIdx]);
      } else if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setInputVal(sessionCommands[newIdx]);
      }
      return;
    }

    // ArrowDown: History next
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;

      if (historyIndex < sessionCommands.length - 1) {
        const newIdx = historyIndex + 1;
        setHistoryIndex(newIdx);
        setInputVal(sessionCommands[newIdx]);
      } else {
        setHistoryIndex(-1);
        setInputVal(draftInput);
      }
      return;
    }

    // Tab: Autocompletion
    if (e.key === "Tab") {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;

      const matches = AVAILABLE_COMMANDS.filter((cmd) => cmd.startsWith(current));
      if (matches.length === 1) {
        setInputVal(matches[0]);
      } else if (matches.length > 1) {
        setHistory((prev) => [
          ...prev,
          {
            command: inputVal,
            output: (
              <div className="flex flex-wrap gap-2 text-zinc-400 text-xs font-mono">
                {matches.map((m) => (
                  <span key={m} className="text-yellow-400">
                    {m}
                  </span>
                ))}
              </div>
            ),
          },
        ]);
      }
      return;
    }

    // Ctrl+L: Clear terminal screen
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setHistory([]);
      return;
    }

    // Ctrl+C: Cancel line
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
      e.preventDefault();
      setHistory((prev) => [...prev, { command: `${inputVal}^C`, output: "" }]);
      setInputVal("");
      setHistoryIndex(-1);
      return;
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(inputVal);
    setInputVal("");
  };

  return (
    <>
      {/* Floating Action Button (Shows dynamic OS-based VS Code terminal shortcut) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={`Open terminal (${shortcutLabel})`}
          className="group flex items-center gap-2 rounded-full border border-border bg-background/90 px-3.5 py-2.5 text-xs font-medium text-foreground shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-muted active:scale-95 cursor-pointer ring-1 ring-foreground/10"
        >
          <div className="flex size-5 items-center justify-center rounded-full bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">
            <FiTerminal className="size-3" />
          </div>
          <span className="hidden sm:inline font-mono">Terminal</span>
          <span className="text-[10px] text-muted-foreground font-mono font-medium hidden md:inline px-1 py-0.2 rounded bg-muted/60 border border-border/40">
            {shortcutLabel}
          </span>
        </button>
      </div>

      {/* macOS Terminal Window Modal Dialog (Fixed Size, Do Not Resize) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.focus();
            }}
            className={`w-full ${
              isFullScreen
                ? "max-w-5xl h-[92vh] sm:h-[88vh]"
                : "max-w-2xl h-[80vh] sm:h-[520px] max-h-[580px]"
            } rounded-xl border border-white/10 bg-[#1e1e1e]/95 text-zinc-100 font-mono shadow-2xl overflow-hidden flex flex-col backdrop-blur-md animate-in zoom-in-95 duration-150 transition-[max-width,height]`}
          >
            {/* Authentic macOS Terminal Window Titlebar */}
            <div
              onDoubleClick={() => setIsFullScreen((prev) => !prev)}
              className="relative flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#252526]/90 select-none cursor-default shrink-0"
            >
              {/* macOS Traffic Light Buttons */}
              <div className="flex items-center gap-2 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="group/btn relative flex size-3 items-center justify-center rounded-full bg-[#ff5f56] hover:brightness-95 transition-all cursor-pointer border border-[#e0443e]/80"
                  title="Close (ESC)"
                  aria-label="Close"
                >
                  <span className="opacity-0 group-hover/btn:opacity-100 text-[8px] font-bold text-black/70 leading-none select-none">
                    ✕
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHistory([]);
                  }}
                  className="group/btn relative flex size-3 items-center justify-center rounded-full bg-[#ffbd2e] hover:brightness-95 transition-all cursor-pointer border border-[#dea123]/80"
                  title="Clear Screen"
                  aria-label="Clear screen"
                >
                  <span className="opacity-0 group-hover/btn:opacity-100 text-[8px] font-bold text-black/70 leading-none select-none">
                    −
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullScreen((prev) => !prev);
                  }}
                  className="group/btn relative flex size-3 items-center justify-center rounded-full bg-[#27c93f] hover:brightness-95 transition-all cursor-pointer border border-[#1aab29]/80"
                  title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                  aria-label="Full screen"
                >
                  <span className="opacity-0 group-hover/btn:opacity-100 text-[7px] font-bold text-black/70 leading-none select-none">
                    ⤢
                  </span>
                </button>
              </div>

              {/* Centered Terminal Title */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs text-zinc-400 font-medium select-none pointer-events-none max-w-[55%] truncate">
                <FiFolder className="size-3 text-zinc-400 shrink-0" />
                <span className="truncate">{siteConfig.github.username}@github — bash</span>
              </div>

              <div className="text-[11px] text-zinc-500 font-mono select-none hidden sm:inline">
                {shortcutLabel}
              </div>
            </div>

            {/* Quick Command Action Chips */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5 bg-[#18181b]/50 text-[11px] overflow-x-auto shrink-0">
              <span className="text-zinc-500 shrink-0">Quick run:</span>
              {["neofetch", "about", "skills", "projects", "leetcode", "help", "clear"].map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCommand(cmd);
                  }}
                  className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 transition-colors cursor-pointer font-mono shrink-0 border border-white/5"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Terminal Body Output (macOS zsh prompt style) */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-0 text-xs leading-relaxed font-mono bg-[#1e1e1e]">
              {history.map((item, index) => (
                <div key={index} className="space-y-1">
                  {item.command && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-400">
                      <span className="text-emerald-400 font-semibold select-none shrink-0">
                        <span className="hidden sm:inline">{siteConfig.terminal.unixUser}@{siteConfig.terminal.hostname} </span>~ %
                      </span>
                      <span className="text-zinc-100 font-medium break-all">{item.command}</span>
                    </div>
                  )}
                  {item.output && <div className="text-zinc-300 pl-4">{item.output}</div>}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Terminal Prompt Input Bar */}
            <form
              onSubmit={onSubmit}
              className="flex items-center px-4 py-3 border-t border-white/5 bg-[#18181b]/70 shrink-0"
            >
              <span className="text-emerald-400 font-semibold mr-1.5 sm:mr-2 text-xs select-none shrink-0">
                <span className="hidden sm:inline">{siteConfig.terminal.unixUser}@{siteConfig.terminal.hostname} </span>~ %
              </span>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={onKeyDownInput}
                  placeholder="type a command (e.g. 'neofetch', 'help', 'about')..."
                  className="flex-1 bg-transparent border-0 outline-none text-zinc-100 placeholder:text-zinc-600 font-mono text-xs focus:ring-0 p-0"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TerminalModal;
