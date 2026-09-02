const integrations = [
  {
    name: "Google Workspace",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    name: "Zoom",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
        <path d="M4 3.5A1.5 1.5 0 015.5 2h4A1.5 1.5 0 0111 3.5v17a1.5 1.5 0 01-1.5 1.5h-4A1.5 1.5 0 014 20.5v-17z" fill="#2D8CFF"/>
        <path d="M12.5 7.5l5-3.5v16l-5-3.5v-9z" fill="#2D8CFF"/>
        <circle cx="8" cy="12" r="2" fill="white"/>
      </svg>
    ),
  },
  {
    name: "Microsoft Teams",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
        <path d="M19 6.5c0-1.38-1.12-2.5-2.5-2.5H14v3h2.5c.28 0 .5.22.5.5v5c0 .28-.22.5-.5.5H14v3h2.5c1.38 0 2.5-1.12 2.5-2.5v-7z" fill="#5059C9"/>
        <path d="M10 4H5.5C4.12 4 3 5.12 3 6.5v5c0 1.38 1.12 2.5 2.5 2.5H10V4z" fill="#5059C9"/>
        <path d="M10 9H5.5c-.28 0-.5.22-.5.5v5c0 .28.22.5.5.5H10V9z" fill="#7B83EB"/>
        <circle cx="16" cy="5.5" r="2.5" fill="#5059C9"/>
        <path d="M13.5 11H19c.28 0 .5.22.5.5v2c0 1.38-1.12 2.5-2.5 2.5h-3.5v-5z" fill="#7B83EB"/>
      </svg>
    ),
  },
  {
    name: "Stripe",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
        <path d="M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.612.511-1.002 1.243-1.002 1.243 0 2.512.38 3.71 1.139V6.065c-1.243-.467-2.485-.662-3.71-.662-3.016 0-4.973 1.581-4.973 4.241 0 3.512 3.17 4.283 5.548 5.147 1.625.604 2.507 1.067 2.507 1.798 0 .662-.586 1.086-1.448 1.086-1.495 0-3.055-.604-4.419-1.767v3.949c1.475.635 2.949.898 4.419.898 3.119 0 5.144-1.551 5.144-4.242 0-3.65-3.216-4.386-5.518-5.226z" fill="#635BFF"/>
      </svg>
    ),
  },
  {
    name: "Notion",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.2 2.16c-.42-.326-.98-.7-2.055-.607l-12.8.934c-.466.047-.56.28-.374.466l1.833 1.88zM19.945 5.803l-11.72.747c-.467.046-.56.326-.187.56l2.734 2.594c.373.28.84.14.933-.28l.28-1.247c.047-.233.233-.42.56-.373l3.943.56c.326.046.606-.186.513-.513l-.56-2.147c-.047-.373-.326-.56-.653-.466l-.84.466z" fill="black"/>
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.2 2.16c-.42-.326-.98-.7-2.055-.607l-12.8.934c-.466.047-.56.28-.374.466l1.833 1.88z" fill="black"/>
        <path d="M19.945 5.803l-11.72.747c-.467.046-.56.326-.187.56l2.734 2.594c.373.28.84.14.933-.28l.28-1.247c.047-.233.233-.42.56-.373l3.943.56c.326.046.606-.186.513-.513l-.56-2.147c-.047-.373-.326-.56-.653-.466l-.84.466z" fill="black"/>
      </svg>
    ),
  },
  {
    name: "Slack",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
        <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313z" fill="#E01E5A"/>
        <path d="M8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312z" fill="#36C5F0"/>
        <path d="M18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312z" fill="#2EB67D"/>
        <path d="M15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z" fill="#ECB22E"/>
      </svg>
    ),
  },
];

export default function IntegrationsSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
      {/* Bg decorations */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-2">
          {/* Text */}
          <div className="mx-auto w-full max-w-xl lg:mx-0">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600">Integrations</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Plays well with your existing toolkit.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              No need to rip and replace everything. EduJira seamlessly connects
              with the tools your educators and parents already rely on, acting
              as a central nervous system for your school.
            </p>
            <div className="mt-8 flex items-center gap-x-6">
              <a
                href="#"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                View all integrations
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Logos Grid */}
          <div className="mx-auto grid w-full max-w-xl grid-cols-3 items-center gap-5 sm:gap-6 lg:mx-0 lg:max-w-none">
            {integrations.map((tool) => (
              <div
                key={tool.name}
                className="group flex h-28 flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:ring-indigo-200 hover:shadow-lg hover:shadow-indigo-900/5"
              >
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {tool.icon}
                </div>
                <span className="text-xs font-semibold text-slate-500 transition-colors group-hover:text-slate-700">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
