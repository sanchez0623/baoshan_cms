"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SiteSetting } from "@/types";
import { Save, CheckCircle } from "lucide-react";

export default function SettingsForm({
  settings,
}: {
  settings: SiteSetting[];
}) {
  const [values, setValues] = useState(
    settings.reduce(
      (acc, s) => ({ ...acc, [s.key]: s.value ?? "" }),
      {} as Record<string, string>
    )
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Update each setting
    const updates = settings.map((s) =>
      supabase
        .from("site_settings")
        .update({ value: values[s.key] || null })
        .eq("key", s.key)
    );

    const results = await Promise.all(updates);
    const firstError = results.find((r) => r.error)?.error;

    if (firstError) {
      setError(firstError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setLoading(false);
  };

  // Group settings by category
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
      .map((k) => settings.find((s) => s.key === k))
      .filter(Boolean),
    ...settings.filter((s) => !displayOrder.includes(s.key)),
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
              onChange={(e) => handleChange(setting.key, e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          ) : (
            <input
              type="text"
              value={values[setting.key] ?? ""}
              onChange={(e) => handleChange(setting.key, e.target.value)}
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
