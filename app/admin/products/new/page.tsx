import { createClient } from "@/lib/supabase/server";
import type { ProductCategory } from "@/types";
import ProductForm from "@/components/admin/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "新增产品 - 后台管理" };

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .order("sort_order")
    .returns<ProductCategory[]>();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">新增产品</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl">
        <ProductForm categories={categories ?? []} />
      </div>
    </div>
  );
}
