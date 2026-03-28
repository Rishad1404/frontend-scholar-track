import { AboutHeroSection } from "@/components/modules/AboutUs/sections/AboutHeroSection";
import { MissionVisionSection } from "@/components/modules/AboutUs/sections/MissionVisionSection";
import { OurStorySection } from "@/components/modules/AboutUs/sections/OurStorySection";
import { CoreValuesSection } from "@/components/modules/AboutUs/sections/CoreValuesSection";
import { AboutCTASection } from "@/components/modules/AboutUs/sections/AboutCTASection";
import CreatorSection from "@/components/modules/AboutUs/sections/CreatorSection";

export default function AboutUsPage() {
  return (
    <>
      <AboutHeroSection />
      <MissionVisionSection />
      <OurStorySection />
      <CoreValuesSection />
      <CreatorSection />
      <AboutCTASection />
    </>
  );
}
