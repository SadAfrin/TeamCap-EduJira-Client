import StaticPage from "@/components/common/StaticPage";

export default function ContactPage() {
  return (
    <StaticPage
      eyebrow="Contact"
      title="Talk with the EduJira team"
      description="Questions about onboarding, demos, or account support—reach out and we will help."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            General
          </h2>
          <a
            href="mailto:hello@edujira.com"
            className="mt-2 inline-block text-indigo-600 hover:text-indigo-500"
          >
            hello@edujira.com
          </a>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            Support
          </h2>
          <a
            href="mailto:support@edujira.com"
            className="mt-2 inline-block text-indigo-600 hover:text-indigo-500"
          >
            support@edujira.com
          </a>
        </div>
      </div>
      <p>
        Include your school name, role, and a short description of what you need.
        For account access issues, also mention the email used to sign in.
      </p>
    </StaticPage>
  );
}
