const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://zoological-patience-production-aede.up.railway.app/api';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  token?: string;
  user?: any;
}

const getAuthToken = () => localStorage.getItem('auth_token');
export const setAuthToken = (token: string) => localStorage.setItem('auth_token', token);
export const clearAuthToken = () => localStorage.removeItem('auth_token');

const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error?.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
  return response.json();
};

export const authApi = {
  register: (email: string, password: string, displayName: string) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, displayName }) }),
  login: (email: string, password: string) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => { clearAuthToken(); return apiFetch('/auth/logout', { method: 'POST' }); },
};

export const productsApi = {
  getAll: (filters?: { category?: string; brand?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString();
    return apiFetch(`/products${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getById: (id: string) => apiFetch(`/products/${id}`, { method: 'GET' }),
  create: (data: any) => apiFetch('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
};

export const ordersApi = {
  getAll: () => apiFetch('/orders', { method: 'GET' }),
  create: (items: any[]) => apiFetch('/orders', { method: 'POST', body: JSON.stringify({ items }) }),
};

export const profileApi = {
  get: () => apiFetch('/profile', { method: 'GET' }),
  update: (data: any) => apiFetch('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

export const usersApi = {
  getAll: () => apiFetch('/users', { method: 'GET' }),
  updateRole: (id: string, role: string) =>
    apiFetch(`/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  updateStatus: (id: string, data: { banned?: boolean; warning_message?: string }) =>
    apiFetch(`/users/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const reviewsApi = {
  getAll: (productId: string) => apiFetch(`/products/${productId}/reviews`, { method: 'GET' }),
  create: (productId: string, data: { rating: number; comment: string }) =>
    apiFetch(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
  delete: (productId: string, reviewId: string) =>
    apiFetch(`/products/${productId}/reviews/${reviewId}`, { method: 'DELETE' }),
};

export const cartApi = {
  getCart: () => apiFetch('/cart', { method: 'GET' }),
  addItem: (productId: string, quantity: number) =>
    apiFetch('/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  updateItem: (itemId: string, quantity: number) =>
    apiFetch(`/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeItem: (itemId: string) => apiFetch(`/cart/items/${itemId}`, { method: 'DELETE' }),
  clearCart: () => apiFetch('/cart', { method: 'DELETE' }),
};

export const categoriesApi = {
  getAll: () => apiFetch('/categories', { method: 'GET' }),
  create: (data: { name: string; description?: string }) =>
    apiFetch('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: { name: string; description?: string }) =>
    apiFetch(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/categories/${id}`, { method: 'DELETE' }),
};