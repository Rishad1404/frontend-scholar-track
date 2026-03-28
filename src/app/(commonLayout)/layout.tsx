import Navbar from "@/components/modules/Public/Navbar";
import Footer from "@/components/modules/Public/Footer";
import ParticleBackground from "@/components/modules/Public/ParticleBackground";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-gray-50/50 dark:bg-gray-950">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Navbar */}
      <Navbar />

      {/* Content - pushed below navbar */}
      <main className="relative z-10 pt-24">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CommonLayout;