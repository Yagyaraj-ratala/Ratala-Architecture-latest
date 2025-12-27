"use client";

import { motion } from "framer-motion";
import {
  Layers,
  House,
  Sofa,
  Building2,
  Ruler,
  Mountain,
} from "lucide-react";

const services = [
  {
    title: "Architectural Design",
    description:
      "Modern, functional, and sustainable architectural concepts designed with precision and creativity.",
    icon: House,
  },
  {
    title: "Interior Design",
    description:
      "Luxury interior solutions crafted to elevate aesthetics, comfort, and functionality.",
    icon: Sofa,
  },
  {
    title: "3D Visualization & Rendering",
    description:
      "High-quality 3D visuals, walkthroughs, and realistic renders for better decision-making.",
    icon: Layers,
  },
  {
    title: "Construction & Project Handling",
    description:
      "End-to-end construction supervision ensuring quality, timelines, and structural safety.",
    icon: Building2,
  },
  {
    title: "Renovation & Remodeling",
    description:
      "Transform old spaces into modern, efficient, and beautiful environments.",
    icon: Ruler,
  },
  {
    title: "Landscape & Exterior Design",
    description:
      "Outdoor space planning including gardens, terraces, and eco-friendly landscape concepts.",
    icon: Mountain,
  },
];

export default function ServicesSection() {
  return (
    <div className="pt-24 pb-20 px-6 bg-gray-50">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
        Our{" "}
        <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
          Services
        </span>
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg mb-6">
              <service.icon size={32} />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
