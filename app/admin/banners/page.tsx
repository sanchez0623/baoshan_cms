import { createClient } from "@/lib/supabase/server";
import type { Banner } from "@/types";
import BannerManager from "@/components/admin/BannerManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "横幅管理 - 后台管理" };

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order")
    .returns<Banner[]>();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">横幅管理</h1>
      <BannerManager initialBanners={banners ?? []} />
    </div>
  );
}
