import type { Metadata } from "next";

import MarkReadButton from "@/components/admin/MarkReadButton";
import { getContacts } from "@/lib/cms-data";

export const metadata: Metadata = { title: "留言管理 - 后台管理" };

export default async function AdminContactsPage() {
  const allContacts = await getContacts();
  const unread = allContacts.filter((contact) => !contact.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">留言管理</h1>
          {unread > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              <span className="text-blue-600 font-medium">{unread}</span> 条未读留言
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {allContacts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm py-16 text-center text-gray-400">
            <div className="text-5xl mb-4">💬</div>
            <p>暂无留言</p>
          </div>
        ) : (
          allContacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-lg shadow-sm p-5 ${
                !contact.is_read ? "border-l-4 border-blue-500" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{contact.name}</span>
                    {contact.company && (
                      <span className="text-sm text-gray-500">· {contact.company}</span>
                    )}
                    {!contact.is_read && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        未读
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5 space-x-3">
                    <a href={`mailto:${contact.email}`} className="hover:text-blue-700">
                      📧 {contact.email}
                    </a>
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="hover:text-blue-700">
                        📞 {contact.phone}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className="text-xs text-gray-400">
                    {new Date(contact.created_at).toLocaleString("zh-CN")}
                  </span>
                  {!contact.is_read && <MarkReadButton id={contact.id} />}
                </div>
              </div>
              <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {contact.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
