export default function IntegrationsSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-2">
          {/* Text Content */}
          <div className="mx-auto w-full max-w-xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Plays well with your existing toolkit.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              No need to rip and replace everything. EduJira seamlessly connects
              with the tools your educators and parents already rely on, acting
              as a central nervous system for your school.
            </p>
            <div className="mt-8 flex items-center gap-x-6">
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                View all integrations <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Integration Logos Grid */}
          <div className="mx-auto grid w-full max-w-xl grid-cols-2 items-center gap-6 sm:gap-8 lg:mx-0 lg:max-w-none">
            {/* Replace these placeholders with actual SVGs or Images of logos like Google, Microsoft, Zoom, etc. */}
            {["Google Workspace", "Zoom", "Microsoft Teams", "Stripe"].map(
              (tool) => (
                <div
                  key={tool}
                  className="flex h-24 items-center justify-center rounded-2xl bg-white px-8 shadow-sm ring-1 ring-slate-200 transition-all hover:ring-indigo-200 hover:shadow-md"
                >
                  <span className="font-semibold text-slate-400">{tool}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
