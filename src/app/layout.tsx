import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import QueryProviders from "@/providers/QueryProvider";

const roboto = Roboto_Slab({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-roboto-slab",
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
      <body className={`${roboto.className} antialiased light:bg-gray-50`}>
        <QueryProviders>
        {children}
        </QueryProviders>
      </body>
    </html>
  );
}
