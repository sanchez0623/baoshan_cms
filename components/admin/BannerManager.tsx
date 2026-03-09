"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Banner } from "@/types";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type BannerForm = Omit<Banner, "id" | "created_at" | "updated_at">;

const emptyForm: BannerForm = {
  title: "",
  subtitle: "",
  image_url: "",
  link_url: "",
  link_text: "",
  sort_order: 0,
  is_active: true,
};

export default function BannerManager({
  initialBanners,
}: {
  initialBanners: Banner[];
}) {
  const [banners, setBanners] = useState(initialBanners);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BannerForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle ?? "",
      image_url: banner.image_url,
      link_url: banner.link_url ?? "",
      link_text: banner.link_text ?? "",
      sort_order: banner.sort_order,
      is_active: banner.is_active,
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle || null,
      image_url: formData.image_url,
      link_url: formData.link_url || null,
      link_text: formData.link_text || null,
      sort_order: Number(formData.sort_order),
      is_active: formData.is_active,
    };

    if (editingId) {
      await supabase.from("banners").update(payload).eq("id", editingId);
    } else {
      await supabase.from("banners").insert(payload);
    }

    setShowForm(false);
    setLoading(false);
    router.refresh();

    // Refresh local state
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order")
      .returns<Banner[]>();
    setBanners(data ?? []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除此横幅？")) return;
    await supabase.from("banners").delete().eq("id", id);
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const handleToggleActive = async (banner: Banner) => {
    await supabase
      .from("banners")
      .update({ is_active: !banner.is_active })
      .eq("id", banner.id);
    setBanners((prev) =>
      prev.map((b) =>
        b.id === banner.id ? { ...b, is_active: !b.is_active } : b
      )
    );
  };

  return (
    <div>
      {/* Banner list */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-medium text-gray-900">
            共 {banners.length} 个横幅
          </span>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            <Plus size={15} />
            新增横幅
          </button>
        </div>
        {banners.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            暂无横幅，点击&ldquo;新增横幅&rdquo;添加
          </div>
        ) : (
          <div className="divide-y">
            {banners.map((banner) => (
              <div key={banner.id} className="flex items-center gap-4 p-4">
                <div
                  className="w-20 h-12 bg-gradient-to-r from-blue-200 to-cyan-200 rounded flex-shrink-0 flex items-center justify-center text-xs text-blue-500 overflow-hidden"
                >
                  {banner.image_url && !banner.image_url.startsWith("/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "图片"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900">
                    {banner.title}
                  </div>
                  {banner.subtitle && (
                    <div className="text-xs text-gray-400 truncate">
                      {banner.subtitle}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">
                    排序: {banner.sort_order}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={`p-1.5 rounded ${
                      banner.is_active
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                    title={banner.is_active ? "停用" : "启用"}
                  >
                    {banner.is_active ? (
                      <Eye size={15} />
                    ) : (
                      <EyeOff size={15} />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="p-1.5 rounded text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-1.5 rounded text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
          <h2 className="font-semibold text-gray-900 mb-4">
            {editingId ? "编辑横幅" : "新增横幅"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标题 <span className="text-red-500">*</span>
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
                副标题
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle ?? ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                图片URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                required
                placeholder="/images/banner.jpg 或 https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  链接URL
                </label>
                <input
                  type="text"
                  name="link_url"
                  value={formData.link_url ?? ""}
                  onChange={handleChange}
                  placeholder="/products"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  按钮文字
                </label>
                <input
                  type="text"
                  name="link_text"
                  value={formData.link_text ?? ""}
                  onChange={handleChange}
                  placeholder="了解更多"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  排序权重
                </label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleChange}
                  min={0}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    启用横幅
                  </span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                {loading ? "保存中..." : editingId ? "保存修改" : "添加横幅"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
