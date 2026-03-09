import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale/zh-CN";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("title, summary")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "文章未找到" };
  return {
    title: data.title,
    description: data.summary ?? undefined,
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single<Article>();

  if (!article) notFound();

  // Recent articles for sidebar
  const { data: recentArticles } = await supabase
    .from("articles")
    .select("id,title,slug,published_at")
    .eq("is_published", true)
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(5)
    .returns<Pick<Article, "id" | "title" | "slug" | "published_at">[]>();

  const content = article.content ?? "";
  // Convert simple markdown-like text to HTML paragraphs
  const formattedContent = content
    .split("\n\n")
    .map((para) => {
      if (para.startsWith("## ")) {
        return `<h2>${para.slice(3)}</h2>`;
      }
      if (para.startsWith("### ")) {
        return `<h3>${para.slice(4)}</h3>`;
      }
      // Handle bullet lists
      if (para.includes("\n- ")) {
        const items = para.split("\n- ").filter(Boolean);
        const listItems = items
          .map((item, i) => (i === 0 ? item : `<li>${item}</li>`))
          .join("");
        return `<p>${items[0]}</p><ul>${listItems.slice(items[0].length + 9)}</ul>`;
      }
      if (para.startsWith("- ")) {
        const items = para
          .split("\n")
          .map((line) => line.replace(/^- /, ""))
          .filter(Boolean);
        return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
      }
      if (para.match(/^\d+\./)) {
        const items = para
          .split("\n")
          .map((line) => line.replace(/^\d+\.\s*/, ""))
          .filter(Boolean);
        return `<ol>${items.map((i) => `<li>${i}</li>`).join("")}</ol>`;
      }
      // Bold text
      const withBold = para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return `<p>${withBold}</p>`;
    })
    .join("\n");

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-700">首页</Link>
            <span>/</span>
            <Link href="/news" className="hover:text-blue-700">新闻资讯</Link>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-xs">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <article className="flex-1 bg-white rounded-lg shadow-sm p-6 lg:p-8">
            {article.cover_image_url && (
              <Image
                src={article.cover_image_url}
                alt={article.title}
                width={800}
                height={400}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {article.published_at && (
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 pb-4 border-b">
                <Calendar size={14} />
                <span>
                  {format(new Date(article.published_at), "yyyy年MM月dd日", {
                    locale: zhCN,
                  })}
                </span>
              </div>
            )}

            {article.summary && (
              <p className="text-gray-600 bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6 italic">
                {article.summary}
              </p>
            )}

            <div
              className="prose text-gray-700"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />

            <div className="mt-8 pt-6 border-t">
              <Link
                href="/news"
                className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium"
              >
                <ArrowLeft size={16} className="mr-1" />
                返回新闻列表
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 space-y-6">
            {/* Recent articles */}
            {recentArticles && recentArticles.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-4">近期文章</h3>
                <ul className="space-y-3">
                  {recentArticles.map((ra) => (
                    <li key={ra.id}>
                      <Link
                        href={`/news/${ra.slug}`}
                        className="text-sm text-gray-700 hover:text-blue-700 transition-colors line-clamp-2"
                      >
                        {ra.title}
                      </Link>
                      {ra.published_at && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {format(new Date(ra.published_at), "yyyy-MM-dd")}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="bg-blue-700 text-white rounded-lg p-5">
              <h3 className="font-semibold mb-2">需要了解更多？</h3>
              <p className="text-sm text-blue-200 mb-4">
                联系我们的专业团队，获取定制化解决方案
              </p>
              <Link
                href="/contact"
                className="block bg-white text-blue-700 text-center py-2 rounded font-semibold text-sm hover:bg-blue-50 transition-colors"
              >
                立即联系
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
