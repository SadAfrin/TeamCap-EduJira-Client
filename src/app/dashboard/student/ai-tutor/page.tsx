"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
  keyConcepts?: string[];
  suggestedFollowUps?: string[];
  timestamp: string;
}

export default function StudentAITutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "👋 Hi Rahim! I'm your **EduJira 24/7 AI Study Tutor**. I can help explain difficult concepts, break down complex math & science formulas, or review homework problems. What would you like to explore today?",
      keyConcepts: ["Step-by-step explanations", "Math & Geometry proofs", "Science & Physics mechanisms"],
      suggestedFollowUps: [
        "Explain Pythagorean Theorem with an example",
        "How does Photosynthesis work?",
        "Explain Newton's Universal Law of Gravitation",
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await apiPost("/api/ai/tutor/chat", {
        question: textToSend,
        subject,
        studentGrade: "Class 8",
      });

      if (res.success && res.data) {
        const botMsg: ChatMessage = {
          role: "bot",
          text: res.data.reply,
          keyConcepts: res.data.keyConcepts,
          suggestedFollowUps: res.data.suggestedFollowUps,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error("AI tutor error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "I encountered an issue connecting to the AI tutor. Please check your network and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[850px] rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-600 text-white font-bold text-lg shadow-md shadow-purple-500/20">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-sm">EduJira AI Study Tutor</h2>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live 24/7
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Curriculum-aligned assistance for Class 8</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-600"
          >
            <option value="Mathematics">Mathematics</option>
            <option value="General Science">General Science</option>
            <option value="ICT & Computing">ICT & Computing</option>
            <option value="English">English</option>
          </select>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"} animate-in fade-in duration-200`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                m.role === "user"
                  ? "bg-indigo-600 text-white font-medium rounded-br-none"
                  : "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-none"
              }`}
            >
              <div className="whitespace-pre-line prose-sm">{m.text}</div>

              {m.keyConcepts && m.keyConcepts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                    Key Concepts Covered:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.keyConcepts.map((c, i) => (
                      <span key={i} className="rounded-md bg-indigo-100/70 px-2 py-0.5 text-[10px] font-semibold text-indigo-900">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Follow-up suggestions */}
            {m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 max-w-xl">
                {m.suggestedFollowUps.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="rounded-full border border-indigo-200 bg-indigo-50/60 px-3 py-1 text-[11px] font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>
            )}

            <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl w-fit border border-slate-200">
            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
            <span>AI Tutor is analyzing curriculum and formulating explanation...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="border-t border-slate-200 bg-white p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask a question in ${subject} (e.g., "Explain how gravity works" or "Solve a right triangle")...`}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="rounded-2xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 disabled:opacity-40 transition-all"
          >
            Ask Tutor →
          </button>
        </form>
      </div>
    </div>
  );
}
