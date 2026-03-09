"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

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
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm(`确定要删除吗？此操作不可撤销。`)) return;
    setLoading(true);
    await supabase.from(table).delete().eq("id", id);
    router.refresh();
    setLoading(false);
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
