// Authentication utility functions

/**
 * Get authentication token from localStorage
 * @returns {string | null} The access token or null if not found
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

/**
 * Set authentication token in localStorage
 * @param {string} token - The access token to store
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('accessToken');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return token !== null && token !== '';
};

/**
 * Create authorization headers for API requests
 * @returns {object} Headers object with Authorization
 */
export const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};