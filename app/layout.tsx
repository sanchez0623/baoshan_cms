import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | 宝山光通信",
    default: "宝山光通信 - 专业光通信产品与解决方案",
  },
  description:
    "宝山光通信专注于光纤、光缆、光模块及系统集成，为通信运营商、数据中心及企业网络提供高品质产品与解决方案。",
  keywords: ["光通信", "光纤", "光缆", "光模块", "FTTH", "数据中心互联"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
