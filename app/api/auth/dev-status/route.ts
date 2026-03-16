import { NextResponse } from "next/server";

export async function GET() {
  const isDev =
    process.env.NODE_ENV === "development" &&
    process.env.DEV_OTP_BYPASS === "true";

  return NextResponse.json({
    devBypass: isDev,
    otpCode: isDev ? (process.env.DEV_OTP_CODE ?? "123456") : undefined,
  });
}
