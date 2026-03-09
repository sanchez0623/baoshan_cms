import { createClient } from "@/lib/supabase/server";
import type { Product, ProductCategory } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "产品中心",
  description: "宝山光通信产品中心，涵盖光纤光缆、光模块、无源光器件、有源设备及测试仪表等全系列产品。",
};

export const revalidate = 60;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;

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
      .eq("is_published", true)
      .order("sort_order")
      .returns<Product[]>(),
  ]);

  const categories = categoriesRes.data ?? [];
  const allProducts = productsRes.data ?? [];

  const filteredProducts = categorySlug
    ? allProducts.filter((p) => p.category?.slug === categorySlug)
    : allProducts;

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">产品中心</h1>
          <p className="text-blue-200 mt-2">
            全系列光通信产品，覆盖各类应用场景
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar categories */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold text-gray-900 mb-3">产品分类</h2>
              <nav className="space-y-1">
                <Link
                  href="/products"
                  className={`block px-3 py-2 rounded text-sm transition-colors ${
                    !categorySlug
                      ? "bg-blue-700 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  全部产品
                  <span className="ml-1 text-xs opacity-70">
                    ({allProducts.length})
                  </span>
                </Link>
                {categories.map((cat) => {
                  const count = allProducts.filter(
                    (p) => p.category?.slug === cat.slug
                  ).length;
                  return (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className={`block px-3 py-2 rounded text-sm transition-colors ${
                        categorySlug === cat.slug
                          ? "bg-blue-700 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat.name}
                      <span className="ml-1 text-xs opacity-70">({count})</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">
                {activeCategory ? activeCategory.name : "全部产品"}
                <span className="ml-2 text-sm text-gray-400 font-normal">
                  共 {filteredProducts.length} 件产品
                </span>
              </h2>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">📦</div>
                <p>该分类暂无产品</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="h-44 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={300}
                          height={176}
                          className="w-full h-44 object-cover"
                        />
                      ) : (
                        <div className="text-4xl text-blue-200">📡</div>
                      )}
                    </div>
                    <div className="p-4">
                      {product.category && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {product.category.name}
                        </span>
                      )}
                      <h3 className="font-semibold text-gray-900 mt-2 group-hover:text-blue-700 transition-colors">
                        {product.name}
                      </h3>
                      {product.summary && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {product.summary}
                        </p>
                      )}
                      <div className="mt-3 flex items-center text-blue-600 text-sm">
                        查看详情 <ArrowRight size={14} className="ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
