"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type MessageThread = {
  id: string;
  parentName: string;
  studentName: string;
  lastMessage: string;
  time: string;
  unread: boolean;
};

const INITIAL_THREADS: MessageThread[] = [
  { id: "1", parentName: "Tariqul Islam", studentName: "Rahim Uddin (Class 8-B)", lastMessage: "Thank you teacher for sending the extra math exercises!", time: "10:45 AM", unread: true },
  { id: "2", parentName: "Salma Begum", studentName: "Fatima Islam (Class 8-B)", lastMessage: "Will tomorrow's practical class require lab coats?", time: "Yesterday", unread: false },
  { id: "3", parentName: "Mahmudul Hasan", studentName: "Tanvir Hasan (Class 8-B)", lastMessage: "Noted regarding the upcoming quiz dates.", time: "Aug 29", unread: false },
];

export default function ParentCommunicationPage() {
  const [threads] = useState<MessageThread[]>(INITIAL_THREADS);
  const [activeThread, setActiveThread] = useState<MessageThread>(INITIAL_THREADS[0]);
  const [replyText, setReplyText] = useState("");

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;
    toast.success("Message delivered to parent portal!");
    setReplyText("");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Parent-Teacher Communication</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Direct messaging and academic updates with parents and guardians.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden h-[600px]">
        {/* Sidebar List */}
        <div className="border-r border-slate-200 divide-y divide-slate-100 overflow-y-auto">
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveThread(t)}
              className={`w-full text-left p-4 transition-colors ${
                activeThread.id === t.id ? "bg-blue-50/70" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{t.parentName}</span>
                <span className="text-[10px] text-slate-400">{t.time}</span>
              </div>
              <p className="text-[11px] font-semibold text-blue-600 mt-0.5">{t.studentName}</p>
              <p className="text-xs text-slate-500 truncate mt-1">{t.lastMessage}</p>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{activeThread.parentName}</h3>
                <p className="text-xs text-slate-500">Guardian of {activeThread.studentName}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">Online</span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 font-bold text-xs">P</div>
                <div className="rounded-2xl rounded-tl-none bg-slate-100 p-3 text-xs text-slate-800 max-w-md">
                  {activeThread.lastMessage}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-100 pt-4">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type message to parent..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-500"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
