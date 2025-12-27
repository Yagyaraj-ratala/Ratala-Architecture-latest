"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Reusable Button Component (same as header and hero)
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  animated = false,
}) => {
  const baseClasses = `
    rounded-lg font-semibold transition-all duration-300 transform 
    border relative overflow-hidden whitespace-nowrap
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-cyan-500 to-blue-600 
      text-white border-white/20 
      hover:scale-105 hover:shadow-lg
    `,
    secondary: `
      bg-gradient-to-r from-gray-700 to-gray-900 
      text-white border-white/20 
      hover:scale-105 hover:shadow-lg
    `,
    outline: `
      bg-transparent border-2 border-cyan-500 
      text-cyan-500 hover:bg-cyan-500 hover:text-white
      hover:scale-105
    `,
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const animationClass = animated ? "float-3d" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${animationClass}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white/10 hover:bg-white/5 transition-colors" />
    </button>
  );
};

export default function AboutPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();
  const [years, setYears] = useState(0);

  // Animate count-up when section enters viewport
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = 15; // Target value
      const duration = 1500; // 1.5 seconds
      const incrementTime = 20; // ms per increment
      const step = (end - start) / (duration / incrementTime);

      const counter = setInterval(() => {
        start += step;
        if (start >= end) {
          start = end;
          clearInterval(counter);
        }
        setYears(Math.floor(start));
      }, incrementTime);
    }
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="relative pt-20 pb-10 md:pt-32 md:pb-14 bg-gradient-to-b from-white via-cyan-50/30 to-blue-50/20 overflow-hidden"
    >
      {/* 🌈 Subtle floating background glows for depth */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute top-0 left-[-100px] w-[400px] h-[400px] bg-cyan-300/20 blur-3xl rounded-full"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute bottom-[-100px] right-[-80px] w-[450px] h-[450px] bg-blue-300/20 blur-3xl rounded-full"
      />

      <div className="container mx-auto px-5 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[70vh] md:min-h-[85vh] relative z-10">
        
        {/* ✅ Left - Overlapping Images */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center items-center h-full"
        >
          <div className="relative w-full max-w-md mx-auto">
            {/* 🟦 Cyan Frame */}
            <div
              className="absolute top-6 -left-2 sm:left-4 sm:top-8 md:top-12 md:left-16
              w-[85%] h-[90%] max-w-[380px]
              border-4 border-cyan-500 rounded-xl -z-10"
            ></div>

            {/* 🖼️ Back Image */}
            <div className="relative z-10 w-full max-w-[380px] mx-auto">
              <img
                src="/ImageR3.jpg"
                alt="Architecture"
                className="w-full h-auto aspect-[4/5] object-cover shadow-lg rounded-xl"
              />

              {/* 🖼️ Front Image */}
              <img
                src="/interior1.jpg"
                alt="Interior"
                className="absolute -right-4 -bottom-4 w-[70%] h-auto aspect-[4/5]
                object-cover shadow-2xl z-20 rounded-xl transition-transform duration-700 hover:scale-[1.03]"
              />
            </div>
          </div>
        </motion.div>

        {/* ✅ Right - Text Section */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-lg mx-auto text-center md:text-left px-4 py-8 md:py-0"
        >
          <h4 className="text-cyan-500 font-semibold uppercase tracking-[0.25em] mb-3">
            About Us
          </h4>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-snug text-gray-900">
            Building{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Smart, Sustainable
            </span>{" "}
            Designs for Modern Living
          </h2>

          <p className="text-gray-600 leading-relaxed mb-8 text-base md:text-lg max-w-lg">
            We're a creative architecture agency based in Nepal, blending design
            innovation with technology to shape inspiring, sustainable spaces.
            With over 15 years of expertise, we deliver high-quality projects that
            perfectly balance aesthetics, efficiency, and comfort — redefining
            modern living.
          </p>

          {/* ✅ Stats Section with Count-Up */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 sm:gap-8 mb-10">
            <motion.div
              animate={controls}
              className="border-2 border-cyan-500 rounded-xl px-6 sm:px-8 py-4 sm:py-5 text-center shadow-sm bg-white/90 backdrop-blur-sm"
            >
              <p className="text-4xl sm:text-5xl font-bold text-cyan-500">
                {years}+
              </p>
              <p className="text-gray-800 font-semibold text-xs sm:text-sm leading-tight">
                Years <br /> of Experience
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="border-2 border-blue-500 rounded-xl px-6 sm:px-8 py-4 sm:py-5 text-center shadow-sm bg-white/90 backdrop-blur-sm"
            >
              <p className="text-4xl sm:text-5xl font-bold text-blue-500">100%</p>
              <p className="text-gray-800 font-semibold text-xs sm:text-sm leading-tight">
                Client <br /> Satisfaction
              </p>
            </motion.div>
          </div>

          {/* CTA Button - Now using consistent Button component */}
          <Link href="/about">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                size="md"
                animated={true}
                
              >
                Learn More
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}