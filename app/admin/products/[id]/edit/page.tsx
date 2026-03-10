import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";
import { getProductById, getProductCategories } from "@/lib/cms-data";

export const metadata: Metadata = { title: "编辑产品 - 后台管理" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getProductCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">编辑产品</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl">
        <ProductForm categories={categories} product={product} />
      </div>
    </div>
  );
}
