"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Typography } from "@/app/components/ui/Typography";
import { Button } from "@/app/components/ui/Button";
import { Lightbulb, Building2, Award, FileText, CheckCircle2 } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-white overflow-hidden">
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
              Transforming Spaces with{" "}
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
              In the heart of Nepal, <strong>Ratala Architecture & Interiors</strong> 
              is redefining modern living by combining creativity, functionality, and sustainability. 
              With over 15 years of experience, our studio delivers premium architectural solutions 
              that are both aesthetically inspiring and practical.
            </Typography.P>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="relative py-16 md:py-20 bg-gray-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-cyan-50/60 blur-[120px] rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-50/60 blur-[120px] rounded-full translate-x-10 translate-y-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-cyan-50 rounded-xl">
                  <Lightbulb className="w-8 h-8 text-cyan-500" />
                </div>
                <Typography.H2 className="text-gray-800">The Philosophy of Ratala Architecture</Typography.H2>
              </div>
              <Typography.P className="text-gray-700 mb-6">
                At Ratala Architecture, we believe that architecture is not just about buildings—it's about 
                <strong> creating spaces that enhance lifestyles</strong>. Every design is carefully planned 
                to balance functionality, comfort, and beauty.
              </Typography.P>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <Typography.P className="text-gray-700">
                    <strong>Client-Centric Approach:</strong> Understanding your vision and turning it into reality.
                  </Typography.P>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <Typography.P className="text-gray-700">
                    <strong>Sustainable Design:</strong> Eco-friendly materials and energy-efficient solutions.
                  </Typography.P>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <Typography.P className="text-gray-700">
                    <strong>Innovative Technology:</strong> Using AI-driven simulations, 3D modeling, and cost estimation for precise results.
                  </Typography.P>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
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
              Our{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Services
              </span>
            </Typography.H2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-200">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <Typography.P className="text-gray-700">
                    <strong>Residential Design:</strong> Modern apartments, luxury villas, and townhouses tailored to your lifestyle.
                  </Typography.P>
                </li>
                <li className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <Typography.P className="text-gray-700">
                    <strong>Commercial Spaces:</strong> Offices, retail stores, and co-working spaces that inspire productivity.
                  </Typography.P>
                </li>
                <li className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <Typography.P className="text-gray-700">
                    <strong>Interior Design:</strong> Personalized interiors that reflect your taste and optimize space.
                  </Typography.P>
                </li>
                <li className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <Typography.P className="text-gray-700">
                    <strong>3D Visualization & Cost Estimation:</strong> See your project before it's built with realistic renderings and accurate budgeting.
                  </Typography.P>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-16 md:py-20 bg-gray-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-cyan-50/60 blur-[120px] rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-50/60 blur-[120px] rounded-full translate-x-10 translate-y-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Typography.H2 className="text-gray-800">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Ratala Architecture
              </span>
            </Typography.H2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-200">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <Typography.P className="text-gray-700">
                    Expertise across diverse architectural styles and modern design trends.
                  </Typography.P>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <Typography.P className="text-gray-700">
                    Transparent cost estimation with AI-powered tools.
                  </Typography.P>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <Typography.P className="text-gray-700">
                    Timely project delivery without compromising quality.
                  </Typography.P>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <Typography.P className="text-gray-700">
                    Focus on sustainable and eco-friendly construction.
                  </Typography.P>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
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
              Case{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Studies
              </span>
            </Typography.H2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-200">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <Typography.P className="text-gray-700">
                    <strong>Modern Villa in Pepsicola:</strong> Combining luxury with minimalism, designed with energy-efficient materials.
                  </Typography.P>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <Typography.P className="text-gray-700">
                    <strong>Commercial Office in Kathmandu:</strong> Open-plan design for enhanced collaboration and productivity.
                  </Typography.P>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="relative py-16 md:py-20 bg-gray-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-cyan-50/60 blur-[120px] rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-50/60 blur-[120px] rounded-full translate-x-10 translate-y-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-200 text-center">
              <Typography.H2 className="text-gray-800 mb-6">Conclusion</Typography.H2>
              <Typography.P className="text-gray-700 mb-8 text-lg">
                Ratala Architecture is more than a design studio—it's a <strong>partner in building your dream spaces</strong>. 
                From concept to execution, we ensure that every detail reflects your vision. Whether you are planning a home, office, 
                or commercial project, our expert team is ready to deliver innovative, functional, and beautiful designs.
              </Typography.P>
              
              {/* Call to Action */}
              <Link href="/contact">
                <Button size="lg" animated={true}>
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
