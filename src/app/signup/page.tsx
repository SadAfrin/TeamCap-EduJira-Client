"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { preCheckEmail } from "../actions";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

const roles = [
  { id: "teacher", label: "Teacher" },
  { id: "student", label: "Student" },
  { id: "parent", label: "Parent" },
] as const;

type RoleId = (typeof roles)[number]["id"];

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string>("");

  const [activeRole, setActiveRole] = useState<RoleId>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await authClient.signIn.social({ provider: "google" });
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function applySelectedFile(file: File | undefined) {
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      const msg = "Please choose a JPG, PNG, WEBP, or GIF image.";
      setImageError(msg);
      toast.error(msg);
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      const msg = "Image must be 2MB or smaller.";
      setImageError(msg);
      toast.error(msg);
      return;
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const preview = URL.createObjectURL(file);
    previewUrlRef.current = preview;
    setImageFile(file);
    setImagePreview(preview);
    setImageError("");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    applySelectedFile(e.target.files?.[0]);
    e.target.value = "";
  }

  function handleRemoveImage() {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = "";
    setImageFile(null);
    setImagePreview("");
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    applySelectedFile(e.dataTransfer.files?.[0]);
  }

  async function uploadProfileImage(file: File): Promise<string | null> {
    const body = new FormData();
    body.append("file", file);

    const res = await fetch("/api/upload/image", {
      method: "POST",
      body,
    });
    const payload = await res.json().catch(() => ({}));

    if (!res.ok || !payload?.success || !payload?.data?.url) {
      throw new Error(
        payload?.message || "Image upload failed. Please try another photo.",
      );
    }

    return payload.data.url as string;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 1. Run local validation FIRST (Instant, no database needed)
    if (!name || !email || !password || !confirmPassword) {
      const msg = "Please fill in all fields to continue.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!imageFile) {
      const msg = "Please upload a profile photo from your device.";
      setImageError(msg);
      setError(msg);
      toast.error(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Passwords do not match. Please try again.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (password.length < 6) {
      const msg = "Password must be at least 6 characters long.";
      setError(msg);
      toast.error(msg);
      return;
    }

    // 2. Clear previous errors and start the loading spinner
    setError("");
    setImageError("");
    setLoading(true);

    try {
      // 3. NOW check the database (Inside the try/catch block!)
      const emailAlreadyRegistered = await preCheckEmail(email);

      if (emailAlreadyRegistered) {
        const msg = "This email is already registered. Please log in instead.";
        setError(msg);
        toast.error(msg);
        // Note: We don't need setLoading(false) here because the `finally` block handles it!
        return; // Stops Better Auth from ever running!
      }

      // 4. Upload the profile image before creating the account
      const uploadedImageUrl = await uploadProfileImage(imageFile);

      // 5. Send data to Better Auth
      const { data, error } = await authClient.signUp.email({
        email: email,
        password: password,
        name: name,
        image: uploadedImageUrl as string,
        role: activeRole,
        callbackURL: "/login?verified=true",
      });

      console.log("Signup response:", { data, error });

      // 6. Handle backend errors
      if (error) {
        if (error.code === "USER_ALREADY_EXISTS" || error.status === 400) {
          const msg =
            "This email is already registered. Please log in instead.";
          setError(msg);
          toast.error(msg);
          return;
        }

        const errorMsg = error.message || "Error signing up";
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // 7. Handle success and redirect
      if (data) {
        toast.success(
          "Account created! Please check your email to verify your account.",
        );
        router.push("/login");
      }
    } catch (err: unknown) {
      const fallbackError =
        (err as Error).message ||
        "An unexpected error occurred. Please try again.";
      setError(fallbackError);
      toast.error(fallbackError);
    } finally {
      // 8. This guarantees the loading spinner stops no matter what happens
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-12">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform-gpu blur-3xl">
        <div
          className="aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-8 lg:p-10">
        {/* Header / Logo */}
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter text-slate-900 transition-opacity hover:opacity-80"
          >
            Edu<span className="text-indigo-600">Jira</span>
          </Link>
          <h1 className="mt-8 text-2xl font-bold tracking-tight text-slate-900">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Select your role and enter your details to get started.
          </p>
        </div>

        {/* Role Selector (Segmented Control Style) */}
        <div className="mt-8 grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1.5">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setActiveRole(r.id)}
              aria-pressed={activeRole === r.id}
              className={`rounded-lg py-2 text-xs font-semibold transition-all duration-200 ${
                activeRole === r.id
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-900/5"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@school.edu"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label
              htmlFor="profileImage"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Profile photo
            </label>
            <input
              id="profileImage"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />

            {imagePreview ? (
              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
                <Image
                  width={200}
                  height={200}
                  src={imagePreview}
                  alt="Selected profile preview"
                  className="h-20 w-20 shrink-0 rounded-xl border border-slate-200 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {imageFile?.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {imageFile
                      ? `${(imageFile.size / 1024).toFixed(0)} KB`
                      : "Ready to upload"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-all hover:border-indigo-200 hover:bg-indigo-50"
                    >
                      Change photo
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 transition-all hover:border-rose-200 hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center transition-all sm:py-7 ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : imageError
                      ? "border-rose-300 bg-rose-50/40"
                      : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40"
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">
                  📷
                </span>
                <p className="mt-3 text-sm font-semibold text-slate-800">
                  Tap to upload a photo
                </p>
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                  On phones, choose Take Photo or Photo Library. JPG, PNG, or
                  WEBP up to 2MB.
                </p>
              </div>
            )}
            {imageError && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {imageError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "Creating account..."
              : `Register as ${roles.find((r) => r.id === activeRole)?.label}`}
          </button>
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

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
