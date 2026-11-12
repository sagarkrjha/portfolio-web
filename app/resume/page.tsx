import type { Metadata } from "next";
import { ResumePdfViewer } from "@/components/app-components/resume/resume-pdf-viewer";

export const metadata: Metadata = {
  title: "Resume | Sagar Kumar Jha",
  description:
    "View and download Sagar Kumar Jha's resume — Systems & Full-Stack Software Engineer.",
};

export default function ResumePage() {
  return (
    <div className="py-4 sm:py-6">
      <ResumePdfViewer />
    </div>
  );
}
