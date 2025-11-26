/**
 * API Configuration
 * Centralized API base URL management
 */

export const API_CONFIG = {
  // Base URL dari environment variable
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  PAYMENT_URL: import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:3000',
};

/**
 * Helper function untuk build API endpoint
 * @param {string} path - API path (contoh: '/api/akun/all')
 * @returns {string} Full API URL
 */
export const getApiUrl = (path) => {
  // Pastikan path diawali dengan /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_CONFIG.BASE_URL}${normalizedPath}`;
};

/**
 * Helper function untuk payment API endpoint
 * @param {string} path - API path
 * @returns {string} Full Payment API URL
 */
export const getPaymentApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_CONFIG.PAYMENT_URL}${normalizedPath}`;
};
