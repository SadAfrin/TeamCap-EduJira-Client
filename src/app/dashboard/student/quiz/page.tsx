"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Sparkles,
  BrainCircuit,
  Target,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Wand2,
  Trophy,
  History,
} from "lucide-react";
import Link from "next/link";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function AIQuizPage() {
  const { data: session } = authClient.useSession();

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>(
    {},
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerate = async () => {
    if (!topic) return toast.error("Please enter a topic first.");

    setLoading(true);
    const toastId = toast.loading("AI is crafting your quiz...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/quizzes/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic }),
        },
      );
      const json = await res.json();

      if (json.success) {
        setQuestions(json.data);
        setStudentAnswers({});
        setIsSubmitted(false);
        toast.success("Quiz generated successfully!", { id: toastId });
      } else {
        toast.error("AI couldn't generate the quiz.", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to connect to backend.", { id: toastId });
    }
    setLoading(false);
  };

  const handleSelectOption = (index: number, option: string) => {
    if (isSubmitted) return;
    setStudentAnswers((prev) => ({ ...prev, [index]: option }));
  };

  const handleGradeAndSave = async () => {
    if (Object.keys(studentAnswers).length < questions.length) {
      return toast.error("Please answer all 10 questions before submitting.");
    }

    let currentScore = 0;
    const qaData = questions.map((q, index) => {
      const isCorrect = studentAnswers[index] === q.correctAnswer;
      if (isCorrect) currentScore += 1;
      return {
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        studentAnswer: studentAnswers[index],
        isCorrect,
      };
    });

    setScore(currentScore);
    setIsSubmitted(true);
    const toastId = toast.loading("Saving your results...");

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/quizzes/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: session?.user?.id || "anonymous",
          topic,
          score: currentScore,
          qaData,
        }),
      });
      toast.success(`You scored ${currentScore}/10! Saved to your profile.`, {
        id: toastId,
      });
    } catch (error) {
      toast.error("Results generated, but failed to save to database.", {
        id: toastId,
      });
    }
  };

  // Framer Motion Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="relative min-h-screen p-6 overflow-hidden bg-slate-50 text-slate-800">
      {/* Magical Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-pulse"></div>
      <div
        className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute -bottom-32 left-1/2 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="max-w-4xl mx-auto relative z-10 pt-10 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center relative"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm text-sm font-bold text-green-600 tracking-wide uppercase">
            <Sparkles className="w-4 h-4" /> AI-Powered Learning
          </div>

          <h1 className="text-5xl font-black text-transparent bg-clip-text py-5 bg-linear-to-r from-green-600 via-blue-600 to-cyan-500 tracking-tight mb-4 flex justify-center items-center gap-3">
            <BrainCircuit className="w-12 h-12 text-green-600" />
            Dynamic Knowledge Engine
          </h1>

          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto mb-6">
            Summon a custom 10-question trial on any subject in the universe.
          </p>

          {/* New History Button */}
          <div className="flex justify-center">
            <Link href="/dashboard/student/quiz/history">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-slate-600 font-bold hover:text-blue-600 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
              >
                <History className="w-5 h-5" />
                View Quiz History
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Input Section */}
          {questions.length === 0 && (
            <motion.div
              key="input-section"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col items-center max-w-2xl mx-auto"
            >
              <div className="w-full relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-green-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-white rounded-xl shadow-sm border-0 focus-within:ring-2 focus-within:ring-green-500 pr-2">
                  <input
                    type="text"
                    placeholder="e.g., Bangla, English, Math, Science, History..."
                    className="w-full p-5 bg-transparent text-lg text-slate-700 placeholder-slate-400 focus:outline-none"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={loading}
                className="mt-8 flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-blue-600 text-white px-10 py-4 rounded-xl font-black text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Forging Quiz...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" /> Ignite Quiz Generation
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Quiz Section */}
          {questions.length > 0 && (
            <motion.div
              key="quiz-section"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {/* Quiz Header */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-white/50"
              >
                <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                    <Target className="w-5 h-5" />
                  </div>
                  Topic:{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-fuchsia-600">
                    {topic}
                  </span>
                </h2>
                {isSubmitted && (
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring" }} // Moved inside transition
                    className="mt-4 md:mt-0 flex items-center gap-2 bg-linear-to-r from-emerald-400 to-teal-500 text-white px-6 py-2 rounded-full font-black text-2xl shadow-lg shadow-emerald-500/30"
                  >
                    <Trophy className="w-6 h-6" /> Score: {score}/10
                  </motion.div>
                )}
              </motion.div>

              {/* Questions Grid */}
              {questions.map((q, index) => (
                <motion.div
                  variants={itemVariants}
                  key={index}
                  className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50"
                >
                  <h3 className="font-bold text-xl mb-6 text-slate-800 leading-relaxed">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-sm mr-3 font-black">
                      {index + 1}
                    </span>
                    {q.question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = studentAnswers[index] === opt;
                      const isCorrectAnswer = opt === q.correctAnswer;

                      let btnClass =
                        "bg-slate-50 border-transparent text-slate-600 hover:bg-violet-50 hover:text-violet-700";
                      let Icon = null;

                      if (isSelected) {
                        btnClass =
                          "bg-violet-500 text-white border-transparent shadow-lg shadow-violet-500/30";
                      }

                      if (isSubmitted) {
                        if (isCorrectAnswer) {
                          btnClass =
                            "bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-transparent shadow-md font-bold";
                          Icon = (
                            <CheckCircle2 className="w-5 h-5 text-white absolute right-4" />
                          );
                        } else if (isSelected && !isCorrectAnswer) {
                          btnClass =
                            "bg-rose-50 text-rose-500 border-rose-200 line-through opacity-80";
                          Icon = (
                            <XCircle className="w-5 h-5 text-rose-500 absolute right-4" />
                          );
                        } else {
                          btnClass =
                            "bg-slate-50 border-transparent text-slate-400 opacity-50";
                        }
                      }

                      return (
                        <motion.button
                          whileHover={
                            !isSubmitted ? { scale: 1.02, y: -2 } : {}
                          }
                          whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                          key={optIdx}
                          onClick={() => handleSelectOption(index, opt)}
                          disabled={isSubmitted}
                          className={`relative flex items-center text-left p-5 rounded-2xl border-2 transition-colors duration-300 font-medium ${btnClass}`}
                        >
                          {opt}
                          {Icon}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}

              <motion.div variants={itemVariants} className="pt-8 pb-16">
                {!isSubmitted ? (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGradeAndSave}
                    className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 via-fuchsia-600 to-cyan-500 text-white p-5 rounded-2xl font-black text-xl hover:shadow-xl hover:shadow-fuchsia-500/30 transition-all duration-300"
                  >
                    <CheckCircle2 className="w-6 h-6" /> Submit & Calculate
                    Destiny
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setQuestions([]);
                      setTopic("");
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white p-5 rounded-2xl font-black text-xl hover:bg-slate-900 hover:shadow-xl transition-all duration-300"
                  >
                    <RotateCcw className="w-6 h-6" /> Embark on a New Topic
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
