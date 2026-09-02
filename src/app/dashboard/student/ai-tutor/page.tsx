"use client";

import { useState } from "react";

type ChatMsg = {
  sender: "user" | "ai";
  text: string;
  time: string;
};

const INITIAL_MESSAGES: ChatMsg[] = [
  {
    sender: "ai",
    text: "Hello! I am your EduJira AI Learning Assistant 🤖. How can I assist you with your homework or study concepts today? (e.g. Physics formulas, Algebra theorems, or English essay structure)",
    time: "Just now",
  },
];

export default function AITutorPage() {
  const [messages, setMessages] = useState<ChatMsg[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMsg = { sender: "user", text: inputText, time: "Now" };
    setMessages((prev) => [...prev, userMsg]);
    const prompt = inputText;
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "That's a great question! Based on your Grade 8 curriculum: Remember that force equals mass times acceleration (F = m × a). Let me break down the steps clearly...";
      if (prompt.toLowerCase().includes("math") || prompt.toLowerCase().includes("algebra")) {
        aiReply = "In algebra, to solve linear equations, balance both sides by isolating the variable. For example: if 2x + 4 = 10, subtract 4 from both sides to get 2x = 6, then divide by 2 so x = 3!";
      } else if (prompt.toLowerCase().includes("science") || prompt.toLowerCase().includes("cell")) {
        aiReply = "Plant cells have both a cell wall and chloroplasts which carry out photosynthesis, whereas animal cells do not. Both have a nucleus and mitochondria.";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: aiReply, time: "Just now" }]);
      setIsTyping(false);
    }, 1000);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Virtual Assistive AI Tutor</h1>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
            ⚡ 24/7 AI Homework Helper
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Ask questions, receive step-by-step math solutions, and get instant explanations for any subject.
        </p>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white shadow-xs h-[550px] overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "ai" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm">
                  🤖
                </div>
              )}
              <div
                className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none"
                }`}
              >
                {m.text}
                <span className={`block text-[10px] mt-1.5 ${m.sender === "user" ? "text-emerald-200" : "text-slate-400"}`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" />
              <span>AI Tutor is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="border-t border-slate-200 p-4 bg-slate-50 flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a question (e.g. Explain photosynthesis or help with quadratic formula)..."
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-emerald-500"
          >
            Ask AI
          </button>
        </form>
      </div>
    </div>
  );
}
