"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { BrainCircuit, CheckCircle2, XCircle } from "lucide-react";

interface Attempt {
  _id: string;
  topic: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
  qaData: {
    question: string;
    options: string[];
    correctAnswer: string;
    studentAnswer: string;
    isCorrect: boolean;
  }[];
}

export default function QuizHistoryPage() {
  const { data: session } = authClient.useSession();
  const [history, setHistory] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/history?studentId=${session.user.id}`,
        );
        const json = await res.json();

        if (json.success) {
          setHistory(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [session?.user?.id]);

  if (loading)
    return (
      <div className="p-10 text-center font-bold animate-pulse text-violet-600">
        Loading your academic archives...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-slate-50">
      <div className="mb-10 flex items-center gap-4">
        <div className="p-3 bg-violet-100 rounded-xl text-violet-600">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            My Quiz History
          </h1>
          <p className="text-slate-500 font-medium">
            Review your past AI assessments and detailed answers.
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border text-center text-slate-500 font-medium shadow-sm">
          You haven&apos;t taken any AI quizzes yet.
        </div>
      ) : (
        <div className="space-y-8">
          {history.map((attempt) => (
            <div
              key={attempt._id}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              {/* Attempt Header */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-fuchsia-600">
                    {attempt.topic}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 font-medium">
                    {new Date(attempt.createdAt).toLocaleDateString()} at{" "}
                    {new Date(attempt.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl text-center">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Score
                  </div>
                  <div className="text-3xl font-black text-slate-700">
                    {attempt.score}
                    <span className="text-lg text-slate-400">
                      /{attempt.totalQuestions}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Q&A Review */}
              <div className="space-y-6">
                {attempt.qaData.map((qa, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl">
                    <h3 className="font-bold text-slate-700 mb-3 flex gap-3">
                      <span className="text-violet-500">{i + 1}.</span>{" "}
                      {qa.question}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
                        <span className="font-semibold text-slate-500 w-24">
                          You answered:
                        </span>
                        <span
                          className={`font-bold flex items-center gap-2 ${qa.isCorrect ? "text-emerald-500" : "text-rose-500"}`}
                        >
                          {qa.studentAnswer || "No answer"}
                          {qa.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </span>
                      </div>

                      {!qa.isCorrect && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700">
                          <span className="font-semibold w-24">
                            Correct was:
                          </span>
                          <span className="font-bold">{qa.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
