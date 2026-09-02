import Hero from "@/components/home/Hero";
import FeatureHighlights from "@/components/home/FeatureHighlights";
import Roles from "@/components/home/Roles";
import AboutSection from "@/components/home/AboutSection";
import MetricsSection from "@/components/home/MetricsSection";
import IntegrationsSection from "@/components/home/IntegrationsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureHighlights />
      <IntegrationsSection />
      <MetricsSection />
      <Roles />
      <TestimonialsSection />
      <AboutSection />
    </>
  );
}
