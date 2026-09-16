"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    const { error } = await authClient.emailOtp.requestPasswordReset({
      email: email, // This triggers the 6-digit code email
    });

    if (error) {
      toast.error(error.message || "An unexpected error occurred.");
    } else {
      toast.success("A 6-digit code has been sent to your email!");
      // Redirect to the reset page and pass the email in the URL
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@school.edu"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
