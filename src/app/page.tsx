import { AmbientBackground } from "@/components/landing/ambient-background";
import { Navbar, NavbarBackground } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { StatsBand } from "@/components/landing/stats-band";
import { LogoMarquee } from "@/components/landing/logo-marquee";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { DemoSection, CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AmbientBackground />
      <NavbarBackground />
      <Navbar />
      <main>
        <Hero />
        <StatsBand />
        <LogoMarquee />
        <Features />
        <HowItWorks />
        <DemoSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
