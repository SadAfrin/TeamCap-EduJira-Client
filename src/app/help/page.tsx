import Link from "next/link";
import StaticPage from "@/components/common/StaticPage";

const topics = [
  {
    title: "Getting started",
    body: "Create an account, choose your role, and complete any pending review steps before accessing your dashboard.",
  },
  {
    title: "Dashboards by role",
    body: "Admins manage users and academics, teachers handle classes and grades, while parents and students view progress and notices.",
  },
  {
    title: "Password and access",
    body: "Use Forgot Password on the login page if you cannot sign in. Contact support if your account is still under review.",
  },
];

export default function HelpCenterPage() {
  return (
    <StaticPage
      eyebrow="Help Center"
      title="Find answers quickly"
      description="Common questions about signing in, roles, and using EduJira day to day."
    >
      <div className="space-y-6">
        {topics.map((topic) => (
          <div key={topic.title}>
            <h2 className="text-lg font-semibold text-slate-900">{topic.title}</h2>
            <p className="mt-2">{topic.body}</p>
          </div>
        ))}
      </div>
      <p>
        Still stuck? Visit{" "}
        <Link href="/contact" className="font-medium text-indigo-600 hover:text-indigo-500">
          Contact
        </Link>{" "}
        or email{" "}
        <a
          href="mailto:support@edujira.com"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          support@edujira.com
        </a>
        .
      </p>
    </StaticPage>
  );
}
