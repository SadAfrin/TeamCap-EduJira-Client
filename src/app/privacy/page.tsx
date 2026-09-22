import StaticPage from "@/components/common/StaticPage";

export default function PrivacyPolicyPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="How EduJira collects, uses, and protects information across school accounts."
    >
      <p>
        EduJira processes account details, role information, and academic data needed
        to operate school workflows such as attendance, grades, notices, and messaging.
      </p>
      <p>
        We use this information to authenticate users, deliver role-based dashboards,
        improve product reliability, and communicate service updates. Access is limited
        by role and school membership.
      </p>
      <p>
        We do not sell personal student or parent data. School administrators control
        who is invited into their organization and which records are maintained.
      </p>
      <p>
        For privacy requests or questions, contact{" "}
        <a
          href="mailto:privacy@edujira.com"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          privacy@edujira.com
        </a>
        .
      </p>
    </StaticPage>
  );
}
