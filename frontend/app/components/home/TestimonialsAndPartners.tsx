"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { Typography } from "@/app/components/ui/Typography";

export default function TestimonialsAndPartners() {
  const testimonials = [
    {
      name: "Madan Raj Regmi",
      project: "Lympia College, Kathmandu",
      feedback:
        "Ratala Architecture transformed our dream into reality. Their attention to detail and creativity exceeded our expectations.",
      rating: 5,
      image: "/clients/client1.png",
    },
    {
      name: "Mahashnakar Joshi",
      project: "Mega Dream Office, Kathmandu",
      feedback:
        "Professional, visionary, and reliable! The design process was smooth, and the final outcome was truly stunning.",
      rating: 5,
      image: "/clients/client2.jpg",
    },
    {
      name: "Chandra Joshi",
      project: "Residential Villa, Kathmandu",
      feedback:
        "From the first sketch to the final build, their expertise was remarkable. The project was delivered beautifully on time.",
      rating: 4,
      image: "/clients/client3.jpg",
    },
  ];

  const partners = [
    { name: "Lympia College", logo: "/clients/lympia.png" },
    { name: "Asian Paints", logo: "/clients/asianpaint.png" },
    { name: "Mega Dream", logo: "/clients/MegaDream.jpg" },
    { name: "Chaitanya", logo: "/clients/Chaitanya.png" },
    { name: "GreenVillage", logo: "/clients/GreenVillage.jpeg" },
    { name: "Dautari", logo: "/clients/dautari.jpeg" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % testimonials.length),
      7000
    );
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="relative py-14 sm:py-16 bg-gradient-to-b from-white via-cyan-50/30 to-blue-50/20 overflow-hidden font-sans">
      {/* Subtle Glow Background */}
      <div className="absolute -top-20 -left-20 w-[250px] sm:w-[300px] h-[250px] sm:h-[300px] bg-cyan-200/40 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[250px] sm:w-[300px] h-[250px] sm:h-[300px] bg-blue-300/30 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:gap-10 gap-10">
          {/* --- Testimonials Column --- */}
          <div className="flex-1 flex flex-col justify-start">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <Typography.H2>
                What Our{" "}
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  Clients Say
                </span>
              </Typography.H2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <Typography.P>
                Hear directly from the people who trusted us to bring their
                vision to life — every project is a story of creativity and
                trust.
              </Typography.P>
            </motion.div>

            {/* Testimonial Carousel */}
            <div className="relative w-full max-w-3xl mx-auto md:mx-0 min-h-[400px] sm:min-h-[420px]">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-700 ${
                    idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <div className="backdrop-blur-xl bg-white/80 border border-white/40 shadow-lg rounded-3xl p-6 sm:p-8 md:p-10 text-center">
                    <img
                      src={t.image}
                      alt={t.name}
                      onError={(e) =>
                        (e.currentTarget.src = "/placeholder-profile.png")
                      }
                      className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full object-cover shadow-md border-4 border-cyan-400/50 mb-4"
                    />
                    <Typography.P className="italic mb-4">
                      “{t.feedback}”
                    </Typography.P>
                    <div className="flex justify-center gap-1 mb-2">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm sm:text-base" />
                      ))}
                    </div>
                    <Typography.H3 className="text-[1rem] sm:text-[1.1rem] font-medium text-gray-900">
                      {t.name}
                    </Typography.H3>
                    <Typography.Small>{t.project}</Typography.Small>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* --- Partners Column --- */}
          <div className="flex-1 flex flex-col justify-start">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <Typography.H2>
                Our{" "}
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  Trusted Partners
                </span>
              </Typography.H2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <Typography.P>
                We collaborate with visionary developers, brands, and
                organizations to craft spaces that inspire and elevate
                everyday living.
              </Typography.P>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 place-items-center"
            >
              {partners.map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center bg-gradient-to-br from-white via-cyan-50 to-blue-50 
                             rounded-2xl shadow-md p-4 sm:p-5 border border-white/30 
                             hover:shadow-lg hover:scale-[1.03] transition-all duration-500 w-[120px] sm:w-[150px]"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-12 sm:h-16 md:h-20 object-contain rounded-lg bg-transparent transition-all duration-500 hover:scale-105"
                    style={{
                      filter:
                        "drop-shadow(0 2px 4px rgba(0,0,0,0.08)) brightness(1.05)",
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
