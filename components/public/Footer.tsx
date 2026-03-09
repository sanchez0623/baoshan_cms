import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer({
  settings,
}: {
  settings: Record<string, string | null>;
}) {
  const siteName = settings.site_name ?? "宝山光通信";
  const companyName = settings.company_name ?? siteName;
  const phone = settings.company_phone;
  const email = settings.company_email;
  const address = settings.company_address;
  const icpNumber = settings.icp_number;
  const description = settings.footer_description ?? "";

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">光</span>
              </div>
              <span className="text-white font-bold text-lg">{siteName}</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">{description}</p>
            <div className="space-y-2 text-sm">
              {phone && (
                <div className="flex items-center space-x-2">
                  <Phone size={14} className="text-blue-400" />
                  <span>{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center space-x-2">
                  <Mail size={14} className="text-blue-400" />
                  <span>{email}</span>
                </div>
              )}
              {address && (
                <div className="flex items-center space-x-2">
                  <MapPin size={14} className="text-blue-400" />
                  <span>{address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">快速导航</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/products", label: "产品中心" },
                { href: "/news", label: "新闻资讯" },
                { href: "/about", label: "关于我们" },
                { href: "/contact", label: "联系我们" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">产品分类</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/products?category=optical-fiber-cables", label: "光纤光缆" },
                { href: "/products?category=optical-modules", label: "光模块" },
                { href: "/products?category=passive-optical-components", label: "无源光器件" },
                { href: "/products?category=active-equipment", label: "有源设备" },
                { href: "/products?category=test-instruments", label: "测试仪表" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} {companyName}. 保留所有权利.
            {icpNumber && (
              <span className="ml-2">
                <a
                  href="https://beian.miit.gov.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300"
                >
                  {icpNumber}
                </a>
              </span>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
