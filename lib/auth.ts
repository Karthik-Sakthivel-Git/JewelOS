/**
 * OTP authentication helpers.
 *
 * In development, when DEV_OTP_BYPASS=true:
 *   - No SMS is sent; the fixed code is logged to the terminal
 *   - DEV_OTP_CODE (default 123456) is accepted for any number
 * These guards are double-fenced: NODE_ENV must also be "development".
 */

const DEV_BYPASS_ENABLED =
  process.env.NODE_ENV === "development" &&
  process.env.DEV_OTP_BYPASS === "true";

const DEV_OTP = process.env.DEV_OTP_CODE ?? "123456";

export interface SendOtpResult {
  success: boolean;
  message: string;
  devOtp?: string;
}

export async function sendOtp(phone: string): Promise<SendOtpResult> {
  if (DEV_BYPASS_ENABLED) {
    console.log(`\n🔑 [DEV BYPASS] OTP for ${phone}: ${DEV_OTP}\n`);
    return { success: true, message: "OTP sent (dev bypass)", devOtp: DEV_OTP };
  }

  // Production path — integrate SMS provider here (MSG91, Twilio, etc.)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`[OTP] Generated for ${phone}: ${otp}`);

  // TODO: Store OTP in database with 5-min expiry
  // TODO: Send via SMS provider

  return { success: true, message: "OTP sent" };
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
}

export async function verifyOtp(
  phone: string,
  otp: string
): Promise<VerifyOtpResult> {
  if (DEV_BYPASS_ENABLED) {
    if (otp === DEV_OTP) {
      console.log(`\n✅ [DEV BYPASS] OTP verified for ${phone}\n`);
      return { success: true, message: "Verified (dev bypass)" };
    }
    return { success: false, message: `Invalid OTP — dev code is ${DEV_OTP}` };
  }

  // Production path — verify against database-stored OTP
  // TODO: Look up OTP record by phone, check expiry, compare hash

  return { success: false, message: "Invalid OTP" };
}

export function isDevBypassEnabled(): boolean {
  return DEV_BYPASS_ENABLED;
}
