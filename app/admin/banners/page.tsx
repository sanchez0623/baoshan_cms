import type { Metadata } from "next";

import BannerManager from "@/components/admin/BannerManager";
import { getBanners } from "@/lib/cms-data";

export const metadata: Metadata = { title: "横幅管理 - 后台管理" };

export default async function AdminBannersPage() {
  const banners = await getBanners();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">横幅管理</h1>
      <BannerManager initialBanners={banners} />
    </div>
  );
}
