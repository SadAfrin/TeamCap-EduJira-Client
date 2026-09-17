"use client";

import { useState } from "react";
import Image from "next/image";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
  role?: string;
}

export default function UserAvatar({
  src,
  name,
  size = 36,
  className = "",
  role,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const hasValidImage = src && src.trim().length > 0 && !imageError && src !== "/profile.png";

  const getInitials = () => {
    if (!name || name.trim().length === 0) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getRoleBg = () => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "from-purple-500 to-indigo-600";
      case "teacher":
        return "from-blue-500 to-cyan-600";
      case "student":
        return "from-emerald-500 to-teal-600";
      case "parent":
        return "from-amber-500 to-orange-600";
      default:
        return "from-indigo-500 to-violet-600";
    }
  };

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {hasValidImage ? (
        <Image
          src={src!}
          alt={name || "User Avatar"}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
          unoptimized
        />
      ) : name && name.trim().length > 0 ? (
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${getRoleBg()} font-bold text-white shadow-inner select-none`}
          style={{ fontSize: `${Math.max(10, Math.floor(size * 0.38))}px` }}
        >
          {getInitials()}
        </div>
      ) : (
        /* Anonymous / Default Person SVG Icon */
        <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-500">
          <svg
            className="h-3/5 w-3/5 text-slate-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.6-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
