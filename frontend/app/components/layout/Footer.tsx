"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Typography } from "@/app/components/ui/Typography";

export default function Footer() {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Completed Projects", href: "/projects/completed" },
    { label: "Ongoing Projects", href: "/projects/ongoing" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="relative bg-white text-gray-800 pt-16 pb-0 border-t border-gray-200 overflow-hidden">
      {/* Subtle background glows */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-cyan-50/40 blur-[120px] rounded-full -translate-x-20 -translate-y-20"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-50/40 blur-[120px] rounded-full translate-x-10 translate-y-10"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">
          
          {/* === Logo & About === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Ratala Logo"
                width={160}
                height={80}
                priority
                className="mb-5 hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <Typography.H3 className="text-gray-800 mb-4">
              Ratala Architecture & Interiors
            </Typography.H3>
            <Typography.P className="text-gray-700 text-sm leading-relaxed">
              We are a leading architecture and interior design firm in Nepal,
              creating innovative spaces that blend design excellence with
              client satisfaction.
            </Typography.P>
          </motion.div>

          {/* === Quick Links === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Typography.H3 className="text-gray-800 mb-6 pb-2 border-b-2 border-cyan-500 w-fit">
              Quick Links
            </Typography.H3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-cyan-500 transition-colors duration-300 group"
                  >
                    <span className="text-cyan-500 group-hover:translate-x-1 transition-transform duration-300">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* === QR Code === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography.H3 className="text-gray-800 mb-6 pb-2 border-b-2 border-cyan-500 w-fit">
              QR Code
            </Typography.H3>
            <div className="bg-gray-50 rounded-2xl p-4 w-[160px] h-[160px] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
              <Image
                src="/qrcode.png"
                alt="QR Code"
                width={140}
                height={140}
                className="rounded-lg"
              />
            </div>
            <Typography.Small className="text-gray-600 mt-4 block">
              Scan to visit our website.
            </Typography.Small>
          </motion.div>

          {/* === Contact Info === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Typography.H3 className="text-gray-800 mb-6 pb-2 border-b-2 border-cyan-500 w-fit">
              Contact Us
            </Typography.H3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-cyan-500 mt-1 flex-shrink-0" />
                <Typography.P className="text-gray-700 text-sm leading-relaxed">
                  1st Floor, Opp. Daura Thakali, PepsiCola-32, Kathmandu, Nepal
                </Typography.P>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-cyan-500 flex-shrink-0" />
                <a 
                  href="tel:+9779851325508" 
                  className="text-gray-700 text-sm hover:text-cyan-500 transition-colors duration-300"
                >
                  +977 9851325508
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-cyan-500 flex-shrink-0" />
                <a 
                  href="mailto:info@ratalaarchitecture.com" 
                  className="text-gray-700 text-sm hover:text-cyan-500 transition-colors duration-300"
                >
                  info@ratalaarchitecture.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* === Bottom Section === */}
      <div className="bg-gray-900 text-gray-300 mt-12 py-8 text-center border-t border-gray-800 relative">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm md:text-base">
            © {new Date().getFullYear()}{" "}
            <span className="text-cyan-400 font-semibold">
              Ratala Architecture & Interiors
            </span>{" "}
            | All Rights Reserved.
          </p>
          <p className="mt-3 text-xs md:text-sm text-gray-400">
            Designed & Developed by{" "}
            <span className="text-cyan-400 font-medium">
              Ratala IT Solutions Pvt. Ltd.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
