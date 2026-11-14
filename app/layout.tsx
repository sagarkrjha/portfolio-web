import "./globals.css";
import "./prism.css";
import type { Metadata } from "next";
import { ThemeProvider, OsProvider } from "@/components/providers";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Header, Footer, RouteTransition } from "@/components/layouts";
import { Terminal, IntroAnimation, Foxy, DesktopOs } from "@/components/app-components";
import { siteConfig } from "@/lib/config";

// Option A: Modern Systems Engineer Typography
// Headings & Sans: Geist Sans
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Technical Code & Terminal Monospace: Geist Mono
const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Highly-Legible Technical Body: Inter with advanced feature settings
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: `${siteConfig.role} · ${siteConfig.bio}`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        inter.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full max-w-4xl mx-auto flex flex-col bg-background text-foreground px-4 sm:px-6 lg:px-8 selection:bg-foreground selection:text-background font-sans">
        <ThemeProvider>
          <OsProvider>
            <IntroAnimation />
            <Header />
            <div className="flex-1 w-full">
              <RouteTransition>{children}</RouteTransition>
            </div>
            <Footer />
            <Terminal />
            <Foxy />
            <DesktopOs />
          </OsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
