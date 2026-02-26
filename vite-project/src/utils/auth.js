// Authentication utility functions

// Check if user is logged in
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }
  return null;
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/"; // Redirect to home
};

// Make authenticated API request
export const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, logout user
  if (response.status === 401) {
    logout();
    throw new Error("Session expired. Please login again.");
  }

  return response;
};
