import { ContactFormSection } from "@/components/modules/ContactUs/ContactFormSection";
import { ContactHeroSection } from "@/components/modules/ContactUs/ContactHeroSection";
import { ContactInfoSection } from "@/components/modules/ContactUs/ContactInfoSection";
import { FAQSection } from "@/components/modules/ContactUs/FAQSection";

export default function ContactUsPage() {
  return (
    <>
      <ContactHeroSection />
      <ContactFormSection />
      <ContactInfoSection />
      <FAQSection />
    </>
  );
}