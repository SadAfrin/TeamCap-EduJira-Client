export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative isolate overflow-hidden bg-slate-900 py-24 sm:py-32"
    >
      {/* Subtle Background Glow */}
      <div
        className="absolute -top-24 -right-24 -z-10 transform-gpu blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-1404/767 w-351 bg-linear-to-r from-indigo-500 to-cyan-500 opacity-15"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        ></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Made for the{" "}
            <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              education sector
            </span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            EduJira is built for schools looking to move off paper registers and
            scattered spreadsheets, reducing manual work for admins and teachers
            while giving parents real visibility into their child&apos;s
            progress.
          </p>
        </div>
      </div>
    </section>
  );
}
