import { NextResponse } from "next/server";

import { getCurrentAdminSession } from "@/lib/admin-auth";
import { createArticle, type ArticleInput } from "@/lib/cms-data";

export async function POST(request: Request) {
  if (!(await getCurrentAdminSession())) {
    return NextResponse.json({ error: "未登录或登录已过期" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as ArticleInput;
    const article = await createArticle(payload);
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    const message = error instanceof Error ? error.message : "保存文章失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
