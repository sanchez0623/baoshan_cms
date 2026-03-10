import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleForm from "@/components/admin/ArticleForm";
import { getArticleById } from "@/lib/cms-data";

export const metadata: Metadata = { title: "编辑文章 - 后台管理" };

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">编辑文章</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl">
        <ArticleForm article={article} />
      </div>
    </div>
  );
}
