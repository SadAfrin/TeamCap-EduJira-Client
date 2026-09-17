import StaticPage from "@/components/common/StaticPage";

const systems = [
  { name: "Web application", status: "Operational" },
  { name: "Authentication", status: "Operational" },
  { name: "Dashboards & APIs", status: "Operational" },
  { name: "Notifications", status: "Operational" },
];

export default function StatusPage() {
  return (
    <StaticPage
      eyebrow="Status"
      title="System status"
      description="Current availability of core EduJira services."
    >
      <ul className="space-y-3">
        {systems.map((system) => (
          <li
            key={system.name}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <span className="font-medium text-slate-900">{system.name}</span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              {system.status}
            </span>
          </li>
        ))}
      </ul>
      <p>
        If you are experiencing an issue that is not reflected here, please contact
        support with the time of the problem and the page you were using.
      </p>
    </StaticPage>
  );
}
