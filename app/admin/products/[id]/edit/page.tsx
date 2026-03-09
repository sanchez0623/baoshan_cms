import { createClient } from "@/lib/supabase/server";
import type { Product, ProductCategory } from "@/types";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "编辑产品 - 后台管理" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [productRes, categoriesRes] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single<Product>(),
    supabase
      .from("product_categories")
      .select("*")
      .order("sort_order")
      .returns<ProductCategory[]>(),
  ]);

  if (!productRes.data) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">编辑产品</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl">
        <ProductForm
          categories={categoriesRes.data ?? []}
          product={productRes.data}
        />
      </div>
    </div>
  );
}
