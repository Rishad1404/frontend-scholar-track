import { HowItWorksCTASection } from "@/components/modules/HowItWorks/HowItWorksCTASection";
import { HowItWorksHeroSection } from "@/components/modules/HowItWorks/HowItWorksHeroSection";
import { OverviewSection } from "@/components/modules/HowItWorks/OverviewSection";
import { ReviewProcessSection } from "@/components/modules/HowItWorks/ReviewProcessSection";
import { StudentProcessSection } from "@/components/modules/HowItWorks/StudentProcessSection";
import { UniversityProcessSection } from "@/components/modules/HowItWorks/UniversityProcessSection";


export default function HowItWorksPage() {
  return (
    <>
      <HowItWorksHeroSection />
      <OverviewSection />
      <StudentProcessSection />
      <UniversityProcessSection />
      <ReviewProcessSection />
      <HowItWorksCTASection />
    </>
  );
}