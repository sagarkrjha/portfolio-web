import type { Metadata } from "next";
import { ResumeViewer } from "@/components/app-components/resume/resume-viewer";

export const metadata: Metadata = {
  title: "Resume | Sagar Kumar Jha",
  description:
    "View and download Sagar Kumar Jha's resume — Systems & Full-Stack Software Engineer specializing in C++20, Rust, and TypeScript developer tooling.",
};

export default function ResumePage() {
  return (
    <div className="py-6 sm:py-8 max-w-4xl mx-auto space-y-6">
      <ResumeViewer
        resumeUrl="/sagar-resume.pdf"
        downloadName="sagar-resume.pdf"
        title="Sagar Kumar Jha — Software Engineer Resume"
        lastUpdated="November 2026"
      />
    </div>
  );
}
