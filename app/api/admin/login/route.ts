import { NextResponse } from "next/server";

import {
  createSessionToken,
  setAdminSessionCookie,
} from "@/lib/admin-auth";
import { verifyAdminCredentials } from "@/lib/cms-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "请输入管理员邮箱和密码" }, { status: 400 });
    }

    const admin = await verifyAdminCredentials(email, password);
    if (!admin) {
      return NextResponse.json({ error: "邮箱或密码错误，请重试" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    const token = await createSessionToken(admin.email);
    setAdminSessionCookie(response, token);
    return response;
  } catch {
    return NextResponse.json({ error: "登录失败，请稍后重试" }, { status: 500 });
  }
}
