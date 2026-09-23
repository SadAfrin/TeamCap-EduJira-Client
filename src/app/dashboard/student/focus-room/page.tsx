"use client";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function FocusRoomPage() {
  // 1. Fetch the active session from Better Auth
  const { data: session } = authClient.useSession();

  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [subject, setSubject] = useState("Math");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // 🚨 Paste it right here:
  const toggleTimer = () => {
    setIsActive((prev) => !prev);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const handleSave = async () => {
    setIsActive(false);

    const minutesStudied = Math.floor(seconds / 60);

    if (minutesStudied < 1) {
      toast.error(
        "Study session too short to log. Keep going until you hit 1 minute!",
      );
      return;
    }

    // 2. CRITICAL: Prevent saving if the session hasn't loaded or user is logged out
    if (!session?.user?.id) {
      toast.error("Authentication error. Could not find your user ID.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Saving your study session...");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // 3. Dynamically insert the logged-in user's ID here!
          studentId: session.user.id,
          subject,
          durationInMinutes: minutesStudied,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `Awesome! Saved ${minutesStudied} minutes of ${subject}.`,
          {
            id: loadingToast,
          },
        );
        setSeconds(0);
      } else {
        toast.error("Failed to save session.", { id: loadingToast });
      }
    } catch (error) {
      console.error("Failed to save session", error);
      toast.error("Network error. Please check your connection.", {
        id: loadingToast,
      });
    }

    setLoading(false);
  };

  // Format time for display (MM:SS)
  const displayMinutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const displaySeconds = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="min-h-7xl bg-gray-50 p-6 flex flex-col items-center justify-center">
      {/* Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 text-black">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-6 text-center text-white">
          <h1 className="text-3xl font-extrabold tracking-tight">Focus Room</h1>
          <p className="text-blue-100 text-sm mt-2 opacity-90">
            Deep work makes the difference.
          </p>
        </div>

        <div className="p-8">
          {/* Subject Selector */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              I am studying
            </label>
            <select
              className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium text-gray-700 disabled:opacity-50"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isActive && seconds > 0}
            >
              <option value="Math">Math</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Science">General Science</option>
              <option value="English">English</option>
              <option value="Bangla">Bangla</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="ICT">ICT</option>
            </select>
          </div>

          {/* Timer Display */}
          <div className="flex justify-center mb-10">
            <div className="text-7xl font-black font-mono tracking-tighter text-gray-800 drop-shadow-sm">
              {displayMinutes}
              <span className="text-blue-500 animate-pulse">:</span>
              {displaySeconds}
            </div>
          </div>

          {/* Start / Pause / Reset Controls */}
          <div className="flex gap-3 justify-center mb-6">
            <button
              onClick={toggleTimer}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-md ${
                isActive
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isActive ? "⏸ Pause" : seconds > 0 ? "▶ Resume" : "▶ Start"}
            </button>

            <button
              onClick={handleReset}
              disabled={seconds === 0}
              className="py-3 px-6 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 Reset
            </button>
          </div>

          {/* Dedicated Save Button (Only shows if there is time to save) */}
          <div
            className={`transition-all duration-300 ${seconds > 0 ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}`}
          >
            <hr className="my-6 border-gray-100" />
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl font-extrabold text-white bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                <>💾 Save Study Record</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
