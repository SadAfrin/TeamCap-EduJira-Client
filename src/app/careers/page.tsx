import StaticPage from "@/components/common/StaticPage";

export default function CareersPage() {
  return (
    <StaticPage
      eyebrow="Careers"
      title="Build the future of school operations"
      description="Join EduJira and help educators spend less time on paperwork and more time teaching."
    >
      <p>
        We are a product-focused team building role-based dashboards, AI-assisted
        insights, and communication tools for schools. If you care about clear UX,
        reliable systems, and education impact, we want to hear from you.
      </p>
      <p>
        Open roles are posted as they become available. Send your resume and a short
        note about the kind of work you want to do to{" "}
        <a
          href="mailto:careers@edujira.com"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          careers@edujira.com
        </a>
        .
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Full-stack / frontend engineers</li>
        <li>Product designers focused on education workflows</li>
        <li>Customer success specialists for school rollouts</li>
      </ul>
    </StaticPage>
  );
}
