/**
 * Secure authentication storage utilities
 * Handles localStorage operations with error handling and validation
 */

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_STATUS_KEY = 'isAuthenticated';
const USER_DATA_KEY = 'user';

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') {
      return false;
    }
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Store authentication token with expiration
 */
export function setAuthTokenWithExpiration(token: string, rememberMe: boolean): boolean {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return false;
  }

  try {
    const expirationTime = rememberMe ? 
      Date.now() + (24 * 60 * 60 * 1000) : // 1 day
      Date.now() + (5 * 60 * 1000); // 5 minutes
    
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(`${AUTH_TOKEN_KEY}_expires`, expirationTime.toString());
    localStorage.setItem(`${AUTH_TOKEN_KEY}_remember`, rememberMe.toString());
    
    // Verify it was stored
    const stored = localStorage.getItem(AUTH_TOKEN_KEY);
    return stored === token;
  } catch (error) {
    console.error('Error storing auth token:', error);
    return false;
  }
}

/**
 * Store authentication token securely
 */
export function setAuthToken(token: string): boolean {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return false;
  }

  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    // Verify it was stored
    const stored = localStorage.getItem(AUTH_TOKEN_KEY);
    return stored === token;
  } catch (error) {
    console.error('Error storing auth token:', error);
    return false;
  }
}

/**
 * Get authentication token with expiration check
 */
export function getAuthToken(): string | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const expires = localStorage.getItem(`${AUTH_TOKEN_KEY}_expires`);
    
    if (!token || !expires) {
      return null;
    }
    
    // Check if token has expired
    if (Date.now() > parseInt(expires)) {
      clearAuthData();
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Store authentication status
 */
export function setAuthStatus(status: boolean): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.setItem(AUTH_STATUS_KEY, status.toString());
    return true;
  } catch (error) {
    console.error('Error storing auth status:', error);
    return false;
  }
}

/**
 * Store user data
 */
export function setUserData(user: any): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error storing user data:', error);
    return false;
  }
}

/**
 * Get user data
 */
export function getUserData(): any | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_STATUS_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(`${AUTH_TOKEN_KEY}_expires`);
    localStorage.removeItem(`${AUTH_TOKEN_KEY}_remember`);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const status = localStorage.getItem(AUTH_STATUS_KEY);
  return !!(token && status === 'true');
}

