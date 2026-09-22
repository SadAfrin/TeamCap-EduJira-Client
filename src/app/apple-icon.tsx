import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          width="156"
          height="156"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="g"
              x1="4"
              y1="30"
              x2="28"
              y2="2"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4F46E5" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#g)"
            d="M3 2h26v7H11v3.5h16v7H11V23h18v7H3V2z"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
