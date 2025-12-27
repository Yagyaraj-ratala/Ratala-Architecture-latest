import "./globals.css";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import ScrollToTop from "@/app/components/layout/ScrollToTop";
import WhatsAppButton from "@/app/components/layout/WhatsAppButton";

import type { ReactNode } from "react";

export const metadata = {
  title: "Ratala Architecture & Interiors",
  description: "Professional Architecture Company in Nepal",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Global Header */}
        <Header />

        {/* Page Content */}
        <main>{children}</main>

        {/* Global Floating Utilities */}
        <WhatsAppButton />
        <ScrollToTop />

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
