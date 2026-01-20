import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "速卖通商品数据分析工具",
  description: "专业的速卖通商品数据分析和运营建议工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
