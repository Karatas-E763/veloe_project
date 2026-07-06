"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FooterCTASection from "@/components/FooterCTASection";
import { HomeTabProvider } from "@/context/HomeTabContext";

export default function Home() {
  return (
    <HomeTabProvider>
      <main className="min-h-screen bg-white">
        <Header />
        <HeroSection />
        <BenefitsSection />
        <HowItWorksSection />
        <FooterCTASection />
      </main>
    </HomeTabProvider>
  );
}
