import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我们",
  description: "了解宝山光通信的发展历程、技术实力和企业文化",
};

export const revalidate = 3600;

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("key,value");

  const settingsMap = (settings ?? []).reduce(
    (acc, s) => ({ ...acc, [s.key]: s.value }),
    {} as Record<string, string | null>
  );

  const companyName = settingsMap.company_name ?? "宝山光通信科技有限公司";
  const aboutContent =
    settingsMap.about_content ??
    "宝山光通信科技有限公司专注于光通信产品的研发、生产和销售，致力于为客户提供高品质的光纤、光缆、光模块及系统解决方案。";

  const milestones = [
    { year: "2004", event: "公司成立，专注光纤光缆产品研发与生产" },
    { year: "2008", event: "通过ISO 9001质量管理体系认证" },
    { year: "2012", event: "扩大产品线，进入光模块和无源器件领域" },
    { year: "2016", event: "建立全国服务网络，覆盖80+城市" },
    { year: "2019", event: "产品出口东南亚、中东等地区" },
    { year: "2022", event: "推出400G光模块产品系列，进军高速数据中心市场" },
    { year: "2024", event: "研发团队突破100人，开展800G及硅光技术预研" },
  ];

  const values = [
    {
      icon: "🎯",
      title: "专注专业",
      desc: "深耕光通信行业二十年，专注做好每一款产品",
    },
    {
      icon: "💡",
      title: "持续创新",
      desc: "持续投入研发，跟进行业最新技术趋势",
    },
    {
      icon: "🤝",
      title: "诚信合作",
      desc: "以诚信为本，与客户和伙伴建立长期合作关系",
    },
    {
      icon: "🌱",
      title: "绿色发展",
      desc: "推广低功耗产品，践行可持续发展理念",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">关于我们</h1>
          <p className="text-blue-200">{companyName}</p>
        </div>
      </div>

      {/* About content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Company intro */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">公司简介</h2>
              <p className="text-gray-600 leading-relaxed">{aboutContent}</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  { value: "2004", label: "创立年份" },
                  { value: "500+", label: "产品型号" },
                  { value: "100+", label: "研发人员" },
                  { value: "1000+", label: "服务客户" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-blue-50 rounded-lg p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-blue-700">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">🏭</div>
                <div className="text-gray-600 font-medium">现代化生产基地</div>
              </div>
            </div>
          </div>
        </div>

        {/* Core values */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            企业价值观
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-lg shadow-sm p-6 text-center"
              >
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Development milestones */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            发展历程
          </h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 transform md:-translate-x-0.5" />
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`flex items-center gap-4 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="relative z-10 flex-shrink-0 w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold md:mx-auto" />
                  <div
                    className={`bg-blue-50 rounded-lg p-4 flex-1 md:max-w-sm ${
                      i % 2 === 0 ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <div className="font-bold text-blue-700">{m.year}</div>
                    <div className="text-sm text-gray-600 mt-1">{m.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            资质认证
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🏅", name: "ISO 9001:2015", desc: "质量管理体系认证" },
              { icon: "✅", name: "CE认证", desc: "欧盟市场准入认证" },
              { icon: "♻️", name: "RoHS认证", desc: "欧盟环保指令认证" },
              { icon: "📋", name: "电信设备进网许可", desc: "工信部认证" },
            ].map((cert) => (
              <div
                key={cert.name}
                className="border rounded-lg p-4 text-center hover:border-blue-300 transition-colors"
              >
                <div className="text-3xl mb-2">{cert.icon}</div>
                <div className="font-semibold text-sm">{cert.name}</div>
                <div className="text-xs text-gray-500 mt-1">{cert.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
