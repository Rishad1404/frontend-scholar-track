// src/app/(commonLayout)/universities/page.tsx

import PublicUniversitiesList from "@/components/modules/PublicUniversity/PublicUniversitiesList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Universities | ScholarTrack",
  description:
    "Explore verified universities on ScholarTrack. Find institutions offering scholarships that match your goals.",
};

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative py-16 sm:py-24"
        style={{
          background: "linear-gradient(135deg, #4b287508, #0097b208)",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Our Partner{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #4b2875, #0097b2)",
              }}
            >
              Universities
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Discover verified universities offering scholarships through
            ScholarTrack. Each institution is thoroughly vetted to ensure
            quality education.
          </p>
        </div>
      </section>

      {/* List */}
      <section className="container mx-auto px-4 py-12">
        <PublicUniversitiesList />
      </section>
    </div>
  );
}