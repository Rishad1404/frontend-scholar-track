import { CTASection } from "@/components/modules/Homepage/CTASection";
import { FeaturesSection } from "@/components/modules/Homepage/FeaturesSection";
import { HeroSection } from "@/components/modules/Homepage/HeroSection";
import { HowItWorksSection } from "@/components/modules/Homepage/HowItWorksSection";
import { PlatformHighlightsSection } from "@/components/modules/Homepage/PlatformHighlightsSection";
import PricingSection from "@/components/modules/Homepage/PriceSections";
import { RolesOverviewSection } from "@/components/modules/Homepage/RolesOverviewSection";
import { TestimonialsSection } from "@/components/modules/Homepage/TestimonialsSection";


export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PlatformHighlightsSection />
      <PricingSection />
      <RolesOverviewSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}