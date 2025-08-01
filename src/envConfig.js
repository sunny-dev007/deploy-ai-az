/**
 * Environment configuration that handles different environments
 * Use environment variables when available, fallback to defaults
 */

// Determine if we're in production
const isProd = process.env.NODE_ENV === 'production';

// Base URL for the application - this must match what's configured in Azure AD
// In production, this should be your actual domain
// In development, it uses localhost with the specified port
const getBaseUrl = () => {
  if (isProd) {
    // For production: Use the REACT_APP_BASE_URL environment variable if set,
    // otherwise fallback to window.location.origin
    return process.env.REACT_APP_BASE_URL || window.location.origin;
  } else {
    // For local development
    return 'http://localhost:3000';
  }
};

// Get log level from environment or use defaults based on environment
const getLogLevel = () => {
  // If explicitly set in environment, use that
  if (process.env.REACT_APP_LOG_LEVEL) {
    return parseInt(process.env.REACT_APP_LOG_LEVEL, 10);
  }
  
  // Otherwise, use sensible defaults
  return isProd ? 1 : 3; // 1=Warning in prod, 3=Verbose in dev
};

// Configuration object
const envConfig = {
  baseUrl: getBaseUrl(),
  apiUrl: isProd 
    ? (process.env.REACT_APP_API_URL || `${getBaseUrl()}/api`) 
    : 'http://localhost:3000/api',
  isProd: isProd,
  logLevel: getLogLevel(),
};

// Helper to get public path - useful for routing
export const getPublicPath = () => {
  return process.env.PUBLIC_URL || '/';
};

export default envConfig; 