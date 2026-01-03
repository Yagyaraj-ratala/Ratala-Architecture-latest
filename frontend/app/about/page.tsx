"use client";

import { motion } from "framer-motion";
import { Typography } from "@/app/components/ui/Typography";
import { Building2, Target, Eye, Award, Users, Clock } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Building2 className="w-8 h-8 text-cyan-500" />,
      title: "15+ Years Experience",
      description: "Extensive expertise in architectural design and construction",
    },
    {
      icon: <Award className="w-8 h-8 text-cyan-500" />,
      title: "100% Satisfaction",
      description: "Every project delivered with excellence and precision",
    },
    {
      icon: <Users className="w-8 h-8 text-cyan-500" />,
      title: "Expert Team",
      description: "Skilled professionals dedicated to your vision",
    },
    {
      icon: <Clock className="w-8 h-8 text-cyan-500" />,
      title: "On-Time Delivery",
      description: "Reliable timelines with transparent communication",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 bg-white overflow-hidden">
        {/* Subtle background glows */}
        <div className="absolute top-0 left-[-100px] w-[400px] h-[400px] bg-cyan-50/40 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-[-80px] w-[450px] h-[450px] bg-blue-50/40 blur-3xl rounded-full"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography.H1 className="mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Ratala Architecture
              </span>
            </Typography.H1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <Typography.P className="text-gray-700 text-lg md:text-xl">
              We're a creative architecture agency based in Nepal, blending design
              innovation with technology to shape inspiring, sustainable spaces.
              With over 15 years of expertise, we deliver high-quality projects that
              perfectly balance aesthetics, efficiency, and comfort.
            </Typography.P>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="relative py-16 md:py-20 bg-gray-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-cyan-50/60 blur-[120px] rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-50/60 blur-[120px] rounded-full translate-x-10 translate-y-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-6xl mx-auto">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-cyan-50 rounded-xl">
                  <Target className="w-8 h-8 text-cyan-500" />
                </div>
                <Typography.H2 className="text-gray-800">Our Mission</Typography.H2>
              </div>
              <Typography.P className="text-gray-700">
                To transform the architectural landscape of Nepal with sustainable,
                innovative, and budget-friendly design solutions that enhance
                lifestyle and long-term value.
              </Typography.P>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-cyan-50 rounded-xl">
                  <Eye className="w-8 h-8 text-cyan-500" />
                </div>
                <Typography.H2 className="text-gray-800">Our Vision</Typography.H2>
              </div>
              <Typography.P className="text-gray-700">
                To be the most trusted and technologically advanced architecture studio
                in Nepal, delivering world-class projects accessible to everyone.
              </Typography.P>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-16 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Typography.H2 className="text-gray-800">
              Why{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Choose Us?
              </span>
            </Typography.H2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(13, 202, 240, 0.25)" }}
                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 group"
              >
                <div className="flex items-center justify-center mb-5">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {value.icon}
                  </motion.div>
                </div>
                <Typography.H3 className="text-gray-800 mb-3">
                  {value.title}
                </Typography.H3>
                <Typography.P className="text-gray-600 leading-relaxed">
                  {value.description}
                </Typography.P>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
