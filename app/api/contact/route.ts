import { NextResponse } from "next/server";

import { createContactSubmission } from "@/lib/cms-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "姓名、邮箱和留言内容为必填项" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "请输入有效的邮箱地址" }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: "留言内容不能超过2000字" }, { status: 400 });
    }

    await createContactSubmission({
      name: String(name).slice(0, 100),
      email: String(email).slice(0, 200),
      phone: phone ? String(phone).slice(0, 50) : null,
      company: company ? String(company).slice(0, 200) : null,
      message: String(message).slice(0, 2000),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json({ error: "服务器错误，请稍后重试" }, { status: 500 });
  }
}
