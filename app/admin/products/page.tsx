import { createClient } from "@/lib/supabase/server";
import type { Product, ProductCategory } from "@/types";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import type { Metadata } from "next";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "产品管理 - 后台管理" };

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const [categoriesRes, productsRes] = await Promise.all([
    supabase
      .from("product_categories")
      .select("*")
      .order("sort_order")
      .returns<ProductCategory[]>(),
    supabase
      .from("products")
      .select("*, category:product_categories(id,name,slug)")
      .order("sort_order")
      .returns<Product[]>(),
  ]);

  const categories = categoriesRes.data ?? [];
  const products = productsRes.data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">产品管理</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          新增产品
        </Link>
      </div>

      {/* Category filter */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">产品名称</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">分类</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">状态</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">精选</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    暂无产品，
                    <Link href="/admin/products/new" className="text-blue-600">
                      点击添加
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-400">{product.slug}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {product.category?.name ?? "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          product.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {product.is_published ? "已发布" : "草稿"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs ${
                          product.is_featured ? "text-orange-600" : "text-gray-400"
                        }`}
                      >
                        {product.is_featured ? "★ 精选" : "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
                        >
                          <Pencil size={13} />
                          编辑
                        </Link>
                        <DeleteButton
                          id={product.id}
                          table="products"
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

      {/* Categories section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">产品分类</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-lg shadow-sm p-3 text-center"
            >
              <div className="font-medium text-sm text-gray-900">{cat.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {products.filter((p) => p.category?.slug === cat.slug).length} 件产品
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
