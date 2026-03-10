"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";

import { requestAdmin } from "@/lib/admin-api";

export default function MarkReadButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMarkRead = async () => {
    setLoading(true);
    try {
      await requestAdmin(`/api/admin/contact-submissions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_read: true }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
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
