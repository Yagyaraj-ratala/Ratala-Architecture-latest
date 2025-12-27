"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaPhoneAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import dynamic from 'next/dynamic';


// Import Modal component
const Modal = dynamic(
  () => import('@/app/components/ui/Modal'),
  { ssr: false }
);

// Reusable Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
  spinning?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  size = "md",
  className = "",
  animated = false,
  spinning = false,
}) => {
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 sm:px-6 py-3 text-sm sm:text-base",
    lg: "px-6 sm:px-8 py-4 text-base lg:text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        bg-gradient-to-r from-cyan-500 to-blue-600 
        text-white rounded-lg font-semibold
        transition-all duration-300 transform hover:scale-105 hover:shadow-lg
        border border-white/20 relative overflow-hidden
        ${sizeClasses[size]}
        ${spinning ? "spin-3d" : animated ? "float-3d" : ""}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white/10 hover:bg-white/5 transition-colors" />
    </button>
  );
};

const Header: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpinning(true);
      setTimeout(() => setIsSpinning(false), 2000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleLinkClick = () => setIsMobileMenuOpen(false);

  const navItems = [
    { href: "/", label: "Home", isActive: true },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/cost-calculator", label: "Cost Calculator" },
    { href: "/blogs", label: "Blogs & Articles" },
    { href: "/contact", label: "Contact" },
    { href: "/login", label: "Admin" },
  ];

  

  const NavigationLinks = ({ isSticky = false }) => (
    <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-semibold text-gray-800 tracking-wide text-base lg:text-lg">
      {navItems.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`${
              item.isActive ? "text-cyan-500" : "hover:text-cyan-500"
            } transition-colors whitespace-nowrap px-2`}
            onClick={handleLinkClick}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  const MobileMenu = () => (
    <div className="lg:hidden bg-white shadow-lg border-t w-full mobile-menu">
      <ul className="flex flex-col py-4 px-6 space-y-1">
        {navItems.map((item, index) => (
          <li
            key={item.href}
            className={index < navItems.length - 1 ? "border-b border-gray-100" : ""}
          >
            <Link
              href={item.href}
              className={`block py-4 ${
                item.isActive
                  ? "text-cyan-500 font-semibold"
                  : "text-gray-800 hover:text-cyan-500"
              } text-lg transition-colors`}
              onClick={handleLinkClick}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const TopInfoBar = () => (
    <div className="bg-cyan-500 text-white w-full">
      <div className="max-w-[95vw] mx-auto flex flex-wrap items-center justify-between py-2 px-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base">
          <div className="flex items-center space-x-2">
            <FaPhoneAlt className="text-white text-sm" />
            <span>+9779851325508</span>
          </div>
          <div className="flex items-center space-x-2">
            <MdEmail className="text-white text-sm" />
            <span className="hidden sm:inline">info@ratalaarchitecture.com</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <a href="#" className="hover:text-gray-200"><FaFacebookF /></a>
          <a href="#" className="hover:text-gray-200"><FaYoutube /></a>
          <a href="#" className="hover:text-gray-200"><FaLinkedinIn /></a>
          <a href="#" className="hover:text-gray-200"><FaInstagram /></a>
        </div>
      </div>
    </div>
  );

  const MainNavbar = ({ showTopBar = true, isStickyVersion = false }) => (
    <div className="w-full bg-white shadow-sm">
      {showTopBar && <div className="hidden sm:block"><TopInfoBar /></div>}

      <div className="w-full max-w-[95vw] mx-auto flex items-center justify-between h-24 sm:h-24 lg:h-28 px-4 sm:px-6 border-b border-gray-100">
        <div className="flex items-center space-x-4 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-cyan-500 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Ratala Logo"
          className="h-14 sm:h-20 lg:h-24 w-auto object-contain logo-glow transition-transform hover:scale-105"
        />

        {/* Desktop Nav */}
        <div className="hidden lg:flex justify-center flex-1">
          <NavigationLinks />
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-3">
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-cyan-500 hover:bg-gray-100 transition"
            >
              {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>

          {/* Consistent Gradient Button */}
          <Button
            size="md"
            animated={!isSpinning}
            spinning={isSpinning}
          >
            Get Free AI Quote
          </Button>

        </div>
      </div>

      {/* Mobile dropdown */}
      {isMobileMenuOpen && !isStickyVersion && <MobileMenu />}
    </div>
  );

  return (
    <>
      <style jsx>{`
        @keyframes spin3D {
          0% { transform: perspective(1000px) rotateY(0deg); }
          50% { transform: perspective(1000px) rotateY(180deg); }
          100% { transform: perspective(1000px) rotateY(360deg); }
        }
        .spin-3d { animation: spin3D 2s ease-in-out forwards; }

        @keyframes float3D {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .float-3d { animation: float3D 3s ease-in-out infinite; }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu { animation: slideDown 0.3s ease-out; }
      `}</style>

      {/* Normal Header */}
      {!isSticky && (
        <div className="absolute top-0 left-0 w-full z-40 transition-all duration-300">
          <MainNavbar showTopBar={true} isStickyVersion={false} />
        </div>
      )}

      {/* Sticky Header */}
      {isSticky && (
        <div className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
          <MainNavbar showTopBar={false} isStickyVersion={true} />
          {isMobileMenuOpen && <MobileMenu />}
        </div>
      )}
    </>
  );
};

export default Header;