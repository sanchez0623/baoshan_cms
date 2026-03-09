import { createClient } from "@/lib/supabase/server";
import type { SiteSetting } from "@/types";
import SettingsForm from "@/components/admin/SettingsForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "网站设置 - 后台管理" };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .order("key")
    .returns<SiteSetting[]>();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">网站设置</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <SettingsForm settings={settings ?? []} />
      </div>
    </div>
  );
}
