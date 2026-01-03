"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Home,
  Leaf,
  HardHat,
  Layers,
  Camera,
} from "lucide-react";
import { ServiceCard } from "@/app/components/ui/Card"; // Import the ServiceCard component
import { Button } from "@/app/components/ui/Button"; // Import the Button component

export default function ServicesSection() {
  const services = [
    {
      icon: Building2,
      title: "Architectural Design",
      description:
        "Innovative architectural planning that combines modern design with practical functionality for both residential and commercial spaces.",
      image: "/services/architecture.jpg",
      link: "/services/architectural-design",
    },
    {
      icon: Home,
      title: "Interior Design",
      description:
        "Creative and functional interior designs that bring elegance, comfort, and personality to your living or workspace.",
      image: "/services/interior.jpg",
      link: "/services/interior-design",
    },
    {
      icon: Leaf,
      title: "Sustainable Architecture",
      description:
        "Eco-friendly designs focusing on energy efficiency, natural light, and materials that respect the environment.",
      image: "/services/sustainable.jpg",
      link: "/services/sustainable-architecture",
    },
    {
      icon: HardHat,
      title: "Construction & Project Management",
      description:
        "End-to-end construction oversight ensuring your project is delivered on time, within budget, and with superior quality.",
      image: "/services/construction.jpg",
      link: "/services/construction-management",
    },
    {
      icon: Camera,
      title: "3D Visualization & Rendering",
      description:
        "Realistic 3D renders and walkthroughs that let you visualize your project before construction begins.",
      image: "/services/visualization.jpg",
      link: "/services/3d-visualization",
    },
    {
      icon: Layers,
      title: "Landscape & Urban Design",
      description:
        "Transforming outdoor environments into inspiring, sustainable, and functional spaces that blend with nature.",
      image: "/services/landscape.jpg",
      link: "/services/landscape-design",
    },
  ];

  return (
    <section className="relative pt-20 pb-8 md:pt-24 md:pb-10 bg-white overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[1.9rem] sm:text-[2.2rem] md:text-[2.6rem] font-semibold mb-6 text-gray-800 leading-snug tracking-tight"
        >
          Our <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Services</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-gray-700 max-w-2xl mx-auto mb-14 text-[0.95rem] sm:text-base md:text-lg leading-relaxed font-normal"
        >
          From modern architecture to elegant interiors, we offer complete
          design and build solutions tailored to your vision and lifestyle.
        </motion.p>

        {/* Services Grid - Now using ServiceCard component */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <ServiceCard
                key={index}
                image={service.image}
                title={service.title}
                description={service.description}
                href={service.link}
                size="md"
                className="relative rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500 border border-transparent"
              >
                {/* Custom Icon Section for Services */}
                <div className="flex items-center mb-3">
                  <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white mr-3 shadow-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">
                    {service.title}
                  </h3>
                </div>
              </ServiceCard>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14"
        >
          <Link href="/services">
            <Button
              size="lg"
              animated={true}
            >
              View All Services
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Subtle background glow */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-cyan-50/50 blur-[120px] rounded-full -translate-x-20 -translate-y-20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-50/50 blur-[120px] rounded-full translate-x-10 translate-y-10 pointer-events-none"></div>

      {/* ✨ Glow Animation */}
      <style jsx>{`
        @keyframes glowPulse {
          0% {
            opacity: 0.5;
            filter: drop-shadow(0 0 6px rgba(13, 202, 240, 0.2));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 12px rgba(13, 202, 240, 0.4));
          }
          100% {
            opacity: 0.5;
            filter: drop-shadow(0 0 6px rgba(13, 202, 240, 0.2));
          }
        }
        .animate-glowPulse {
          animation: glowPulse 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}