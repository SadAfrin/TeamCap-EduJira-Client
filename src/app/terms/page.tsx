import StaticPage from "@/components/common/StaticPage";

export default function TermsOfServicePage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Terms of Service"
      description="The rules that govern use of the EduJira platform by schools and individual users."
    >
      <p>
        By creating an account or accessing EduJira, you agree to use the platform only
        for legitimate school operations and in accordance with your institution&apos;s
        policies.
      </p>
      <p>
        Users are responsible for safeguarding their credentials, submitting accurate
        information, and respecting the privacy of students, parents, and staff whose
        data appears in the system.
      </p>
      <p>
        EduJira may update features, suspend abusive accounts, or revise these terms as
        the product evolves. Continued use after an update means you accept the revised
        terms.
      </p>
      <p>
        Questions about these terms can be sent to{" "}
        <a
          href="mailto:legal@edujira.com"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          legal@edujira.com
        </a>
        .
      </p>
    </StaticPage>
  );
}
