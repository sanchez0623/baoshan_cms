"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCheck } from "lucide-react";

export default function MarkReadButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleMarkRead = async () => {
    setLoading(true);
    await supabase
      .from("contact_submissions")
      .update({ is_read: true })
      .eq("id", id);
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleMarkRead}
      disabled={loading}
      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
    >
      <CheckCheck size={13} />
      {loading ? "..." : "标为已读"}
    </button>
  );
}
