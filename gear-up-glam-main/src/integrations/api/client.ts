const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  token?: string;
  user?: any;
}

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};

const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
};

export const authApi = {
  register: (email: string, password: string, displayName: string) =>
    apiFetch<ApiResponse<any>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    }),

  login: (email: string, password: string) =>
    apiFetch<ApiResponse<any>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => {
    clearAuthToken();
    return apiFetch('/api/auth/logout', { method: 'POST' });
  },
};

export const productsApi = {
  getAll: (filters?: { category?: string; brand?: string; search?: string }) =>
    apiFetch('/api/products', { method: 'GET' }),

  getById: (id: string) =>
    apiFetch(`/api/products/${id}`, { method: 'GET' }),

  create: (data: any) =>
    apiFetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiFetch(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch(`/api/products/${id}`, { method: 'DELETE' }),
};

export const ordersApi = {
  getAll: () =>
    apiFetch('/api/orders', { method: 'GET' }),

  create: (items: any[]) =>
    apiFetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
};

export const profileApi = {
  get: () =>
    apiFetch('/api/profile', { method: 'GET' }),

  update: (data: any) =>
    apiFetch('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const usersApi = {
  getAll: () =>
    apiFetch('/api/users', { method: 'GET' }),

  updateRole: (id: string, role: string) =>
    apiFetch(`/api/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  banUser: (id: string, banned: boolean) =>
    apiFetch(`/api/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ banned }),
    }),

  updateStatus: (id: string, data: { banned?: boolean; warning_message?: string }) =>
    apiFetch(`/api/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const reviewsApi = {
  getAll: (productId: string) =>
    apiFetch(`/api/products/${productId}/reviews`, { method: 'GET' }),

  create: (productId: string, data: { rating: number; comment: string }) =>
    apiFetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (productId: string, reviewId: string) =>
    apiFetch(`/api/products/${productId}/reviews/${reviewId}`, {
      method: 'DELETE',
    }),
};

export const cartApi = {
  getCart: () =>
    apiFetch('/api/cart', { method: 'GET' }),

  addItem: (productId: string, quantity: number) =>
    apiFetch('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),

  updateItem: (itemId: string, quantity: number) =>
    apiFetch(`/api/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  removeItem: (itemId: string) =>
    apiFetch(`/api/cart/items/${itemId}`, { method: 'DELETE' }),

  clearCart: () =>
    apiFetch('/api/cart', { method: 'DELETE' }),
};

export const categoriesApi = {
  getAll: () =>
    apiFetch('/api/categories', { method: 'GET' }),

  create: (data: { name: string; description?: string }) =>
    apiFetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { name: string; description?: string }) =>
    apiFetch(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch(`/api/categories/${id}`, { method: 'DELETE' }),
};