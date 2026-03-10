import { NextResponse } from "next/server";

import { getCurrentAdminSession } from "@/lib/admin-auth";
import { createProduct, type ProductInput } from "@/lib/cms-data";

export async function POST(request: Request) {
  if (!(await getCurrentAdminSession())) {
    return NextResponse.json({ error: "未登录或登录已过期" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as ProductInput;
    const product = await createProduct(payload);
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "保存产品失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
