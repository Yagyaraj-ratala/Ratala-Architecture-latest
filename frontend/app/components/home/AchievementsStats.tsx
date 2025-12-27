"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaUsers, FaTrophy, FaSmile, FaTools } from "react-icons/fa";
import { Typography } from "@/app/components/ui/Typography";

export default function AchievementsOverlay() {
  const stats = [
    {
      icon: <FaTools className="text-xl sm:text-2xl mb-1 text-white" />,
      title: "Years Of Experience",
      value: 15,
      suffix: "+",
    },
    {
      icon: <FaTrophy className="text-xl sm:text-2xl mb-1 text-white" />,
      title: "Successful Projects",
      value: 400,
      suffix: "+",
    },
    {
      icon: <FaUsers className="text-xl sm:text-2xl mb-1 text-white" />,
      title: "Team Members",
      value: 20,
      suffix: "+",
    },
    {
      icon: <FaSmile className="text-xl sm:text-2xl mb-1 text-white" />,
      title: "Client Satisfactions",
      value: 100,
      suffix: "%",
    },
  ];

  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const intervals = stats.map((stat, i) => {
      const duration = 1200;
      const stepTime = 25;
      const steps = duration / stepTime;
      const increment = stat.value / steps;
      let count = 0;

      return setInterval(() => {
        count += increment;
        if (count >= stat.value) {
          count = stat.value;
          clearInterval(intervals[i]);
        }
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[i] = Math.floor(count);
          return newCounts;
        });
      }, stepTime);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <section
      className="relative py-10 md:py-14 bg-fixed bg-cover bg-center text-white overflow-hidden"
      style={{
        backgroundImage: "url('/projects/interior3.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1.5px]" />

      {/* Soft glow */}
      <div className="absolute top-0 left-0 w-[180px] h-[180px] bg-cyan-400/10 rounded-full blur-2xl -translate-x-10 -translate-y-10 animate-float" />
      <div className="absolute bottom-0 right-0 w-[220px] h-[220px] bg-blue-500/10 rounded-full blur-2xl translate-x-6 translate-y-6 animate-float" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-6">
          <Typography.H2 className="text-white text-[1.4rem] sm:text-[1.7rem] md:text-[1.9rem] mb-1 font-semibold">
            Our{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Achievements
            </span>
          </Typography.H2>

          <Typography.P className="text-white max-w-2xl mx-auto text-[0.8rem] sm:text-[0.9rem] leading-snug">
            Our success is measured not just in numbers but in trust, innovation, and the dreams we’ve turned into reality.
          </Typography.P>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center text-center group"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="mb-1 text-white/90 group-hover:text-cyan-300 transition-all"
              >
                {stat.icon}
              </motion.div>

              {/* Title */}
              <Typography.H3 className="text-white/90 mb-[2px] text-[0.8rem] sm:text-[0.9rem] font-medium leading-tight tracking-wide">
                {stat.title}
              </Typography.H3>

              {/* Counter */}
              <Typography.Display className="text-white text-2xl sm:text-3xl font-bold drop-shadow-lg group-hover:text-cyan-400 transition-colors leading-snug">
                {counts[index]}
                {stat.suffix}
              </Typography.Display>

              <div className="mt-1 w-5 border-b-[1px] border-white/30 group-hover:border-cyan-400 transition-all" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Float animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
