import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendOtp, isDevBypassEnabled } from "@/lib/auth";

const schema = z.object({
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, "Invalid Indian mobile number"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = schema.parse(body);

    const result = await sendOtp(phone);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      ...(isDevBypassEnabled() && { devOtp: result.devOtp }),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
