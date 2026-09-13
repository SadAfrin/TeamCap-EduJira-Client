"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff, FiLoader, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email)
      return toast.error("Email is missing. Please request a new code.");
    if (otp.length !== 6) return toast.error("Please enter the 6-digit code.");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters.");

    setLoading(true);

    const { error } = await authClient.emailOtp.resetPassword({
      email: email,
      otp: otp,
      password: password,
    });

    if (error) {
      toast.error(error.message || "An unexpected error occurred.");
    } else {
      toast.success("Password reset successfully! You can now log in.");
      router.push("/login");
    }
    setLoading(false);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50/50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Dynamic Animated Ambient Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 -z-10 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-indigo-300/40 to-pink-300/30 blur-3xl" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -left-32 -z-10 h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-sky-300/40 to-indigo-300/30 blur-3xl" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-white/60 bg-white/70 p-8 shadow-2xl shadow-indigo-950/5 backdrop-blur-2xl sm:p-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="group flex items-center gap-1.5 text-2xl font-black tracking-tight text-slate-900"
          >
            <span>Edu</span>
            <span className="text-indigo-600 transition-transform group-hover:translate-x-0.5">Jira</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            Reset Password
          </h1>
          <p className="mt-1.5 text-xs font-medium text-slate-500">
            Enter the 6-digit verification code sent to <br />
            <span className="font-semibold text-slate-700">{email || "your email"}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label 
              htmlFor="otp"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700"
            >
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-center text-lg font-bold tracking-widest text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-300 hover:border-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10"
            />
          </div>

          <div>
            <label 
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:shadow-none disabled:opacity-70"
          >
            {loading ? (
              <FiLoader className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Update Password</span>
                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Didn't receive a code?{" "}
          <Link href="/forget-password" className="font-semibold text-indigo-600 hover:underline">
            Resend Code
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <FiLoader className="h-7 w-7 animate-spin text-indigo-600" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}