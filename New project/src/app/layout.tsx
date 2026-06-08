import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "CLEAN CODE CHECKER",
  description:
    "Upload Java source code and receive security insights, performance recommendations, and clean-code suggestions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
