"use client";

import { motion } from "framer-motion";

export default function OurPartners() {
  const partners = [
    { name: "Lympia College", logo: "/logos/lympia.png" },
    { name: "Ncell Projects", logo: "/logos/ncell.png" },
    { name: "City Homes Nepal", logo: "/logos/cityhomes.png" },
    { name: "Sagarmatha Builders", logo: "/logos/sagarmatha.png" },
    { name: "Nepal Bank", logo: "/logos/nepalbank.png" },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-cyan-50/30 to-blue-50/20 overflow-hidden">
      {/* Subtle background glow */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute top-[-100px] left-[-120px] w-[400px] h-[400px] bg-cyan-300/20 blur-3xl rounded-full"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute bottom-[-120px] right-[-80px] w-[450px] h-[450px] bg-blue-300/20 blur-3xl rounded-full"
      />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
        >
          Our <span className="text-[#0dcaf0]">Trusted Partners</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-gray-600 max-w-2xl mx-auto mb-12 text-base md:text-lg"
        >
          We collaborate with leading developers, institutions, and organizations to deliver 
          exceptional architectural and interior design experiences.
        </motion.p>

        {/* Logos Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-center"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-center"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-12 sm:h-16 md:h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
