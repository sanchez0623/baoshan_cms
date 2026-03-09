import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/types";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale/zh-CN";
import type { Metadata } from "next";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "新闻管理 - 后台管理" };

export default async function AdminNewsPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Article[]>();

  const allArticles = articles ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">新闻管理</h1>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          发布文章
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">标题</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">状态</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">精选</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">发布日期</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    暂无文章，
                    <Link href="/admin/news/new" className="text-blue-600">
                      点击添加
                    </Link>
                  </td>
                </tr>
              ) : (
                allArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 line-clamp-1 max-w-md">
                        {article.title}
                      </div>
                      <div className="text-xs text-gray-400">{article.slug}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          article.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {article.is_published ? "已发布" : "草稿"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs ${
                          article.is_featured
                            ? "text-orange-600"
                            : "text-gray-400"
                        }`}
                      >
                        {article.is_featured ? "★ 精选" : "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {article.published_at
                        ? format(
                            new Date(article.published_at),
                            "yyyy-MM-dd",
                            { locale: zhCN }
                          )
                        : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/news/${article.id}/edit`}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
                        >
                          <Pencil size={13} />
                          编辑
                        </Link>
                        <DeleteButton
                          id={article.id}
                          table="articles"
                          label="删除"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
