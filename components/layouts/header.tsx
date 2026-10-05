import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { ThemeToggleButton } from "../app-components";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 sm:px-0">
        <Link href="/" className="font-semibold text-sm tracking-tight hover:opacity-80 transition-opacity">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              download={typeof item.download === "string" ? item.download : item.download ? true : undefined}
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-1 pl-1 border-l">
            <ThemeToggleButton />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;