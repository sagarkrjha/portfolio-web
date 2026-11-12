"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiDownload, FiExternalLink } from "react-icons/fi";
import { siteConfig } from "@/lib/config";
import { ThemeToggleButton } from "../app-components";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-sm tracking-tight hover:opacity-80 transition-opacity"
        >
          {siteConfig.name}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-1 sm:gap-2">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              download={
                typeof item.download === "string" ? item.download : item.download ? true : undefined
              }
              className={`text-xs sm:text-sm font-medium transition-colors px-2.5 py-1 rounded-md hover:bg-muted/60 ${
                pathname === item.href
                  ? "text-foreground font-semibold bg-muted/40"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-1 pl-1 border-l">
            <ThemeToggleButton />
          </div>
        </nav>

        {/* Mobile Navigation Controls */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggleButton />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-background/80 text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <FiX className="size-4" /> : <FiMenu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown / Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-x-0 top-14 bottom-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden animate-in fade-in duration-150"
          onClick={() => setMobileMenuOpen(false)}
        >
          <nav
            onClick={(e) => e.stopPropagation()}
            className="w-full border-b border-border bg-background/95 px-6 py-5 shadow-2xl backdrop-blur-lg animate-in slide-in-from-top-2 duration-200"
          >
            <div className="flex flex-col space-y-1">
              {siteConfig.navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    download={
                      typeof item.download === "string"
                        ? item.download
                        : item.download
                          ? true
                          : undefined
                    }
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-muted text-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.download ? (
                      <FiDownload className="size-3.5 text-muted-foreground" />
                    ) : item.external ? (
                      <FiExternalLink className="size-3.5 text-muted-foreground" />
                    ) : null}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span>{siteConfig.role}</span>
              <span className="font-mono text-[11px] text-emerald-500 font-medium">
                {siteConfig.availability ? "Available" : ""}
              </span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
