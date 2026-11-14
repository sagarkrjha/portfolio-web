"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiSend,
  FiUser,
  FiSmile,
  FiStar,
  FiZap,
  FiHeart,
  FiRotateCcw,
} from "react-icons/fi";

export type SequoiaTextEffect =
  | "big"
  | "small"
  | "shake"
  | "nod"
  | "explode"
  | "ripple"
  | "bloom"
  | "jitter"
  | "none";

interface MessageItem {
  id: string;
  sender: "me" | "sagar";
  text: string;
  effect?: SequoiaTextEffect;
  timestamp: string;
}

const INITIAL_MESSAGES: MessageItem[] = [
  {
    id: "msg-1",
    sender: "sagar",
    text: "Hey! Welcome to macOS Sequoia Carbon Messages ✨",
    effect: "bloom",
    timestamp: "10:14 AM",
  },
  {
    id: "msg-2",
    sender: "sagar",
    text: "You can apply real-time typographic motion effects like EXPLODE or SHAKE to any words!",
    effect: "explode",
    timestamp: "10:15 AM",
  },
  {
    id: "msg-3",
    sender: "me",
    text: "This feels incredibly fluid and dynamic 🚀",
    effect: "ripple",
    timestamp: "10:16 AM",
  },
];

export const MessagesApp = ({ isDark }: { isDark: boolean }) => {
  const [messages, setMessages] = useState<MessageItem[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [selectedEffect, setSelectedEffect] = useState<SequoiaTextEffect>("none");
  const [showEffectPicker, setShowEffectPicker] = useState(false);

  const effectsList: { id: SequoiaTextEffect; label: string; previewClass: string }[] = [
    { id: "explode", label: "💥 Explode", previewClass: "text-amber-400 font-bold" },
    { id: "ripple", label: "🌊 Ripple", previewClass: "text-cyan-400 font-medium" },
    { id: "bloom", label: "🌸 Bloom", previewClass: "text-pink-400 font-semibold" },
    { id: "shake", label: "⚡ Shake", previewClass: "text-yellow-400 font-bold" },
    { id: "nod", label: "↕️ Nod", previewClass: "text-emerald-400 font-medium" },
    { id: "jitter", label: "👾 Jitter", previewClass: "text-purple-400 font-mono" },
    { id: "big", label: "🔍 Big", previewClass: "text-blue-400 text-sm font-black" },
    { id: "small", label: "🔬 Small", previewClass: "text-zinc-400 text-[10px]" },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text: inputText.trim(),
      effect: selectedEffect,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setSelectedEffect("none");
    setShowEffectPicker(false);

    // Simulated reply
    setTimeout(() => {
      const replies: { text: string; effect: SequoiaTextEffect }[] = [
        { text: "Core Animation & SwiftUI physics in action! 🍎", effect: "bloom" },
        { text: "BOOM! Look at the particle expansion! 💥", effect: "explode" },
        { text: "Gentle spring curves make it feel alive 🌊", effect: "ripple" },
        { text: "Notice the fluid gesture morphing! ⚡", effect: "shake" },
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-reply`,
          sender: "sagar",
          text: randomReply.text,
          effect: randomReply.effect,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 900);
  };

  const renderAnimatedContent = (text: string, effect?: SequoiaTextEffect) => {
    const words = text.split(" ");

    switch (effect) {
      case "explode":
        return (
          <span className="inline-flex flex-wrap gap-1">
            {words.map((w, idx) => (
              <motion.span
                key={idx}
                initial={{ scale: 0.2, opacity: 0, filter: "blur(6px)" }}
                animate={{
                  scale: [1, 1.35, 1],
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.05,
                  type: "spring",
                  stiffness: 350,
                  damping: 12,
                }}
                className="inline-block font-semibold"
              >
                {w}
              </motion.span>
            ))}
          </span>
        );

      case "ripple":
        return (
          <span className="inline-flex flex-wrap gap-1">
            {words.map((w, idx) => (
              <motion.span
                key={idx}
                animate={{
                  y: [0, -6, 2, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: idx * 0.12,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                {w}
              </motion.span>
            ))}
          </span>
        );

      case "shake":
        return (
          <motion.span
            animate={{
              x: [0, -4, 4, -3, 3, 0],
              rotate: [0, -2, 2, -1, 1, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut",
            }}
            className="inline-block font-medium"
          >
            {text}
          </motion.span>
        );

      case "nod":
        return (
          <motion.span
            animate={{
              y: [0, -4, 0, -2, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatDelay: 0.8,
              ease: "easeInOut",
            }}
            className="inline-block"
          >
            {text}
          </motion.span>
        );

      case "bloom":
        return (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.95, 1.04, 1],
              opacity: 1,
              textShadow: [
                "0 0 0px rgba(56, 189, 248, 0)",
                "0 0 12px rgba(56, 189, 248, 0.6)",
                "0 0 0px rgba(56, 189, 248, 0)",
              ],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
            className="inline-block"
          >
            {text}
          </motion.span>
        );

      case "jitter":
        return (
          <span className="inline-flex flex-wrap gap-1">
            {words.map((w, idx) => (
              <motion.span
                key={idx}
                animate={{
                  x: [0, Math.random() * 4 - 2, 0],
                  y: [0, Math.random() * 4 - 2, 0],
                }}
                transition={{
                  duration: 0.25,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: idx * 0.04,
                }}
                className="inline-block font-mono"
              >
                {w}
              </motion.span>
            ))}
          </span>
        );

      case "big":
        return (
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.15 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="inline-block font-bold text-sm tracking-wide"
          >
            {text}
          </motion.span>
        );

      case "small":
        return <span className="text-[10px] opacity-75 font-mono">{text}</span>;

      default:
        return <span>{text}</span>;
    }
  };

  return (
    <div className={`flex flex-col h-full w-full select-none ${isDark ? "bg-[#18181b] text-zinc-100" : "bg-white text-zinc-900"}`}>
      {/* Header Info */}
      <div className={`px-4 py-3 border-b flex items-center justify-between backdrop-blur-md ${isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"}`}>
        <div className="flex items-center gap-3">
          <div className="relative size-9 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md font-semibold text-xs">
            SKJ
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-900" />
          </div>
          <div>
            <div className="font-semibold text-xs flex items-center gap-1.5">
              <span>Sagar Kumar Jha</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary/20 text-primary font-mono">
                Sequoia 15.1
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">macOS Kinetic Typography Engine</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMessages(INITIAL_MESSAGES)}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono ${
            isDark ? "hover:bg-white/10 border-white/10 text-zinc-400 hover:text-zinc-200" : "hover:bg-black/5 border-black/10 text-zinc-600 hover:text-zinc-900"
          }`}
          title="Reset conversation"
        >
          <FiRotateCcw className="size-3" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.sender === "me";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 14, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 26,
                }}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl shadow-sm text-xs relative ${
                    isMe
                      ? "bg-linear-to-b from-blue-500 to-blue-600 text-white rounded-br-xs"
                      : isDark
                      ? "bg-[#27272a] text-zinc-100 rounded-bl-xs border border-white/5"
                      : "bg-[#e4e4e7] text-zinc-900 rounded-bl-xs border border-black/5"
                  }`}
                >
                  {renderAnimatedContent(msg.text, msg.effect)}

                  {msg.effect && msg.effect !== "none" && (
                    <span className="block mt-1 text-[9px] font-mono opacity-65 text-right">
                      ✦ {msg.effect}
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-zinc-500 font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Effect Selector Toolbar */}
      <div className={`px-3 py-1.5 border-t flex items-center justify-between text-[11px] ${isDark ? "border-white/10 bg-black/20" : "border-black/10 bg-zinc-50"}`}>
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1 mr-1">
            <FiStar className="size-3 text-amber-400" />
            <span>Effect:</span>
          </span>
          {effectsList.map((eff) => {
            const active = selectedEffect === eff.id;
            return (
              <motion.button
                key={eff.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setSelectedEffect(active ? "none" : eff.id)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono border transition-all cursor-pointer shrink-0 ${
                  active
                    ? "bg-primary text-black font-bold border-primary shadow-sm"
                    : isDark
                    ? "border-white/10 hover:bg-white/10 text-zinc-300"
                    : "border-black/10 hover:bg-black/5 text-zinc-700"
                }`}
              >
                {eff.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Input Composer */}
      <form
        onSubmit={handleSend}
        className={`p-3 border-t flex items-center gap-2 ${isDark ? "border-white/10 bg-black/30" : "border-black/10 bg-white"}`}
      >
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              selectedEffect !== "none"
                ? `Type message with ${selectedEffect.toUpperCase()} effect...`
                : "Type a message in Sequoia font motion..."
            }
            className={`w-full px-3.5 py-2 rounded-xl text-xs font-sans outline-none border transition-all ${
              selectedEffect !== "none"
                ? "border-primary ring-1 ring-primary/40"
                : isDark
                ? "bg-white/5 border-white/15 focus:border-white/30 text-zinc-100 placeholder:text-zinc-500"
                : "bg-black/5 border-black/15 focus:border-black/30 text-zinc-900 placeholder:text-zinc-400"
            }`}
          />
          {selectedEffect !== "none" && (
            <span className="absolute right-3 text-[10px] font-mono text-primary uppercase font-bold animate-pulse">
              {selectedEffect}
            </span>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          type="submit"
          disabled={!inputText.trim()}
          className="size-8 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white flex items-center justify-center cursor-pointer transition-colors shadow-sm shrink-0"
        >
          <FiSend className="size-3.5" />
        </motion.button>
      </form>
    </div>
  );
};
