"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { requestAdmin } from "@/lib/admin-api";

export default function DeleteButton({
  id,
  table,
  label = "删除",
}: {
  id: string;
  table: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("确定要删除吗？此操作不可撤销。")) return;
    setLoading(true);

    try {
      await requestAdmin(`/api/admin/${table}/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1 text-red-500 hover:text-red-700 disabled:opacity-50 text-xs"
    >
      <Trash2 size={13} />
      {loading ? "..." : label}
    </button>
  );
}
