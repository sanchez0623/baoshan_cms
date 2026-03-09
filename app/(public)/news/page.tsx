import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "新闻资讯",
  description: "光通信行业动态、技术前沿和公司新闻",
};

export const revalidate = 60;

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .returns<Article[]>();

  const allArticles = articles ?? [];
  const featured = allArticles.find((a) => a.is_featured);
  const rest = allArticles.filter((a) => !a.is_featured || a.id !== featured?.id);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">新闻资讯</h1>
          <p className="text-blue-200 mt-2">行业动态 · 技术前沿 · 公司新闻</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {allArticles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📰</div>
            <p>暂无新闻资讯</p>
          </div>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <div className="mb-10">
                <Link
                  href={`/news/${featured.slug}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row group"
                >
                  <div className="md:w-2/5 h-56 md:h-auto bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    {featured.cover_image_url ? (
                      <Image
                        src={featured.cover_image_url}
                        alt={featured.title}
                        width={600}
                        height={350}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-5xl">📰</div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full inline-block mb-2 w-fit">
                      精选文章
                    </span>
                    {featured.published_at && (
                      <div className="text-xs text-gray-400 mb-2">
                        {format(
                          new Date(featured.published_at),
                          "yyyy年MM月dd日",
                          { locale: zhCN }
                        )}
                      </div>
                    )}
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-3">
                      {featured.title}
                    </h2>
                    {featured.summary && (
                      <p className="text-gray-500 line-clamp-3">
                        {featured.summary}
                      </p>
                    )}
                    <div className="mt-4 text-blue-600 text-sm font-medium">
                      阅读全文 →
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Article list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="h-44 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                    {article.cover_image_url ? (
                      <Image
                        src={article.cover_image_url}
                        alt={article.title}
                        width={400}
                        height={176}
                        className="w-full h-44 object-cover"
                      />
                    ) : (
                      <div className="text-4xl">📰</div>
                    )}
                  </div>
                  <div className="p-4">
                    {article.published_at && (
                      <div className="text-xs text-gray-400 mb-1">
                        {format(
                          new Date(article.published_at),
                          "yyyy年MM月dd日",
                          { locale: zhCN }
                        )}
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {article.summary}
                      </p>
                    )}
                    <div className="mt-3 text-blue-600 text-sm">阅读全文 →</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
