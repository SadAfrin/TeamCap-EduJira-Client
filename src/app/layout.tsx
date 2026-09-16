import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Toaster } from "react-hot-toast";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "EduJira — Smart School Management Platform",
  description:
    "A centralized platform for schools to manage academics, attendance, and communication across admin, teacher, student, and parent roles.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-body min-h-screen bg-slate-50 text-ink antialiased`}
      >
        <Toaster
          toastOptions={{
            // Default duration for all toasts
            duration: 6000,

            // You can even set different times for success vs error
            success: {
              duration: 4000,
            },
            error: {
              duration: 8000, // Give users more time to read errors!
            },
          }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
