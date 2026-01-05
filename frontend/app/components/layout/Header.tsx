"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaChevronDown,
} from "react-icons/fa";
import dynamic from 'next/dynamic';
import { isAuthenticated, clearAuthData } from "@/lib/auth-storage"; // Import auth utils


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
  const router = useRouter(); // Use router
  const pathname = usePathname(); // Get current pathname
  const [isSticky, setIsSticky] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Auth state checking
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false);
  const [isMobileProjectsOpen, setIsMobileProjectsOpen] = useState(false);
  const [isProjectsClicked, setIsProjectsClicked] = useState(false);
  const projectsButtonRef = useRef<HTMLButtonElement>(null);
  const projectsDropdownRef = useRef<HTMLDivElement>(null);
  const hoverLockRef = useRef(false);

  // Helper to check if a link is active
  const isActive = (href: string) => {
    if (href === '/' && pathname !== '/') return false;
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => setIsSpinning(false), 2000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(isAuthenticated());
    checkAuth();

    // Listen for storage events (e.g. login from another tab)
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);

    // Custom event to updated state immediately after login/logout
    window.addEventListener('auth-update', checkAuth);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-update', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    clearAuthData();
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('auth-update')); // Notify other components
    router.push('/');
  };

  useEffect(() => {
    if (!isProjectsDropdownOpen || !isProjectsClicked) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const clickedOnButton = projectsButtonRef.current?.contains(target);
      const clickedInDropdown = projectsDropdownRef.current?.contains(target);
      const clickedInContainer = target.closest('.projects-dropdown-container');

      if (!clickedOnButton && !clickedInDropdown && !clickedInContainer) {
        setIsProjectsDropdownOpen(false);
        setIsProjectsClicked(false);
      }
    };

    const timeoutId = setTimeout(() => {
      window.addEventListener('click', handleClickOutside, true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('click', handleClickOutside, true);
    };
  }, [isProjectsDropdownOpen, isProjectsClicked]);

  const handleLinkClick = () => setIsMobileMenuOpen(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/cost-calculator", label: "Cost Calculator" },
    { href: "/blogs", label: "Blogs & Articles" },
    { href: "/contact", label: "Contact" },
  ];

  const projectsSubmenu = [
    { href: "/projects/completed", label: "Completed Projects" },
    { href: "/projects/ongoing", label: "Ongoing Projects" },
  ];



  const NavigationLinks = ({ isSticky = false }) => {
    const servicesIndex = navItems.findIndex(item => item.href === "/services");
    const beforeProjects = navItems.slice(0, servicesIndex + 1);
    const afterProjects = navItems.slice(servicesIndex + 1);

    return (
      <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-semibold text-gray-800 tracking-wide text-base lg:text-lg">
        {beforeProjects.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`${isActive(item.href) ? "text-cyan-500 underline decoration-2 underline-offset-8" : "hover:text-cyan-500"
                } transition-all duration-300 whitespace-nowrap px-2`}
              onClick={handleLinkClick}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li
          className="relative group projects-dropdown-container"
          style={{ paddingBottom: isProjectsDropdownOpen && isProjectsClicked ? '8px' : '0' }}
          onMouseEnter={() => {
            if (!isProjectsClicked && !hoverLockRef.current) {
              setIsProjectsDropdownOpen(true);
            }
          }}
          onMouseLeave={() => {
            if (!isProjectsClicked && !hoverLockRef.current) {
              setIsProjectsDropdownOpen(false);
            }
          }}
        >
          <button
            ref={projectsButtonRef}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              hoverLockRef.current = true;
              setTimeout(() => {
                hoverLockRef.current = false;
              }, 300);

              setIsProjectsDropdownOpen(prevOpen => {
                const newOpen = !prevOpen;
                setIsProjectsClicked(newOpen);
                return newOpen;
              });
            }}
            onMouseEnter={() => {
              if (!isProjectsClicked && !hoverLockRef.current) {
                setIsProjectsDropdownOpen(true);
              }
            }}
            onMouseLeave={() => {
              if (!isProjectsClicked && !hoverLockRef.current) {
                setIsProjectsDropdownOpen(false);
              }
            }}
            className={`flex items-center gap-1 transition-all duration-300 whitespace-nowrap px-2 ${projectsSubmenu.some(sub => isActive(sub.href))
                ? "text-cyan-500 underline decoration-2 underline-offset-8"
                : "hover:text-cyan-500"
              }`}
          >
            Projects
            <FaChevronDown className={`text-xs transition-transform duration-200 ${isProjectsDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isProjectsDropdownOpen && (
            <div
              ref={projectsDropdownRef}
              className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 projects-dropdown-menu"
              onMouseEnter={() => {
                setIsProjectsDropdownOpen(true);
              }}
              onMouseLeave={() => {
                if (!isProjectsClicked && !hoverLockRef.current) {
                  setIsProjectsDropdownOpen(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {projectsSubmenu.map((subItem) => (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLinkClick();
                    setIsProjectsDropdownOpen(false);
                    setIsProjectsClicked(false);
                  }}
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </li>
        {
          afterProjects.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${isActive(item.href) ? "text-cyan-500 underline decoration-2 underline-offset-8" : "hover:text-cyan-500"
                  } transition-all duration-300 whitespace-nowrap px-2`}
                onClick={handleLinkClick}
              >
                {item.label}
              </Link>
            </li>
          ))
        }
      </ul >
    );
  };

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
              className={`block py-4 ${isActive(item.href)
                ? "text-cyan-500 font-semibold pl-2 border-l-4 border-cyan-500"
                : "text-gray-800 hover:text-cyan-500"
                } text-lg transition-all duration-300`}
              onClick={handleLinkClick}
            >
              {item.label}
            </Link>
          </li>
        ))}
        {/* Mobile Projects Dropdown */}
        <li className="border-b border-gray-100">
          <button
            onClick={() => setIsMobileProjectsOpen(!isMobileProjectsOpen)}
            className={`flex items-center justify-between w-full py-4 text-lg transition-all duration-300 ${projectsSubmenu.some(sub => isActive(sub.href))
              ? "text-cyan-500 font-semibold pl-2 border-l-4 border-cyan-500"
              : "text-gray-800 hover:text-cyan-500"
              }`}
          >
            Projects
            <FaChevronDown className={`text-xs transition-transform duration-200 ${isMobileProjectsOpen ? 'rotate-180' : ''}`} />
          </button>
          {isMobileProjectsOpen && (
            <ul className="pl-4 pb-2 space-y-1">
              {projectsSubmenu.map((subItem) => (
                <li key={subItem.href}>
                  <Link
                    href={subItem.href}
                    className="block py-2 text-gray-600 hover:text-cyan-500 transition-colors"
                    onClick={() => {
                      handleLinkClick();
                      setIsMobileProjectsOpen(false);
                    }}
                  >
                    {subItem.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );

  const MainNavbar = ({ isStickyVersion = false }) => (
    <div className="w-full bg-white shadow-sm">

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

          {/* Consistent Gradient Button - Login/Logout */}
          {isLoggedIn ? (
            <Button
              size="md"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 from-red-500 to-red-600 border-red-400"
            >
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button
                size="md"
                animated={!isSpinning}
                spinning={isSpinning}
              >
                Login
              </Button>
            </Link>
          )}

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
          <MainNavbar isStickyVersion={false} />
        </div>
      )}

      {/* Sticky Header */}
      {isSticky && (
        <div className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
          <MainNavbar isStickyVersion={true} />
          {isMobileMenuOpen && <MobileMenu />}
        </div>
      )}
    </>
  );
};

export default Header;