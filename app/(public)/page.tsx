import { getArticles, getBanners, getProducts } from "@/lib/cms-data";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale/zh-CN";

export const revalidate = 60;

export default async function HomePage() {
  const [banners, products, articles] = await Promise.all([
    getBanners({ activeOnly: true }),
    getProducts({ publishedOnly: true, featuredOnly: true, limit: 6 }),
    getArticles({ publishedOnly: true, limit: 3 }),
  ]);

  const advantages = [
    "20年光通信行业专业经验",
    "通过ISO 9001:2015质量认证",
    "自主研发生产，品质保障",
    "覆盖全国80+城市服务网络",
    "专业售后技术支持团队",
    "产品符合ITU-T/IEC国际标准",
  ];

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-blue-900 text-white overflow-hidden">
        {banners.length > 0 ? (
          <div className="relative">
            {banners.slice(0, 1).map((banner) => (
              <div key={banner.id} className="relative">
                {banner.image_url &&
                !banner.image_url.startsWith("/images/") ? (
                  <Image
                    src={banner.image_url}
                    alt={banner.title}
                    width={1920}
                    height={600}
                    className="w-full h-[480px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[480px] bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-2xl">
                      {banner.title}
                    </h1>
                    {banner.subtitle && (
                      <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.link_url && (
                      <Link
                        href={banner.link_url}
                        className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        {banner.link_text ?? "了解更多"}
                        <ArrowRight size={18} className="ml-2" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="w-full h-[480px] bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-2xl">
                  专业光通信产品与解决方案
                </h1>
                <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl">
                  光纤、光缆、光模块及系统集成，服务运营商、数据中心与企业用户
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  查看产品 <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Stats bar */}
      <section className="bg-blue-700 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: "20+", label: "年行业经验" },
              { value: "500+", label: "产品型号" },
              { value: "1000+", label: "服务客户" },
              { value: "80+", label: "覆盖城市" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">明星产品</h2>
              <p className="mt-2 text-gray-500">专业品质，覆盖光通信各类应用场景</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="text-5xl text-blue-200">📡</div>
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
                    <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                      查看详情 <ArrowRight size={14} className="ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/products"
                className="inline-flex items-center border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                查看全部产品 <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                为什么选择我们？
              </h2>
              <p className="text-gray-600 mb-6">
                深耕光通信行业二十年，我们以专业的技术积累、严格的质量管控和完善的服务体系，赢得了国内外众多客户的信赖。
              </p>
              <ul className="space-y-3">
                {advantages.map((item) => (
                  <li key={item} className="flex items-start space-x-3">
                    <CheckCircle
                      size={20}
                      className="text-green-500 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="inline-flex items-center mt-6 text-blue-700 font-semibold hover:text-blue-900"
              >
                了解更多 <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🏭", title: "自主生产", desc: "现代化生产基地，严格把控每道工序" },
                  { icon: "🔬", title: "研发实力", desc: "专业研发团队，持续技术创新" },
                  { icon: "✅", title: "质量认证", desc: "ISO 9001 / CE / RoHS 等国际认证" },
                  { icon: "🚚", title: "快速交付", desc: "库存充足，支持快速响应交货" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      {articles.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">新闻资讯</h2>
                <p className="text-gray-500 mt-1">行业动态，技术前沿</p>
              </div>
              <Link
                href="/news"
                className="text-blue-700 hover:text-blue-900 font-medium flex items-center"
              >
                更多新闻 <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    {article.cover_image_url ? (
                      <Image
                        src={article.cover_image_url}
                        alt={article.title}
                        width={400}
                        height={160}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="text-4xl">📰</div>
                    )}
                  </div>
                  <div className="p-4">
                    {article.published_at && (
                      <div className="text-xs text-gray-400 mb-1">
                        {format(new Date(article.published_at), "yyyy年MM月dd日", {
                          locale: zhCN,
                        })}
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {article.summary}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-blue-800 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">准备好与我们合作了吗？</h2>
          <p className="text-blue-200 mb-8 text-lg">
            联系我们的销售团队，获取产品报价和技术支持
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              <Phone size={18} className="mr-2" />
              立即联系
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center border-2 border-white text-white hover:bg-white hover:text-blue-800 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              浏览产品
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
