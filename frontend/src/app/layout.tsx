import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// create-next-app からの変更点：
// title と description をこのプロジェクト向けに変更しています。
export const metadata: Metadata = {
  title: "図書館貸出システム",
  description: "フルスタックWebアプリケーション開発ワークショップ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // create-next-app からの変更点：lang="en" を lang="ja" に変更しています。
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
