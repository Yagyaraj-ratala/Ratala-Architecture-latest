"use client";

import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    "Home",
    "About Us",
    "Services",
    "Projects",
    "Careers",
    "Blogs",
    "Contact Us",
  ];

  return (
    <footer className="relative bg-white text-gray-800 pt-14 pb-0 border-t border-gray-200 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* === Logo & About === */}
        <div>
          <Image
            src="/logo.png"
            alt="Ratala Logo"
            width={160}
            height={80}
            priority
            className="mb-4 hover:scale-105 transition-transform"
          />
          <h3 className="text-xl font-semibold text-[#0dcaf0] mb-3">
            Ratala Architecture & Interiors
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            We are a leading architecture and interior design firm in Nepal,
            creating innovative spaces that blend design excellence with
            client satisfaction.
          </p>
        </div>

        {/* === Quick Links === */}
        <div>
          <h4 className="text-lg font-semibold text-[#0dcaf0] mb-4 border-b-2 border-[#0dcaf0] w-fit">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li
                key={link}
                className="flex items-center gap-1 cursor-pointer hover:text-[#0dcaf0] transition-colors"
              >
                <span className="text-[#0dcaf0]">›</span> {link}
              </li>
            ))}
          </ul>
        </div>

        {/* === QR Code === */}
        <div>
          <h4 className="text-lg font-semibold text-[#0dcaf0] mb-4 border-b-2 border-[#0dcaf0] w-fit">
            QR Code
          </h4>
          <div className="bg-gray-100 rounded-xl p-3 w-[140px] h-[140px] flex items-center justify-center shadow-md hover:shadow-[#0dcaf0]/40 transition-shadow">
            <Image
              src="/qrcode.png"
              alt="QR Code"
              width={120}
              height={120}
              className="rounded-md"
            />
          </div>
          <p className="text-xs mt-3 text-gray-500">Scan to visit our website.</p>
        </div>

        {/* === Contact Info === */}
        <div>
          <h4 className="text-lg font-semibold text-[#0dcaf0] mb-4 border-b-2 border-[#0dcaf0] w-fit">
            Contact Us
          </h4>
          <div className="space-y-3 text-sm text-gray-700">
            <p className="flex items-start gap-2">
              <MapPin size={16} className="text-[#0dcaf0] mt-1" />
              1st Floor, Opp. Daura Thakali, PepsiCola-32, Kathmandu, Nepal
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} className="text-[#0dcaf0]" />
              +977 9851325508
            </p>
            <p className="flex items-center gap-2">
              <Mail size={16} className="text-[#0dcaf0]" />
              info@ratalaarchitecture.com
            </p>
          </div>
        </div>
      </div>

      {/* === Bottom Section === */}
      <div className="bg-[#0b0b0b] text-gray-300 mt-12 py-6 text-center border-t border-[#0dcaf0]/20">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-[#0dcaf0] font-semibold">
            Ratala Architecture & Interiors
          </span>{" "}
          | All Rights Reserved.
        </p>
        <p className="mt-2 text-gray-400">
          Designed & Developed by{" "}
          <span className="text-[#0dcaf0] font-medium">
            Ratala IT Solutions Pvt. Ltd.
          </span>
        </p>
      </div>
    </footer>
  );
}
