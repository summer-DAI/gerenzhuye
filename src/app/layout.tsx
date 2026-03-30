import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";

import { FloatingAskButton } from "@/components/FloatingAskButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { loadProfile } from "@/lib/content";

import "./globals.css";

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "个人主页",
  description: "个人简介、作品与基于知识库的问答",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = loadProfile();
  const siteBrand = profile.brandLabel ?? `${profile.name} · Portfolio`;

  return (
    <html lang="zh-CN" className={notoSans.variable}>
      <body
        className={`${notoSans.className} min-h-screen antialiased font-sans`}
      >
        <div className="flex min-h-screen flex-col">
          <SiteHeader siteBrand={siteBrand} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <FloatingAskButton />
      </body>
    </html>
  );
}
