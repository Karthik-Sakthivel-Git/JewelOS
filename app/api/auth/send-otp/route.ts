import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, "Invalid Indian mobile number"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = schema.parse(body);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // TODO: Store OTP in database with expiry
    // TODO: Send OTP via SMS provider (MSG91, Twilio, etc.)
    console.log(`[DEV] OTP for ${phone}: ${otp}`);

    return NextResponse.json({ success: true, message: "OTP sent" });
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
