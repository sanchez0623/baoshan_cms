import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("name, summary")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "产品未找到" };
  return {
    title: data.name,
    description: data.summary ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, category:product_categories(id,name,slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single<Product>();

  if (!product) notFound();

  // Related products in same category
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("id,name,slug,summary,image_url,category:product_categories(id,name,slug)")
    .eq("category_id", product.category_id ?? "")
    .eq("is_published", true)
    .neq("id", product.id)
    .limit(3)
    .returns<Product[]>();

  const specs = product.specifications as Record<string, string> | null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-700">首页</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-700">产品中心</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="hover:text-blue-700"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product image */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-80 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={600}
                  height={320}
                  className="w-full h-80 object-cover"
                />
              ) : (
                <div className="text-7xl text-blue-200">📡</div>
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full hover:bg-blue-100"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-4">
              {product.name}
            </h1>
            {product.summary && (
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.summary}
              </p>
            )}

            {/* Specs table */}
            {specs && Object.keys(specs).length > 0 && (
              <div className="mb-6">
                <h2 className="font-semibold text-gray-900 mb-3">产品规格</h2>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(specs).map(([key, value]) => (
                      <tr key={key} className="border-b">
                        <td className="py-2 pr-4 text-gray-500 w-1/3">{key}</td>
                        <td className="py-2 text-gray-900">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Link
                href="/contact"
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                获取报价
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-1 border border-gray-300 text-gray-700 hover:border-blue-700 hover:text-blue-700 px-4 py-3 rounded-lg transition-colors"
              >
                <ArrowLeft size={16} />
                返回列表
              </Link>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">产品详情</h2>
            <div className="prose text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-5">相关产品</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/products/${rp.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="h-36 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                    {rp.image_url ? (
                      <Image
                        src={rp.image_url}
                        alt={rp.name}
                        width={300}
                        height={144}
                        className="w-full h-36 object-cover"
                      />
                    ) : (
                      <div className="text-3xl text-blue-200">📡</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm group-hover:text-blue-700">
                      {rp.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
