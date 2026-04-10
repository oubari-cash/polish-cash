import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polish Cash",
  description: "Design QA dashboard — visual bugs found and fixed",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
