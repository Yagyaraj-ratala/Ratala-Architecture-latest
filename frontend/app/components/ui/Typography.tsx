"use client";

import React from "react";
import clsx from "clsx"; // make sure this is installed: npm install clsx

/**
 * ✅ Standardized, professional typography system.
 * This ensures every section (Hero, About, Projects, etc.) uses consistent type hierarchy.
 */

interface Props {
  children: React.ReactNode;
  className?: string;
}

/* 🏆 Display — for hero headings or large numbers (like counters) */
const Display = ({ children, className }: Props) => (
  <p
    className={clsx(
      "text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight text-gray-900",
      className
    )}
  >
    {children}
  </p>
);

/* 🥇 H1 — for primary titles (page headers, hero sections) */
const H1 = ({ children, className }: Props) => (
  <h1
    className={clsx(
      "text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-gray-900",
      className
    )}
  >
    {children}
  </h1>
);

/* 🥈 H2 — for section titles (Testimonials, Projects, etc.) */
const H2 = ({ children, className }: Props) => (
  <h2
    className={clsx(
      "text-[1.9rem] sm:text-[2.2rem] md:text-[2.6rem] font-semibold text-gray-900 leading-snug tracking-tight",
      className
    )}
  >
    {children}
  </h2>
);

/* 🥉 H3 — for subtitles, card titles, or smaller section headings */
const H3 = ({ children, className }: Props) => (
  <h3
    className={clsx(
      "text-xl sm:text-2xl font-semibold text-gray-800 leading-snug",
      className
    )}
  >
    {children}
  </h3>
);

/* 🧾 P — for paragraph text */
const P = ({ children, className }: Props) => (
  <p
    className={clsx(
      "text-gray-600 text-[0.95rem] sm:text-base md:text-lg leading-relaxed font-normal",
      className
    )}
  >
    {children}
  </p>
);

/* 🔹 Small — for labels, captions, or metadata */
const Small = ({ children, className }: Props) => (
  <small
    className={clsx(
      "text-sm text-gray-500 font-medium tracking-wide",
      className
    )}
  >
    {children}
  </small>
);

/* ✅ Unified export */
export const Typography = {
  Display,
  H1,
  H2,
  H3,
  P,
  Small,
};
