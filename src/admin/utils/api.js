/**
 * Admin API Utility Functions
 * Handles all API calls for the admin panel
 * Uses absolute URLs for API routes
 */

/**
 * Get API base URL dynamically
 * Uses environment variable or defaults to current origin
 */
const getApiBaseUrl = () => {
  // Check for environment variable first (for production/external API)
  if (typeof window !== 'undefined') {
    // Use environment variable if set
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    // Default to current origin with /api path
    return `${window.location.origin}/api`;
  }
  
  // Server-side fallback
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
};

/**
 * Get auth token from localStorage
 */
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
};

/**
 * Set auth token in localStorage
 */
const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_token', token);
  }
};

/**
 * Remove auth token from localStorage
 */
const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
  }
};

/**
 * Make API request with authentication
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  // Get base URL dynamically to ensure absolute URL
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response text:', text);
        throw new Error('Invalid JSON response from server');
      }
    } else {
      data = {};
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized - remove token and redirect to login
        removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
      throw new Error(data.error || data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', {
      url,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  login: async (email, password) => {
    const response = await apiRequest('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data?.token) {
      setToken(response.data.token);
    }
    
    return response;
  },

  logout: () => {
    removeToken();
  },

  getCurrentUser: async () => {
    return await apiRequest('/v1/auth/me');
  },
};

// Properties APIs
export const propertiesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/v1/properties?${queryString}`);
  },

  getById: async (id) => {
    return await apiRequest(`/v1/properties/${id}`);
  },

  create: async (propertyData) => {
    return await apiRequest('/v1/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  update: async (id, propertyData) => {
    return await apiRequest(`/v1/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/v1/properties/${id}`, {
      method: 'DELETE',
    });
  },
};

// Contact APIs
export const contactAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/v1/contact?${queryString}`);
  },

  getById: async (id) => {
    return await apiRequest(`/v1/contact/${id}`);
  },
};

// Schedule Visit APIs
export const scheduleVisitAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/v1/schedule-visit?${queryString}`);
  },

  getById: async (id) => {
    return await apiRequest(`/v1/schedule-visit/${id}`);
  },

  getByProperty: async (propertyId) => {
    return await apiRequest(`/v1/schedule-visit/property/${propertyId}`);
  },
};

// Interested APIs
export const interestedAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/v1/interested?${queryString}`);
  },

  getById: async (id) => {
    return await apiRequest(`/v1/interested/${id}`);
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return await apiRequest('/health');
  },
};
