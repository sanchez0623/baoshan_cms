"use client";

import { useState } from "react";
import { CheckCircle, Save } from "lucide-react";

import { requestAdmin } from "@/lib/admin-api";
import type { SiteSetting } from "@/types";

export default function SettingsForm({
  settings,
}: {
  settings: SiteSetting[];
}) {
  const [values, setValues] = useState(
    settings.reduce(
      (accumulator, setting) => ({ ...accumulator, [setting.key]: setting.value ?? "" }),
      {} as Record<string, string>
    )
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setSaved(false);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await requestAdmin("/api/admin/site-settings", {
        method: "PUT",
        body: JSON.stringify({
          values: Object.fromEntries(
            settings.map((setting) => [setting.key, values[setting.key] || null])
          ),
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "保存失败，请稍后重试");
    }

    setLoading(false);
  };

  const displayOrder = [
    "site_name",
    "site_tagline",
    "company_name",
    "company_address",
    "company_phone",
    "company_email",
    "icp_number",
    "about_content",
    "footer_description",
    "wechat_qrcode",
  ];

  const orderedSettings = [
    ...displayOrder
      .map((key) => settings.find((setting) => setting.key === key))
      .filter(Boolean),
    ...settings.filter((setting) => !displayOrder.includes(setting.key)),
  ] as SiteSetting[];

  const isTextarea = (key: string) =>
    ["about_content", "footer_description"].includes(key);

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {orderedSettings.map((setting) => (
        <div key={setting.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {setting.label}
          </label>
          {isTextarea(setting.key) ? (
            <textarea
              value={values[setting.key] ?? ""}
              onChange={(event) => handleChange(setting.key, event.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          ) : (
            <input
              type="text"
              value={values[setting.key] ?? ""}
              onChange={(event) => handleChange(setting.key, event.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      ))}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
      >
        {saved ? (
          <>
            <CheckCircle size={16} className="text-green-300" />
            已保存
          </>
        ) : (
          <>
            <Save size={16} />
            {loading ? "保存中..." : "保存设置"}
          </>
        )}
      </button>
    </form>
  );
}
