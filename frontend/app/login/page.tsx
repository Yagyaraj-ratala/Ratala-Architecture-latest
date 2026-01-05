'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { Typography } from '@/app/components/ui/Typography';
import { Button } from '@/app/components/ui/Button';
import { setAuthTokenWithExpiration, setAuthStatus, setUserData, clearAuthData, getAuthToken } from '@/lib/auth-storage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Redirect to admin if already authenticated
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Verify token is still valid
      fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            router.replace('/admin');
          } else {
            // Token is invalid, clear it
            clearAuthData();
          }
        })
        .catch(() => {
          // Error verifying, clear token
          clearAuthData();
        });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      // Check if login was successful
      if (response.ok && data.token) {
        // Store token and user info using secure storage functions with expiration
        const tokenStored = setAuthTokenWithExpiration(data.token, rememberMe);
        const statusStored = setAuthStatus(true);
        const userStored = setUserData(data.user);

        if (!tokenStored || !statusStored || !userStored) {
          clearAuthData();
          throw new Error('Failed to save authentication data. Please check your browser settings and ensure cookies/localStorage are enabled.');
        }

        // Verify that the token was actually stored
        const storedToken = getAuthToken();
        if (!storedToken || storedToken !== data.token) {
          clearAuthData();
          throw new Error('Failed to verify stored authentication token. Please try again.');
        }

        // Small delay to ensure localStorage is fully written and persisted
        await new Promise(resolve => setTimeout(resolve, 150));

        // Double-check token is still there after delay
        const finalCheck = getAuthToken();
        if (!finalCheck || finalCheck !== data.token) {
          clearAuthData();
          throw new Error('Authentication token was not persisted. Please try again.');
        }

        // Use window.location for a hard redirect to ensure it works
        // This ensures the page fully reloads and the admin layout can verify the token
        window.location.href = '/admin';
        return; // Don't set loading to false as we're redirecting
      } else {
        // Login failed - show error
        throw new Error(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24 relative overflow-hidden">
      {/* Subtle background glows */}
      <div className="absolute top-0 left-[-100px] w-[400px] h-[400px] bg-cyan-50/40 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-[-80px] w-[450px] h-[450px] bg-blue-50/40 blur-3xl rounded-full"></div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 py-10 px-6 sm:px-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Typography.H2 className="text-gray-800 mb-2">
              Welcome{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Back
              </span>
            </Typography.H2>
            <Typography.P className="text-gray-600">
              Sign in to your admin account
            </Typography.P>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <Typography.P className="text-sm text-red-700">{error}</Typography.P>
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                size="lg"
                animated={!isLoading}
                className={`w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign in
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Return to Home Link */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Return to Home
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}