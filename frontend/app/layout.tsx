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

  return (
    <html lang="en">
      <body>
        {/* Only show header/footer on non-admin routes */}
        {!isAdminRoute && <Header />}
        
        {/* Page Content */}
        <main>{children}</main>
        
        {/* Only show floating utilities on non-admin routes */}
        {!isAdminRoute && <WhatsAppButton />}
        {!isAdminRoute && <ScrollToTop />}
        
        {/* Only show footer on non-admin routes */}
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}
