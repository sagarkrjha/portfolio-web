import Link from "next/link";
import { siteConfig } from "@/lib/config";

export const Footer = () => {
  return (
    <footer className="border-t py-8 mt-auto text-sm text-muted-foreground w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name}. Config-driven developer portfolio.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {siteConfig.socialLinks.map((s) => (
            <Link
              key={s.platform}
              href={s.href}
              target={s.external ? "_blank" : undefined}
              rel={s.external ? "noreferrer" : undefined}
              className="text-xs hover:text-foreground transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
