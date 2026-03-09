"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/products", label: "产品中心" },
  { href: "/news", label: "新闻资讯" },
  { href: "/about", label: "关于我们" },
  { href: "/contact", label: "联系我们" },
];

export default function Header({
  settings,
}: {
  settings: Record<string, string | null>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const siteName = settings.site_name ?? "宝山光通信";
  const tagline = settings.site_tagline ?? "";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">光</span>
            </div>
            <div>
              <div className="font-bold text-blue-800 text-lg leading-tight">
                {siteName}
              </div>
              {tagline && (
                <div className="text-xs text-gray-500 leading-tight">
                  {tagline}
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors"
            >
              获取报价
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="菜单"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-gray-700 hover:text-blue-700 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="block mt-2 bg-blue-700 text-white px-4 py-2 rounded-md text-center text-sm font-medium"
            onClick={() => setMenuOpen(false)}
          >
            获取报价
          </Link>
        </div>
      )}
    </header>
  );
}
