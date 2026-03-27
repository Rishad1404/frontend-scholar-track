import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProviders from "@/providers/QueryProvider";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Scholar Track",
  description: "A comprehensive scholarship tracking platform",

  icons: {
    icon: "/tab.png",
    shortcut: "/tab.png",
    apple: "/tab.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased light:bg-gray-50`}>
        <QueryProviders>{children}</QueryProviders>
      </body>
    </html>
  );
}
