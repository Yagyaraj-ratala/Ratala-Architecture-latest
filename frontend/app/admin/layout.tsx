'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuthToken, clearAuthData } from '@/lib/auth-storage';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyAuth = async () => {
            // Add a small delay to ensure token is fully stored after redirect
            await new Promise(resolve => setTimeout(resolve, 100));

            const token = getAuthToken();

            if (!token) {
                clearAuthData();
                router.replace('/login');
                return;
            }

            try {
                // Verify token with backend
                const response = await fetch('/api/auth/verify', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    // Check if it's a server configuration error (500) vs invalid token (401)
                    if (response.status === 500) {
                        // Don't clear token on server errors - might be temporary
                        setIsLoading(false);
                        return;
                    }

                    // Only clear on 401 (unauthorized) - token is definitely invalid
                    if (response.status === 401) {
                        clearAuthData();
                        router.replace('/login');
                        return;
                    }

                    // Other errors - don't clear token
                    setIsLoading(false);
                    return;
                }

                const data = await response.json();

                if (data.valid) {
                    // Check for admin role
                    if (data.user.role !== 'admin') {
                        router.push('/'); // Redirect non-admins to home
                        setIsLoading(false); // Ensure loading state is cleared
                        return;
                    }
                    setIsAuthenticated(true);
                    setIsLoading(false);
                } else {
                    // Token is invalid
                    clearAuthData();
                    router.replace('/login');
                    setIsLoading(false); // Ensure loading state is cleared
                }
            } catch {
                // Clear auth on network errors or parsing failures for safety in this strict environment
                clearAuthData();
                router.replace('/login');
                setIsLoading(false); // Ensure loading state is cleared
            }
        };

        verifyAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
            {/* Professional Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 h-16">
                <div className="w-full h-full">
                    <div className="flex justify-between items-center h-full">
                        {/* Left Side: Ratala Admin & Logo */}
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="Ratala Logo" className="h-12 w-auto object-contain" />
                            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
                                Ratala Admin
                            </h1>
                        </div>

                        {/* Right Side: System Status */}
                        <div className="flex items-center pr-4">
                            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="font-medium">System Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            {children}


        </div>
    );
}
