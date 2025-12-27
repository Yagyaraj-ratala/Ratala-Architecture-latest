'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ScrollToTop from '@/app/components/layout/ScrollToTop';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <ScrollToTop />
    </div>
  );
}
