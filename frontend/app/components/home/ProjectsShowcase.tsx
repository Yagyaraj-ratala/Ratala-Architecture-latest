"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Typography } from "@/app/components/ui/Typography";
import { ProjectCard } from "@/app/components/ui/Card"; // Make sure this path is correct

export default function ProjectsShowcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const projects = [
    {
      image: "/projects/ImageR1.jpg",
      title: "Luxury Villa",
      location: "Kathmandu, Nepal",
      category: "Residential",
      href: "/projects/luxury-villa",
    },
    {
      image: "/projects/interior1.jpg",
      title: "Modern Corporate Office",
      location: "Lalitpur, Nepal",
      category: "Commercial",
      href: "/projects/modern-office",
    },
    {
      image: "/projects/interior3.jpg",
      title: "Himalayan Resort Design",
      location: "Pokhara, Nepal",
      category: "Hospitality",
      href: "/projects/resort-design",
    },
    {
      image: "/projects/ImageR3.jpg",
      title: "Elegant Home Renovation",
      location: "Bhaktapur, Nepal",
      category: "Renovation",
      href: "/projects/home-renovation",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 bg-gradient-to-b from-white via-cyan-50/20 to-blue-50/10 overflow-hidden"
    >
      {/* Ambient Glows */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-200/25 blur-[120px] rounded-full animate-float-slow"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-200/25 blur-[150px] rounded-full animate-float-slow"
      />

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography.H2 className="mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Recent Projects
            </span>
          </Typography.H2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto mb-14"
        >
          <Typography.P className="text-center">
            Discover our latest architectural and interior creations — each one
            crafted with precision, sustainability, and a vision for modern living.
          </Typography.P>
        </motion.div>

        {/* Projects Grid - Using ProjectCard component */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              image={project.image}
              title={project.title}
              location={project.location}
              category={project.category}
              href={project.href}
              size="md"
            />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14"
        >
          <Link
            href="/projects"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:scale-105 transition-all duration-300"
          >
            View All Projects
          </Link>
        </motion.div>
      </div>

      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}