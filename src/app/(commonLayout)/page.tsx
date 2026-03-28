import { CTASection } from "@/components/modules/Homepage/CTASection";
import { FeaturesSection } from "@/components/modules/Homepage/FeaturesSection";
import { HeroSection } from "@/components/modules/Homepage/HeroSection";
import { HowItWorksSection } from "@/components/modules/Homepage/HowItWorksSection";
import { StatsSection } from "@/components/modules/Homepage/StatsSection";
import { TestimonialsSection } from "@/components/modules/Homepage/TestimonialsSection";
import { TrustedBySection } from "@/components/modules/Homepage/TrustedBySection";


export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <TrustedBySection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}