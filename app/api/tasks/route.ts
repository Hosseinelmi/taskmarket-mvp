import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const description = String(body.description || "").trim();

    if (!description) {
      return NextResponse.json(
        { error: "توضیح درخواست الزامی است." },
        { status: 400 }
      );
    }

    // پیدا کردن متغیر اتصال دیتابیس
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.POSTGRES_URL_NON_POOLING;

    if (!connectionString) {
      return NextResponse.json(
        { error: "اتصال به دیتابیس تنظیم نشده است." },
        { status: 500 }
      );
    }

    const sql = neon(connectionString);

    // ساخت کد یکتای درخواست
    const taskCode = `TM-${Date.now().toString().slice(-8)}`;

    // ساخت عنوان کوتاه
    const title =
      description.length > 80
        ? description.slice(0, 77) + "..."
        : description;

    const result = await sql`
      INSERT INTO tasks (
        task_code,
        title,
        description,
        category,
        required_skill,
        urgency,
        service_mode,
        status
      )
      VALUES (
        ${taskCode},
        ${title},
        ${description},
        ${body.category || "خدمات"},
        ${body.skill || null},
        ${body.urgency || "normal"},
        ${body.serviceMode || null},
        'OPEN'
      )
      RETURNING id, task_code, created_at;
    `;

    return NextResponse.json({
      success: true,
      taskId: result[0].id,
      taskCode: result[0].task_code,
      createdAt: result[0].created_at,
    });

  } catch (error) {
    console.error("TASK_CREATE_ERROR:", error);

    return NextResponse.json(
      { error: "خطا در ثبت درخواست." },
      { status: 500 }
    );
  }
}
