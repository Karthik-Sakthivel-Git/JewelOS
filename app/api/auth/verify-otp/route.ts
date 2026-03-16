import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyOtp } from "@/lib/auth";

const schema = z.object({
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, "Invalid Indian mobile number"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp } = schema.parse(body);

    const result = await verifyOtp(phone, otp);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 401 });
    }

    // TODO: Create/find user in DB and generate NextAuth session
    return NextResponse.json({
      success: true,
      message: result.message,
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
