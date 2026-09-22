import StaticPage from "@/components/common/StaticPage";

export default function CookiePolicyPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Cookie Policy"
      description="How EduJira uses cookies and similar technologies to keep sessions secure and improve the product."
    >
      <p>
        We use essential cookies to keep you signed in, remember role preferences, and
        protect account sessions. These are required for the application to function.
      </p>
      <p>
        Analytics cookies may be used to understand which pages are visited and where
        users encounter friction, so we can improve navigation and reliability.
      </p>
      <p>
        You can control cookies through your browser settings. Disabling essential
        cookies may prevent login or dashboard features from working correctly.
      </p>
    </StaticPage>
  );
}
