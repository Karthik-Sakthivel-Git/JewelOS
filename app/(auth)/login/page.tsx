"use client";

import { useState, useEffect } from "react";

type LoginStep = "phone" | "otp";

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devBypass, setDevBypass] = useState<{
    active: boolean;
    otpCode?: string;
  }>({ active: false });

  useEffect(() => {
    fetch("/api/auth/dev-status")
      .then((res) => res.json())
      .then((data) => {
        if (data.devBypass) {
          setDevBypass({ active: true, otpCode: data.otpCode });
        }
      })
      .catch(() => {});
  }, []);

  const isValidPhone = /^[6-9]\d{9}$/.test(phone);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidPhone) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send OTP");
      }

      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phone}`, otp }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid OTP");
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-8">
      {devBypass.active && (
        <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2.5 text-center text-sm font-medium text-yellow-800">
          Dev mode: OTP is <span className="font-mono font-bold">{devBypass.otpCode}</span>
        </div>
      )}

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-maroon-800">
          Jewel<span className="text-gold-400">OS</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Sign in to your store account
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                +91
              </span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="9876543210"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="input-field rounded-l-none"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValidPhone || loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-center text-sm text-gray-600">
            OTP sent to{" "}
            <span className="font-medium text-maroon-800">+91 {phone}</span>
          </p>

          <div>
            <label
              htmlFor="otp"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder={devBypass.active ? devBypass.otpCode : "000000"}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="input-field text-center text-2xl tracking-[0.5em]"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={otp.length !== 6 || loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Sign In"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("phone");
              setOtp("");
              setError("");
            }}
            className="w-full text-center text-sm text-maroon-800 hover:underline"
          >
            Change number
          </button>
        </form>
      )}
    </div>
  );
}
