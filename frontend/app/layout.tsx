'use client';

import { usePathname } from 'next/navigation';
import "./globals.css";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import ScrollToTop from "@/app/components/layout/ScrollToTop";
import WhatsAppButton from "@/app/components/layout/WhatsAppButton";
import { metadata } from './layout-metadata';

import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isLoginRoute = pathname === '/login';
  const shouldHideHeaderFooter = isAdminRoute || isLoginRoute;

  return (
    <html lang="en">
      <body>
        {/* Only show header/footer on non-admin and non-login routes */}
        {!shouldHideHeaderFooter && <Header />}

        {/* Page Content */}
        <main>{children}</main>

        {/* Only show floating utilities on non-admin and non-login routes */}
        {!shouldHideHeaderFooter && <WhatsAppButton />}
        {!shouldHideHeaderFooter && <ScrollToTop />}

        {/* Only show footer on non-admin and non-login routes */}
        {!shouldHideHeaderFooter && <Footer />}
      </body>
    </html>
  );
}
