// API Configuration
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const trimmedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");
const API_BASE_URL = trimmedApiBaseUrl.endsWith("/api")
  ? trimmedApiBaseUrl
  : `${trimmedApiBaseUrl}/api`;

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  GOOGLE_LOGIN: `${API_BASE_URL}/auth/google`,
  
  // Profile (Protected)
  PROFILE: `${API_BASE_URL}/profile`,
  PROFILE_AVATAR: `${API_BASE_URL}/profile/avatar`,
  PROFILE_AVATAR_DELETE: `${API_BASE_URL}/profile/avatar/delete`,
  PROFILE_PASSWORD: `${API_BASE_URL}/profile/password`,
  PROFILE_PASSWORD_VERIFY: `${API_BASE_URL}/profile/password/verify`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
};

// Helper function to get auth headers (without Content-Type for multipart/form-data)
export const getAuthHeaders = (includeContentType = true) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  
  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }
  
  return headers;
};

// API call wrapper with error handling
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(true),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return { success: true, data };
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, error: error.message };
  }
};

export default API_BASE_URL;
