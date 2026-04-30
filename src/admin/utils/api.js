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
  // Determine base URL
  let baseUrl = null //process.env.NEXT_PUBLIC_API_URL;

  // If no env var, use origin (client) or localhost (server)
  if (!baseUrl) {
    if (typeof window !== 'undefined') {
      baseUrl = window.location.origin;
    } else {
      baseUrl = 'http://localhost:3000';
    }
  }

  // Remove trailing slash if present
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  // Append /api if not already present
  if (!baseUrl.endsWith('/api')) {
    baseUrl = `${baseUrl}/api`;
  }

  return baseUrl;
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

  getCount: async (filters = {}) => {
    const params = { ...filters, countOnly: true };
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

  getCount: async () => {
    return await apiRequest(`/v1/contact?countOnly=true`);
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

  getCount: async () => {
    return await apiRequest(`/v1/schedule-visit?countOnly=true`);
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

  getCount: async () => {
    return await apiRequest(`/v1/interested?countOnly=true`);
  },

  getById: async (id) => {
    return await apiRequest(`/v1/interested/${id}`);
  },
};

// Call Requests APIs
export const callRequestsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/v1/call-request?${queryString}`);
  },

  updateStatus: async (id, status) => {
    return await apiRequest(`/v1/call-request/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getAll: async () => {
    return await apiRequest('/v1/dashboard');
  },
};

// Developers APIs
export const developersAPI = {
  getAll: async () => await apiRequest('/v1/developers'),
  getById: async (id) => await apiRequest(`/v1/developers/${id}`),
  create: async (data) => await apiRequest('/v1/developers', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => await apiRequest(`/v1/developers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => await apiRequest(`/v1/developers/${id}`, { method: 'DELETE' }),
};

// Location Pages APIs (city-level pages with banner, description, etc.)
export const locationPagesAPI = {
  getAll: async () => await apiRequest('/v1/location-pages'),
  getById: async (id) => await apiRequest(`/v1/location-pages/${id}`),
  create: async (data) => await apiRequest('/v1/location-pages', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => await apiRequest(`/v1/location-pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => await apiRequest(`/v1/location-pages/${id}`, { method: 'DELETE' }),
};

// Localities APIs
export const localitiesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/v1/localities${queryString ? '?' + queryString : ''}`);
  },
  getCities: async () => await apiRequest('/v1/localities?citiesOnly=true'),
  getById: async (id) => await apiRequest(`/v1/localities/${id}`),
  create: async (data) => await apiRequest('/v1/localities', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => await apiRequest(`/v1/localities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => await apiRequest(`/v1/localities/${id}`, { method: 'DELETE' }),
};

// Health check
export const healthAPI = {
  check: async () => {
    return await apiRequest('/health');
  },
};
