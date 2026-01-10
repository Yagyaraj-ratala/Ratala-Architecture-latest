'use client';

import { usePathname } from 'next/navigation';
import "./globals.css";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import ScrollToTop from "@/app/components/layout/ScrollToTop";
import WhatsAppButton from "@/app/components/layout/WhatsAppButton";
import { metadata } from './layout-metadata';

import type { ReactNode } from "react";

import { ChatbotProvider, useChatbot } from '@/app/contexts/ChatbotContext';
import { RatalaAI } from "@/app/components/home";

function FloatingAIButton() {
  const { toggleChat } = useChatbot();
  const pathname = usePathname();
  const isAIDesignerRoute = pathname === '/ai-designer';
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAccountantRoute = pathname?.startsWith('/accountant');
  const isLoginRoute = pathname === '/login';

  if (isAIDesignerRoute || isAdminRoute || isAccountantRoute || isLoginRoute) return null;

  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-44 right-6 z-50 group transition-all duration-300 transform hover:scale-110 active:scale-95"
      aria-label="Toggle Ratala AI"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
      <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl border-2 border-cyan-100/50">
        <img src="/ai.png" alt="Ratala AI" className="w-12 h-12 object-contain group-hover:rotate-12 transition-transform duration-300" />
      </div>
    </button>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAccountantRoute = pathname?.startsWith('/accountant');
  const isLoginRoute = pathname === '/login';
  const isAIDesignerRoute = pathname === '/ai-designer';
  const shouldHideHeaderFooter = isAdminRoute || isAccountantRoute || isLoginRoute;
  const shouldHideFooter = shouldHideHeaderFooter || isAIDesignerRoute;

  return (
    <html lang="en">
      <body>
        <ChatbotProvider>
          {/* Only show header/footer on non-admin, non-accountant and non-login routes */}
          {!shouldHideHeaderFooter && <Header />}

          {/* Page Content */}
          <main>{children}</main>

          {/* Only show floating utilities on non-admin, non-accountant and non-login routes */}
          {!shouldHideFooter && <WhatsAppButton />}
          <FloatingAIButton />
          {!shouldHideFooter && <ScrollToTop />}

          {/* Only show footer on non-admin, non-accountant and non-login routes */}
          {!shouldHideFooter && <Footer />}

          {/* Ratala AI Chatbot - hide on accountant routes */}
          {!isAccountantRoute && <RatalaAI />}
        </ChatbotProvider>
      </body>
    </html>
  );
}
