import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, "Invalid Indian mobile number"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp } = schema.parse(body);

    // TODO: Verify OTP from database
    // TODO: Create/find user and generate session
    // For development, accept any 6-digit OTP
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({
        success: true,
        message: "Verified (dev mode)",
      });
    }

    // Production: verify against stored OTP
    return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
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
