"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { requestAdmin } from "@/lib/admin-api";
import type { Article } from "@/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fff-]/g, "")
    .replace(/--+/g, "-")
    .slice(0, 80);
}

export default function ArticleForm({ article }: { article?: Article }) {
  const isEdit = !!article;
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    summary: article?.summary ?? "",
    content: article?.content ?? "",
    cover_image_url: article?.cover_image_url ?? "",
    is_featured: article?.is_featured ?? false,
    is_published: article?.is_published ?? true,
    published_at: article?.published_at
      ? new Date(article.published_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    const checked =
      type === "checkbox" ? (event.target as HTMLInputElement).checked : undefined;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "title" && !isEdit ? { slug: slugify(value) } : {}),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary || null,
      content: formData.content || null,
      cover_image_url: formData.cover_image_url || null,
      is_featured: formData.is_featured,
      is_published: formData.is_published,
      published_at: formData.published_at
        ? new Date(formData.published_at).toISOString()
        : null,
    };

    try {
      await requestAdmin(
        isEdit ? `/api/admin/articles/${article.id}` : "/api/admin/articles",
        {
          method: isEdit ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        }
      );
      router.push("/admin/news");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "保存失败，请稍后重试"
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          文章标题 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL别名 (Slug) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          rows={2}
          placeholder="简短描述文章内容..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">正文内容</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={14}
          placeholder="支持基本Markdown格式：## 标题, **粗体**, - 列表项"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono"
        />
        <p className="text-xs text-gray-400 mt-1">
          支持基本格式：## 二级标题, ### 三级标题, **粗体**, - 无序列表, 1. 有序列表
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          封面图片URL
        </label>
        <input
          type="url"
          name="cover_image_url"
          value={formData.cover_image_url}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">发布时间</label>
        <input
          type="datetime-local"
          name="published_at"
          value={formData.published_at}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">设为精选</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_published"
            checked={formData.is_published}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">立即发布</span>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          {loading ? "保存中..." : isEdit ? "保存修改" : "发布文章"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/news")}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  );
}
