import { NextResponse } from "next/server";

import { getCurrentAdminSession } from "@/lib/admin-auth";
import { updateSiteSettings } from "@/lib/cms-data";

export async function PUT(request: Request) {
  if (!(await getCurrentAdminSession())) {
    return NextResponse.json({ error: "未登录或登录已过期" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { values?: Record<string, string | null> };
    const settings = await updateSiteSettings(body.values ?? {});
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "保存设置失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
