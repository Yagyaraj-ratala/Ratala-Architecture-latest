"use client";

import {
  HeroSection,
  AboutPreview,
  ServicesSection,
  WhyChooseUs,
  AchievementsStats,
  ProjectsShowcase,
  WorkingProcess,
  TestimonialsAndPartners,
} from "./components/home";



export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutPreview />
      <ServicesSection />
      <WhyChooseUs />
      <AchievementsStats />
      <ProjectsShowcase />
      <WorkingProcess />
      <TestimonialsAndPartners />

    </>
  );
}