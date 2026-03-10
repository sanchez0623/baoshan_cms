import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import ContactForm from "@/components/public/ContactForm";
import { getSettingsMap } from "@/lib/cms-data";

export const metadata: Metadata = {
  title: "联系我们",
  description: "联系宝山光通信，获取产品报价和技术支持",
};

export const revalidate = 3600;

export default async function ContactPage() {
  const settingsMap = await getSettingsMap();

  const contactItems = [
    {
      icon: Phone,
      label: "联系电话",
      value: settingsMap.company_phone ?? "021-XXXXXXXX",
      href: `tel:${settingsMap.company_phone ?? ""}`,
    },
    {
      icon: Mail,
      label: "电子邮箱",
      value: settingsMap.company_email ?? "info@example.com",
      href: `mailto:${settingsMap.company_email ?? ""}`,
    },
    {
      icon: MapPin,
      label: "公司地址",
      value: settingsMap.company_address ?? "上海市宝山区",
      href: null,
    },
    {
      icon: Clock,
      label: "服务时间",
      value: "周一至周五 9:00 - 18:00",
      href: null,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">联系我们</h1>
          <p className="text-blue-200 mt-2">我们的专业团队随时为您提供帮助</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">联系方式</h2>
            <div className="space-y-4 mb-8">
              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start space-x-4 bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-blue-700" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-medium text-gray-900 hover:text-blue-700"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="font-medium text-gray-900">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">公司位置</h3>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded h-48 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MapPin size={32} className="mx-auto mb-2 text-blue-400" />
                  <p className="text-sm">
                    {settingsMap.company_address ?? "上海市宝山区"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">在线留言</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
