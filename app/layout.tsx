import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polish Cash — Design QA Dashboard",
  description: "Track visual bugs found and fixed across Cash App. Spot a bug, post it in Slack, watch it get fixed automatically.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Polish Cash",
    description: "Design QA dashboard — visual bugs found and fixed across Cash App",
    type: "website",
  },
  metadataBase: new URL("https://polish.cash"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
