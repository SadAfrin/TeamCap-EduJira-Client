"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { FiEye, FiEyeOff, FiLoader, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email verified successfully! You can now log in.");
    }
  }, [searchParams]);

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await authClient.signIn.social({ provider: "google" });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields to continue.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      if (data) {
        toast.success("Welcome back!");
        const userRole =
          (data as { user?: { role?: string } })?.user?.role || "student";
        router.push(`/dashboard/${userRole}`);
        router.refresh();
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "An unexpected error occurred.");
      setIsLoading(false);
    }
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

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-white/60 bg-white/70 p-8 shadow-2xl shadow-indigo-950/5 backdrop-blur-2xl sm:p-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="group flex items-center gap-1.5 text-2xl font-black tracking-tight text-slate-900"
          >
            <span>Edu</span>
            <span className="text-indigo-600 transition-transform group-hover:translate-x-0.5">
              Jira
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 font-medium">
            Enter your credentials to access your portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold text-slate-700 tracking-wide uppercase"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@school.edu"
              className="w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
              >
                Password
              </label>
              <Link
                href="/forget-password"
                className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
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
            disabled={isLoading}
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:shadow-none disabled:opacity-70"
          >
            {isLoading ? (
              <FiLoader className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Sign in</span>
                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-slate-200/80" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Or
          </span>
          <div className="h-px flex-1 bg-slate-200/80" />
        </div>

        {/* SSO Button (Optional UI element for aesthetics) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white/60 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-white hover:border-slate-300"
        >
          <FcGoogle size={18} />
          <span>Continue with Google</span>
        </button>

        {/* Help Footer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Trouble logging in?{" "}
          <Link
            href="/support"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Contact Support
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <FiLoader className="h-7 w-7 animate-spin text-indigo-600" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
