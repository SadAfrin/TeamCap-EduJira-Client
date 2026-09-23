"use client";
import { useState, useEffect } from "react";

// Define the shape of your student data
interface TopStudent {
  _id: string; // This is now the studentId (e.g., "STD-801")
  name: string;
  className: string;
  section: string;
  marks: number;
  gpa: number;
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<TopStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("All");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        // Append the selected class as a query parameter
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/students/top?className=${selectedClass}`,
          {
            credentials: "include", // 🚨 This tells the browser to send your Better Auth session cookies
          },
        );
        const json = await res.json();
        console.log("Leaderboard data:", json); // Debugging line
        if (json.success) {
          setLeaders(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard");
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [selectedClass]);

  const topThree = leaders.slice(0, 3);
  const runnersUp = leaders.slice(3);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="p-10 text-center text-xl font-bold animate-pulse text-blue-600">
          Syncing Academic Records...
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50/50 p-6 md:p-10 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-700 via-indigo-600 to-purple-600 tracking-tight">
            Academic Wall of Fame
          </h1>
          <p className="text-gray-500 mt-3 font-medium text-lg">
            Celebrating the top 10 scholars across the institution.
          </p>

          <div className="flex justify-center m-12 relative z-20">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="relative appearance-none bg-white/90 backdrop-blur-md border-0 shadow-sm px-8 py-4 rounded-xl text-slate-700 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-12 transition-all"
              >
                <option value="All">🏆 All Classes</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {leaders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center text-gray-500 font-medium text-lg">
            No academic data available for this term yet.
          </div>
        ) : (
          <>
            {/* Top 3 Podium Section */}
            <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-16 md:h-80">
              {/* Rank 2 - Silver */}
              {topThree[1] && (
                <div className="w-full md:w-1/3 max-w-sm order-2 md:order-1 transform transition hover:-translate-y-2">
                  <div className="bg-linear-to-b from-slate-100 to-white rounded-t-3xl rounded-b-xl shadow-lg border border-slate-200 p-6 text-center h-64 flex flex-col justify-between">
                    <div>
                      <div className="text-4xl mb-2">🥈</div>
                      <h3 className="text-xl font-bold text-slate-800">
                        {topThree[1].name}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">
                        {topThree[1].className} • {topThree[1].section}
                      </p>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-3 text-white">
                      <div className="font-black text-2xl">
                        {topThree[1].marks}{" "}
                        <span className="text-sm font-normal text-slate-300">
                          pts
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-semibold">
                        GPA: {topThree[1].gpa?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rank 1 - Gold (Taller and in the center) */}
              {topThree[0] && (
                <div className="w-full md:w-1/3 max-w-sm order-1 md:order-2 transform transition hover:-translate-y-2 relative z-10">
                  <div className="absolute -inset-1 bg-linear-to-r from-yellow-400 to-amber-600 rounded-t-3xl rounded-b-xl blur opacity-30"></div>
                  <div className="bg-linear-to-b from-yellow-50 to-white rounded-t-3xl rounded-b-xl shadow-2xl border-2 border-yellow-300 p-8 text-center h-80 flex flex-col justify-between relative">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-md">
                      First Place
                    </div>
                    <div>
                      <div className="text-6xl mb-4 drop-shadow-sm">🥇</div>
                      <h3 className="text-2xl font-black text-yellow-900">
                        {topThree[0].name}
                      </h3>
                      <p className="text-sm text-yellow-700 font-medium mt-1">
                        {topThree[0].className} • {topThree[0].section}
                      </p>
                    </div>
                    <div className="bg-linear-to-r from-yellow-500 to-amber-500 rounded-xl p-4 text-white shadow-inner">
                      <div className="font-black text-3xl">
                        {topThree[0].marks}{" "}
                        <span className="text-sm font-normal text-yellow-100">
                          pts
                        </span>
                      </div>
                      <div className="text-xs text-yellow-100 mt-1 uppercase tracking-wider font-bold">
                        GPA: {topThree[0].gpa?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rank 3 - Bronze */}
              {topThree[2] && (
                <div className="w-full md:w-1/3 max-w-sm order-3 md:order-3 transform transition hover:-translate-y-2">
                  <div className="bg-linear-to-b from-orange-50 to-white rounded-t-3xl rounded-b-xl shadow-lg border border-orange-200 p-6 text-center h-56 flex flex-col justify-between">
                    <div>
                      <div className="text-4xl mb-2">🥉</div>
                      <h3 className="text-xl font-bold text-orange-900">
                        {topThree[2].name}
                      </h3>
                      <p className="text-sm text-orange-700 font-medium mt-1">
                        {topThree[2].className} • {topThree[2].section}
                      </p>
                    </div>
                    <div className="bg-orange-800 rounded-xl p-3 text-white">
                      <div className="font-black text-2xl">
                        {topThree[2].marks}{" "}
                        <span className="text-sm font-normal text-orange-200">
                          pts
                        </span>
                      </div>
                      <div className="text-xs text-orange-200 mt-1 uppercase tracking-wider font-semibold">
                        GPA: {topThree[2].gpa?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ranks 4-10 Grid (Fills the empty left/right space) */}
            {runnersUp.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {runnersUp.map((student, index) => (
                  <div
                    key={student._id}
                    className="bg-white rounded-2xl p-5 flex items-center shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center font-black text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      #{index + 4}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                        {student.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {student.className} • Sec {student.section}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-lg text-gray-800">
                        {student.marks}
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">
                        GPA {student.gpa?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
