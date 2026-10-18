import axios, { AxiosError } from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unified errors and session expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      // Clear token if expired or invalid
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && currentPath !== '/') {
        removeAuthToken();
        removeCurrentUser();
      }
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

// Auth token helpers
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const setCurrentUser = (user: any) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getCurrentUser = (): any => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const removeCurrentUser = () => {
  localStorage.removeItem('currentUser');
};

// API Client Surface
export const api = {
  auth: {
    signup: async (
      email: string,
      password: string,
      name: string,
      role: string = 'user',
      phone?: string,
      department?: string
    ) => {
      const response = await apiClient.post('/auth/signup', {
        email,
        password,
        name,
        role,
        phone,
        department,
      });
      return response.data;
    },

    signin: async (email: string, password: string) => {
      const response = await apiClient.post('/auth/signin', {
        email,
        password,
      });
      const data = response.data;
      if (data.accessToken) {
        setAuthToken(data.accessToken);
      }
      if (data.user) {
        setCurrentUser(data.user);
      }
      return data;
    },

    getMe: async () => {
      const response = await apiClient.get('/auth/me');
      const user = response.data.user;
      if (user) {
        setCurrentUser(user);
      }
      return user;
    },

    updateProfile: async (profileData: {
      name?: string;
      phone?: string;
      department?: string;
      avatar?: string;
      password?: string;
    }) => {
      const response = await apiClient.put('/auth/profile', profileData);
      const data = response.data;
      if (data.user) {
        setCurrentUser(data.user);
      }
      return data;
    },

    signout: () => {
      removeAuthToken();
      removeCurrentUser();
    },
  },

  items: {
    getAll: async (filters?: {
      status?: string;
      type?: string;
      category?: string;
      q?: string;
    }) => {
      const response = await apiClient.get('/items', { params: filters });
      return response.data;
    },

    getById: async (id: string) => {
      const response = await apiClient.get(`/items/${id}`);
      return response.data;
    },

    create: async (itemData: {
      title: string;
      description: string;
      category: string;
      subcategory?: string;
      quantity: number;
      type?: string;
      imageUrl?: string;
      ownerPhone?: string;
      location: string;
      timeSlot: string;
    }) => {
      const response = await apiClient.post('/items', itemData);
      return response.data;
    },

    update: async (id: string, itemData: any) => {
      const response = await apiClient.put(`/items/${id}`, itemData);
      return response.data;
    },

    delete: async (id: string) => {
      const response = await apiClient.delete(`/items/${id}`);
      return response.data;
    },
  },

  admin: {
    approveItem: async (itemId: string) => {
      const response = await apiClient.put(`/admin/items/${itemId}/approve`);
      return response.data;
    },

    rejectItem: async (itemId: string) => {
      const response = await apiClient.put(`/admin/items/${itemId}/reject`);
      return response.data;
    },

    getAllUsers: async () => {
      const response = await apiClient.get('/admin/users');
      return response.data;
    },

    getStats: async () => {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    },

    getDatabaseOverview: async () => {
      const response = await apiClient.get('/admin/database');
      return response.data;
    },
  },

  requests: {
    create: async (
      itemId: string,
      requestedQuantity: number = 1,
      message?: string
    ) => {
      const response = await apiClient.post('/requests', {
        itemId,
        requestedQuantity,
        message,
      });
      return response.data;
    },

    getOwnerRequests: async () => {
      const response = await apiClient.get('/requests/received');
      return response.data;
    },

    getUserRequests: async () => {
      const response = await apiClient.get('/requests/my');
      return response.data;
    },

    approve: async (requestId: string) => {
      const response = await apiClient.put(`/requests/${requestId}/approve`);
      return response.data;
    },

    reject: async (requestId: string) => {
      const response = await apiClient.put(`/requests/${requestId}/reject`);
      return response.data;
    },

    cancel: async (requestId: string) => {
      const response = await apiClient.put(`/requests/${requestId}/cancel`);
      return response.data;
    },
  },

  donations: {
    getAll: async () => {
      const response = await apiClient.get('/donations');
      return response.data;
    },

    requestPickup: async (
      itemIds: string[],
      ngoName: string,
      contactNumber: string,
      pickupDate: string,
      notes?: string
    ) => {
      const response = await apiClient.post('/donations/pickup', {
        itemIds,
        ngoName,
        contactNumber,
        pickupDate,
        notes,
      });
      return response.data;
    },

    getPickups: async () => {
      const response = await apiClient.get('/donations/pickups');
      return response.data;
    },
  },

  impact: {
    getStats: async () => {
      const response = await apiClient.get('/impact/stats');
      return response.data;
    },
  },
};
