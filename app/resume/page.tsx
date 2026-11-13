import type { Metadata } from "next";
import { ResumePdfViewer } from "@/components/app-components/resume";

export const metadata: Metadata = {
  title: "Resume | Sagar Kumar Jha",
  description:
    "View and download Sagar Kumar Jha's resume — Systems & Full-Stack Software Engineer.",
};

export default function ResumePage() {
  return (
    <div className="py-2 sm:py-4">
      <ResumePdfViewer />
    </div>
  );
}
