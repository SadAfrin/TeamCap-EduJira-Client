import Image from "next/image";
import Link from "next/link";

const coreValues = [
  {
    title: "Less Paperwork, More Teaching",
    description:
      "We believe teachers should spend their time inspiring students, not wrestling with redundant spreadsheets and manual data entry.",
    icon: (
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
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    ),
  },
  {
    title: "AI as an Assistant, Not a Replacement",
    description:
      "Our AI tools are designed to surface insights—like identifying students who might be falling behind—so educators can intervene with a human touch.",
    icon: (
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
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
      </svg>
    ),
  },
  {
    title: "Transparency for Parents",
    description:
      "Education is a partnership. We built portals that give parents real-time visibility into their child's progress, breaking down the walls between school and home.",
    icon: (
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
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-slate-900 px-6 py-24 sm:py-32 lg:px-8">
        {/* Dark Mode Background Glow */}
        <div
          className="absolute -top-24 -right-24 -z-10 transform-gpu blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-1404/767 w-351 bg-linear-to-r from-indigo-500 to-cyan-500 opacity-20"
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
          ></div>
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Our Mission
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Rethinking how schools operate in the{" "}
            <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              AI era.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
            EduJira started with a simple observation: modern education is
            weighed down by legacy software. We set out to build a platform that
            feels as smart and intuitive as the apps you use every day.
          </p>
        </div>
      </section>

      {/* The Story Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Built for the people who actually use it.
            </h2>
            <div className="mt-6 space-y-6 text-lg text-slate-600">
              <p>
                Too often, school management systems are purchased by
                administrators but suffered through by teachers, students, and
                parents. Navigation is clunky, features are buried, and data is
                siloed.
              </p>
              <p>
                We built EduJira differently. By creating role-specific views,
                we ensure that an administrator gets high-level analytics, a
                teacher gets streamlined grading, and a parent gets a simple,
                unified feed of their child&apos;s progress.
              </p>
              <p>
                Paired with an intelligent backend that flags at-risk trends
                before they become problems, EduJira isn&apos;t just a
                database—it&apos;s an active participant in your school&apos;s
                success.
              </p>
            </div>
          </div>

          {/* Abstract Graphic / Placeholder Image */}
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl lg:h-120 lg:max-w-none lg:aspect-auto">
            <div className="absolute inset-0 bg-linear-to-br from-indigo-50 to-cyan-50 opacity-50"></div>

            {/* Top Image: Modern Classroom / Collaboration */}
            <div className="absolute left-8 right-8 top-8 h-32 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
              <Image
                width={2070}
                height={1380}
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
                alt="Students collaborating in a modern classroom"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Bottom Left Image: Digital Education / Teacher */}
            <div className="absolute bottom-8 left-8 right-[calc(50%+0.5rem)] top-48 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
              <Image
                width={2070}
                height={1380}
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"
                alt="Teacher working on a laptop"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Bottom Right Image: Abstract Education / Analytics */}
            <div className="absolute bottom-32 left-[calc(50%+0.5rem)] right-8 top-48 overflow-hidden rounded-xl bg-indigo-50 shadow-sm ring-1 ring-indigo-900/5">
              <Image
                width={2070}
                height={1380}
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop"
                alt="Books and education materials"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Our Core Pillars
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              The principles that guide every feature we design and every line
              of code we write.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value) => (
              <div
                key={value.title}
                className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-md hover:ring-indigo-200"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ready to upgrade your school?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Join the forward-thinking institutions moving away from spreadsheets
            and stepping into the future of education.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get Started Today
            </Link>
            <Link
              href="/programs"
              className="text-sm font-semibold leading-6 text-slate-900 transition-colors hover:text-indigo-600"
            >
              Review the features <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
