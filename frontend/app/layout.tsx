import "./globals.css";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import ScrollToTop from "@/app/components/layout/ScrollToTop";
import WhatsAppButton from "@/app/components/layout/WhatsAppButton";
import { ChatbotProvider } from "@/app/contexts/ChatbotContext";
import RatalaAI from "@/app/components/home/RatalaAI";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "Ratala Architecture & Interiors",
  description: "Professional Architecture Company in Nepal",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
>
        <ChatbotProvider>
          {/* Global Header */}
          <Header />

          {/* Page Content */}
          <main>{children}</main>

          {/* Global Floating Utilities */}
          <WhatsAppButton />
          <ScrollToTop />
          
          {/* Global Chatbot */}
          <RatalaAI />

          {/* Global Footer */}
          <Footer />
        </ChatbotProvider>
      </body>
    </html>
  );
}
