import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "数据分析工具集",
  description: "速卖通商品数据分析 & 微信公众号关键词分析工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
