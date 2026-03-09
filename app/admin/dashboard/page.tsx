import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Package,
  Newspaper,
  MessageSquare,
  Image as ImageIcon,
  TrendingUp,
  Plus,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "控制台 - 后台管理" };

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    productsRes,
    articlesRes,
    bannersRes,
    contactsRes,
    unreadContactsRes,
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("banners").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  const stats = [
    {
      label: "产品总数",
      value: productsRes.count ?? 0,
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "文章数量",
      value: articlesRes.count ?? 0,
      icon: Newspaper,
      href: "/admin/news",
      color: "bg-green-100 text-green-700",
    },
    {
      label: "横幅数量",
      value: bannersRes.count ?? 0,
      icon: ImageIcon,
      href: "/admin/banners",
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "留言总数",
      value: contactsRes.count ?? 0,
      icon: MessageSquare,
      href: "/admin/contacts",
      color: "bg-orange-100 text-orange-700",
      badge: (unreadContactsRes.count ?? 0) > 0 ? unreadContactsRes.count : null,
    },
  ];

  const quickActions = [
    { href: "/admin/products/new", label: "新增产品", icon: Package },
    { href: "/admin/news/new", label: "发布文章", icon: Newspaper },
    { href: "/admin/banners", label: "管理横幅", icon: ImageIcon },
    { href: "/admin/settings", label: "网站设置", icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">控制台</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow relative"
          >
            {stat.badge && (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {stat.badge}
              </span>
            )}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} mb-3`}
            >
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                <action.icon size={18} className="text-blue-700" />
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600 group-hover:text-blue-700">
                <Plus size={12} />
                {action.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent contacts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">最新留言</h2>
          <Link
            href="/admin/contacts"
            className="text-sm text-blue-700 hover:text-blue-900"
          >
            查看全部
          </Link>
        </div>
        <RecentContacts />
      </div>
    </div>
  );
}

async function RecentContacts() {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (!contacts || contacts.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-4">暂无留言</p>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((c) => (
        <div
          key={c.id}
          className={`flex items-start justify-between p-3 rounded-lg ${
            !c.is_read ? "bg-blue-50 border border-blue-100" : "bg-gray-50"
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-900">{c.name}</span>
              {c.company && (
                <span className="text-xs text-gray-500">· {c.company}</span>
              )}
              {!c.is_read && (
                <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                  新
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
              {c.message}
            </p>
          </div>
          <div className="text-xs text-gray-400 flex-shrink-0 ml-4">
            {new Date(c.created_at).toLocaleDateString("zh-CN")}
          </div>
        </div>
      ))}
    </div>
  );
}
