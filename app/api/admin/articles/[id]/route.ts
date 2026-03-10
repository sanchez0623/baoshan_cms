import { NextResponse } from "next/server";

import { getCurrentAdminSession } from "@/lib/admin-auth";
import { deleteArticle, type ArticleInput, updateArticle } from "@/lib/cms-data";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await getCurrentAdminSession())) {
    return NextResponse.json({ error: "未登录或登录已过期" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const payload = (await request.json()) as ArticleInput;
    const article = await updateArticle(id, payload);
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新文章失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await getCurrentAdminSession())) {
    return NextResponse.json({ error: "未登录或登录已过期" }, { status: 401 });
  }

  const { id } = await context.params;
  await deleteArticle(id);
  return NextResponse.json({ success: true });
}
