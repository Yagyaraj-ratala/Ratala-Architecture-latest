"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Typography } from "@/app/components/ui/Typography";

interface CardProps {
  image: string;
  title: string;
  description?: string;
  location?: string;
  category?: string;
  href: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "project" | "service" | "blog";
  children?: React.ReactNode; // Add children prop
}

export const Card: React.FC<CardProps> = ({
  image,
  title,
  description,
  location,
  category,
  href,
  className = "",
  size = "md",
  variant = "project",
  children, // Add children parameter
}) => {
  const sizeClasses = {
    sm: "h-[280px]",
    md: "h-[320px] sm:h-[340px]",
    lg: "h-[380px] sm:h-[400px]",
  };

  const contentVariants = {
    project: (
      <>
        {category && (
          <Typography.Small className="uppercase text-cyan-400 font-semibold tracking-widest mb-2">
            {category}
          </Typography.Small>
        )}
        <Typography.H3 className="text-white mb-1 font-semibold">
          {title}
        </Typography.H3>
        {location && (
          <Typography.P className="text-gray-200 text-sm mb-4">
            {location}
          </Typography.P>
        )}
      </>
    ),
    service: (
      <>
        <Typography.H3 className="text-white mb-2 font-semibold">
          {title}
        </Typography.H3>
        {description && (
          <Typography.P className="text-gray-200 text-sm mb-4">
            {description}
          </Typography.P>
        )}
      </>
    ),
    blog: (
      <>
        {category && (
          <Typography.Small className="uppercase text-cyan-400 font-semibold tracking-widest mb-2">
            {category}
          </Typography.Small>
        )}
        <Typography.H3 className="text-white mb-2 font-semibold">
          {title}
        </Typography.H3>
        {description && (
          <Typography.P className="text-gray-200 text-sm mb-4">
            {description}
          </Typography.P>
        )}
      </>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      whileHover={{ scale: 1.03 }}
      className={`relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ${sizeClasses[size]} ${className}`}
    >
      {/* Background Image */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent group-hover:from-black/50 transition-all duration-700" />

      {/* Content */}
      <div className="relative z-10 p-5 text-left text-white flex flex-col justify-end h-full group-hover:translate-y-[-6px] transition-all duration-500">
        {/* Use children if provided, otherwise use default content */}
        {children || contentVariants[variant]}

        {variant !== "service" && (
          <Link
            href={href}
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:scale-105 hover:shadow-lg transition-all"
          >
            {variant === "project" ? "View Project" : "Read More"}
          </Link>
        )}
      </div>
    </motion.div>
  );
};

// Standalone Project Card (for backward compatibility)
export const ProjectCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card {...props} variant="project" />
);

// Service Card variant
export const ServiceCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card {...props} variant="service" />
);

// Blog Card variant
export const BlogCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card {...props} variant="blog" />
);