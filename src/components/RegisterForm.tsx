"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

type Role = "admin" | "teacher" | "student" | "parent";

const roles: { label: string; value: Role }[] = [
  { label: "Admin", value: "admin" },
  { label: "Teacher", value: "teacher" },
  { label: "Student", value: "student" },
  { label: "Parent", value: "parent" },
];

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const checkForm = () => {
    const newErrors: Errors = {};

    if (!name.trim()) newErrors.name = "Name is required";

    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Enter a valid email";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "At least 6 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = checkForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrors({ form: data.message || "Registration failed" });
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      console.log(err);
      setErrors({ form: "Something went wrong, try again" });
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: `/dashboard/${role}` });
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="font-serif text-4xl text-[#1f2a44] mb-1">EduJira</h1>

      <h2 className="font-serif text-3xl text-[#1f2a44] mt-8">Create account</h2>
      <p className="text-[#6b6459] mt-1 mb-6">Choose your role, then fill in your details.</p>

      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3 mb-4">
          {errors.form}
        </div>
      )}

      {/* Role tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {roles.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setRole(r.value)}
            className={`px-5 py-2 rounded-md border text-sm font-medium transition ${
              role === r.value
                ? "bg-[#2f5233] border-[#2f5233] text-white"
                : "bg-transparent border-[#d8d0bd] text-[#1f2a44] hover:border-[#1f2a44]"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-[#1f2a44] mb-1.5">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            placeholder="Your full name"
            className={`w-full bg-white border rounded-md px-4 py-3 text-[#1f2a44] placeholder:text-[#a8a094] focus:outline-none focus:ring-1 ${
              errors.name ? "border-red-400 focus:ring-red-300" : "border-[#d8d0bd] focus:ring-[#1f2a44]"
            }`}
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm text-[#1f2a44] mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            placeholder="name@school.edu"
            className={`w-full bg-white border rounded-md px-4 py-3 text-[#1f2a44] placeholder:text-[#a8a094] focus:outline-none focus:ring-1 ${
              errors.email ? "border-red-400 focus:ring-red-300" : "border-[#d8d0bd] focus:ring-[#1f2a44]"
            }`}
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm text-[#1f2a44] mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            placeholder="Enter your password"
            className={`w-full bg-white border rounded-md px-4 py-3 text-[#1f2a44] placeholder:text-[#a8a094] focus:outline-none focus:ring-1 ${
              errors.password ? "border-red-400 focus:ring-red-300" : "border-[#d8d0bd] focus:ring-[#1f2a44]"
            }`}
          />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm text-[#1f2a44] mb-1.5">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
            }}
            placeholder="Re-enter your password"
            className={`w-full bg-white border rounded-md px-4 py-3 text-[#1f2a44] placeholder:text-[#a8a094] focus:outline-none focus:ring-1 ${
              errors.confirmPassword ? "border-red-400 focus:ring-red-300" : "border-[#d8d0bd] focus:ring-[#1f2a44]"
            }`}
          />
          {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1f2a44] hover:bg-[#161d31] text-white font-semibold rounded-md py-3.5 transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : `Sign up as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#d8d0bd]" />
        <span className="text-xs text-[#a8a094]">or continue with</span>
        <div className="flex-1 h-px bg-[#d8d0bd]" />
      </div>

      {/* Google Sign-up */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-[#d8d0bd] hover:border-[#1f2a44] text-[#1f2a44] font-medium rounded-md py-3 transition disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"
            fill="#34A853"
          />
          <path
            d="M3.95 10.7A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.27-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"
            fill="#EA4335"
          />
        </svg>
        {googleLoading ? "Redirecting..." : "Sign up with Google"}
      </button>

      <p className="text-center text-[#6b6459] text-sm mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[#1f2a44] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}