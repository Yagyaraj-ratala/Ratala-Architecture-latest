"use client";

import { motion } from "framer-motion";
import {
  FaLaptopCode,
  FaThumbsUp,
  FaRupeeSign,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { Typography } from "@/app/components/ui/Typography"; // Adjust import path

export default function WhyChooseUs() {
  const features = [
    {
      icon: <FaLaptopCode />,
      title: "Best Design",
      description: "Innovative and timeless architectural designs.",
    },
    {
      icon: <FaThumbsUp />,
      title: "100% Vastu Compliance",
      description: "Every project is designed keeping Vastu principles in mind.",
    },
    {
      icon: <FaRupeeSign />,
      title: "Affordable Price",
      description:
        "Quality architecture that fits your budget without compromise.",
    },
    {
      icon: <FaRegCalendarCheck />,
      title: "Accurate Timeline",
      description:
        "We deliver every project on time — with transparency and commitment.",
    },
  ];

  return (
    <section className="relative pt-6 pb-10 md:pt-10 md:pb-12 bg-gray-50 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-cyan-50/60 blur-[120px] rounded-full -translate-x-20 -translate-y-10"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-50/60 blur-[120px] rounded-full translate-x-10 translate-y-10"></div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Typography.H2 className="text-gray-800">
            Why <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Choose Us?</span>
          </Typography.H2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{
                y: -10,
                boxShadow: "0 10px 25px rgba(13, 202, 240, 0.25)",
              }}
              className="relative bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 group"
            >
              {/* Icon */}
              <div className="flex items-center justify-center mb-5">
                <motion.div
                  className="text-5xl text-cyan-500 group-hover:text-cyan-600 transition-colors duration-500"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  {feature.icon}
                </motion.div>
              </div>

              {/* Title */}
              <Typography.H3 className="text-gray-800 mb-3">
                {feature.title}
              </Typography.H3>

              {/* Description */}
              <Typography.P className="text-gray-700 leading-relaxed">
                {feature.description}
              </Typography.P>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 to-cyan-600/0 group-hover:from-cyan-500/10 group-hover:to-cyan-600/10 transition-all duration-700"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}