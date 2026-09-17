"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { preCheckEmail } from "../actions";

const roles = [
  { id: "teacher", label: "Teacher" },
  { id: "student", label: "Student" },
  { id: "parent", label: "Parent" },
] as const;

type RoleId = (typeof roles)[number]["id"];

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

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
      throw new Error(payload?.message || "Image upload failed. Please try another photo.");
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
        image: uploadedImageUrl,
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
    <div className="relative flex min-h-screen