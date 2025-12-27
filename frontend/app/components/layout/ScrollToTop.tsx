"use client";
import { useState, useEffect } from "react";
import { ArrowUpCircle } from "lucide-react"; // Uses lucide-react icons (built into Next.js + shadcn UI)

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) setVisible(true);
      else setVisible(false);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <ArrowUpCircle className="w-8 h-8" />
        </button>
      )}
    </>
  );
}
