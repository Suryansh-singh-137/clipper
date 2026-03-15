import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import PlatformsSection from "@/components/PlatformSection";
import TestimonialsSection from "@/components/TestimonialSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative">
      {/* Radial Gradient Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #f7f7ff 40%, #27187e 100%)",
        }}
      />
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <PlatformsSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </div>
  );
}
