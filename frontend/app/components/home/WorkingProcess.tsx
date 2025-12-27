"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FaPencilRuler, FaDraftingCompass, FaBuilding, FaSmile } from "react-icons/fa";
import { Typography } from "@/app/components/ui/Typography"; // ✅ global typography

export default function WorkingProcessPulse() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const steps = [
    {
      title: "Consultation & Concept",
      description:
        "We begin by understanding your lifestyle, vision, and project goals — the creative blueprint for your dream design.",
      icon: <FaPencilRuler className="text-3xl text-cyan-400" />,
    },
    {
      title: "Design & Visualization",
      description:
        "Our architects craft detailed concepts, 3D renders, and visual walkthroughs that transform imagination into precision.",
      icon: <FaDraftingCompass className="text-3xl text-cyan-400" />,
    },
    {
      title: "Execution & Management",
      description:
        "From materials to timelines, our team ensures flawless construction with transparency and technical expertise.",
      icon: <FaBuilding className="text-3xl text-cyan-400" />,
    },
    {
      title: "Completion & Handover",
      description:
        "We deliver with pride — on time, on quality, and beyond expectations — your vision, beautifully realized.",
      icon: <FaSmile className="text-3xl text-cyan-400" />,
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 bg-gradient-to-b from-white via-cyan-50/30 to-blue-50/20 overflow-hidden"
    >
      {/* Floating glows */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-10 -left-10 w-[350px] h-[350px] bg-cyan-300/30 blur-3xl rounded-full"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-300/30 blur-3xl rounded-full"
      />

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography.H2>
            Our{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Working Process
            </span>
          </Typography.H2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <Typography.P className="text-center">
            A fluid, transparent journey — from concept to completion —
            ensuring design excellence and timeless architecture.
          </Typography.P>
        </motion.div>

        {/* Steps */}
        <div className="relative flex flex-col md:flex-row md:justify-between md:gap-8 max-w-6xl mx-auto">

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ scale: 1.05 }}
              className="relative md:flex-1 mb-12 md:mb-0 flex flex-col items-center text-center group"
            >
              {/* Floating Icon */}
              <motion.div
                style={{
                  y: useTransform(scrollYProgress, [0, 1], [0, 40 * (i % 2 === 0 ? 1 : -1)]),
                }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg border border-cyan-400 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
              </motion.div>

              {/* Step Content using Typography system */}
              <Typography.H3 className="mb-3 text-gray-900 group-hover:text-cyan-600 transition-colors">
                {step.title}
              </Typography.H3>

              <Typography.P className="text-center max-w-xs mx-auto text-gray-600">
                {step.description}
              </Typography.P>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes pulseLine {
          0% {
            transform: translateX(-20%);
            opacity: 0.3;
          }
          50% {
            transform: translateX(100%);
            opacity: 1;
          }
          100% {
            transform: translateX(250%);
            opacity: 0.3;
          }
        }
        .animate-pulseLine {
          animation: pulseLine 6s linear infinite;
        }
      `}</style>
    </section>
  );
}
