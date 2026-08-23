const aiFeatures = [
  {
    title: "AI early warning system",
    body: "Analyzes grades, attendance, and behavior trends to flag students at risk of failing and alerts teachers and admins in advance.",
  },
  {
    title: "Automated report card narrative generator",
    body: "Automatically generates a personalized, human-readable performance summary for each student's report card.",
  },
  {
    title: "Smart behavior & attendance pattern analyzer",
    body: "Detects unusual attendance or behavioral patterns, like frequent lateness or a sudden drop in attendance, and notifies staff.",
  },
  {
    title: "Multilingual notice translator",
    body: "Automatically translates school notices and announcements into each parent's preferred language.",
  },
  {
    title: "Automated resource & classroom allocation planner",
    body: "Suggests optimal classroom, teacher, and resource allocation based on schedules, capacity, and availability.",
  },
  {
    title: "Automated skill & career growth tracker",
    body: "Tracks academic performance, extracurriculars, and skill development over time to suggest suitable career paths.",
  },
  {
    title: "Virtual assistive learning & tutoring bot",
    body: "An AI-powered chatbot that helps students with homework questions, concept explanations, and study guidance in real time.",
  },
];

const operationsFeatures = [
  {
    title: "Role-based dashboards",
    body: "Separate, customized dashboards for admin, teacher, and student or parent roles, each showing only what's relevant.",
  },
  {
    title: "Digital attendance management",
    body: "Teachers mark and track daily attendance digitally, with automatic summary reports.",
  },
  {
    title: "Result & grade management system",
    body: "Teachers input marks per subject and term; the system calculates final results and generates transcripts.",
  },
  {
    title: "Class routine & timetable management",
    body: "Create, update, and display class schedules for each grade and section, viewable by every role.",
  },
  {
    title: "Role-based leave application workflow",
    body: "Parents submit a digital absence request, with an optional doctor's note upload, directly through their portal.",
  },
];

// Reusable card component updated with modern props and styling
function FeatureCard({
  title,
  body,
  variant = "ai",
}: {
  title: string;
  body: string;
  variant?: "ai" | "operations";
}) {
  const isAI = variant === "ai";

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isAI ? "hover:border-indigo-200 hover:shadow-indigo-900/5" : "hover:border-cyan-200 hover:shadow-cyan-900/5"}`}
    >
      <div>
        {/* Dynamic Icon Wrapper based on variant */}
        <div
          className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
            isAI
              ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
              : "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white"
          }`}
        >
          {isAI ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
          )}
        </div>

        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{body}</p>
      </div>
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header Section */}
      <section className="relative overflow-hidden px-6 pt-24 pb-16 lg:px-8">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-80">
          <div
            className="aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-50/50 px-3 py-1 text-sm font-medium text-indigo-600 backdrop-blur-sm">
            <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-indigo-600"></span>
            Twelve Core Features
          </div>

          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Everything a school needs,{" "}
            <span className="text-slate-400">nothing it doesn&apos;t.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            EduJira splits into two groups of features: intelligent tools that
            run in the background, and the daily operations every school already
            relies on.
          </p>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="mx-auto max-w-7xl  pb-20">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            AI-Powered Intelligence
          </h2>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aiFeatures.map((f) => (
            <FeatureCard
              key={f.title}
              title={f.title}
              body={f.body}
              variant="ai"
            />
          ))}
        </div>
      </section>

      {/* Operations Features Section */}
      <section className="mx-auto max-w-7xl pb-24 ">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 13.5V10.5m0 0h12m-12 0a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 10.5m-12 0v3m12-3v3m-12 0a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 13.5m-12 0V15a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 15v-1.5"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Daily Academic Operations
          </h2>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {operationsFeatures.map((f) => (
            <FeatureCard
              key={f.title}
              title={f.title}
              body={f.body}
              variant="operations"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
