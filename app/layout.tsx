import "./globals.css";
import "./prism.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Header, Footer } from "@/components/layouts";
import { Terminal, Foxy } from "@/components/app-components";
import { siteConfig } from "@/lib/config";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full max-w-4xl mx-auto flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <Terminal />
          <Foxy />
        </ThemeProvider>
      </body>
    </html>
  );
}
