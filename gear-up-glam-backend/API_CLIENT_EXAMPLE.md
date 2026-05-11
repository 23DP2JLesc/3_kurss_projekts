# Complete API Client for Frontend

Copy this file directly to your React frontend at: `src/integrations/api/client.ts`

---

## File: src/integrations/api/client.ts

```typescript
/**
 * API Client for Gear-Up-Glam Backend
 * Handles all HTTP requests to Express API
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  token?: string;
  user?: any;
}

/**
 * Get JWT token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Save JWT token to localStorage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * Remove JWT token from localStorage
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

/**
 * Core fetch wrapper with error handling
 */
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
    const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
};

// ==================== AUTH API ====================

export const authApi = {
  /**
   * Register a new user
   * @param email User email
   * @param password User password (6+ chars)
   * @param displayName User display name
   */
  register: (email: string, password: string, displayName: string) =>
    apiFetch<ApiResponse<any>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    }),

  /**
   * Login user and get JWT token
   * @param email User email
   * @param password User password
   */
  login: (email: string, password: string) =>
    apiFetch<ApiResponse<any>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  /**
   * Logout user (removes token from localStorage)
   */
  logout: async () => {
    clearAuthToken();
    return apiFetch('/api/auth/logout', { method: 'POST' });
  },
};

// ==================== PRODUCTS API ====================

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
  fitment: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export const productsApi = {
  /**
   * Get all products with optional filtering
   * @param filters Optional filters (category, brand, search)
   * @param limit Number of results per page
   * @param offset Pagination offset
   */
  getAll: (filters?: {
    category?: string;
    brand?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/api/products?${queryString}` : '/api/products';

    return apiFetch<ProductsResponse>(endpoint, {
      method: 'GET',
    });
  },

  /**
   * Get single product by ID
   * @param id Product ID
   */
  getById: (id: string) =>
    apiFetch<Product>(`/api/products/${id}`, { method: 'GET' }),

  /**
   * Create new product (admin only)
   * @param data Product data
   */
  create: (data: Partial<Product>) =>
    apiFetch<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update product by ID (admin only)
   * @param id Product ID
   * @param data Partial product data to update
   */
  update: (id: string, data: Partial<Product>) =>
    apiFetch<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Delete product by ID (admin only)
   * @param id Product ID
   */
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/api/products/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== ORDERS API ====================

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export const ordersApi = {
  /**
   * Get all orders for current user
   */
  getAll: () =>
    apiFetch<Order[]>('/api/orders', { method: 'GET' }),

  /**
   * Create a new order (checkout)
   * @param items Array of items with productId and quantity
   */
  create: (items: Array<{ productId: string; quantity: number }>) =>
    apiFetch<{ message: string; order: Order }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
};

// ==================== PROFILE API ====================

export interface UserProfile {
  id: string;
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export const profileApi = {
  /**
   * Get current user's profile
   */
  get: () =>
    apiFetch<UserProfile>('/api/profile', { method: 'GET' }),

  /**
   * Update current user's profile
   * @param data Profile fields to update
   */
  update: (data: Partial<UserProfile>) =>
    apiFetch<UserProfile>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ==================== USERS API (ADMIN) ====================

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  banned: boolean;
  createdAt: string;
  profile?: Partial<UserProfile>;
}

export const usersApi = {
  /**
   * Get all users (admin only)
   */
  getAll: () =>
    apiFetch<User[]>('/api/users', { method: 'GET' }),

  /**
   * Update user role (admin only)
   * @param id User ID
   * @param role New role ('user' or 'admin')
   */
  updateRole: (id: string, role: 'user' | 'admin') =>
    apiFetch<User>(`/api/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  /**
   * Ban or unban user (admin only)
   * @param id User ID
   * @param banned Ban status (true = banned, false = unbanned)
   */
  banUser: (id: string, banned: boolean) =>
    apiFetch<User>(`/api/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ banned }),
    }),
};

// ==================== UTILITY ====================

/**
 * Check if current user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Decode JWT token to get user info (without verification)
 * WARNING: Only for getting user info, never verify sensitive claims on frontend
 */
export const decodeToken = (): any => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Example: Get current user's ID from token
 */
export const getCurrentUserId = (): string | null => {
  const decoded = decodeToken();
  return decoded?.userId || null;
};
```

---

## Usage Example in React Component

```typescript
import { useEffect, useState } from 'react';
import { productsApi, authApi, setAuthToken, getAuthToken } from '@/integrations/api/client';

export function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getAll({
          category: 'Exhaust',
          limit: 50,
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Usage in Login

```typescript
import { useNavigate } from 'react-router-dom';
import { authApi, setAuthToken } from '@/integrations/api/client';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      
      // Save token
      if (response.token) {
        setAuthToken(response.token);
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  // ... rest of component
}
```

---

## Error Handling

All API calls throw errors that can be caught:

```typescript
try {
  const product = await productsApi.getById('invalid-id');
} catch (error) {
  // error is an Error with message like "Product not found"
  console.error(error.message);
}
```

For better error handling with types:

```typescript
const handleCheckout = async (items: any[]) => {
  try {
    const result = await ordersApi.create(items);
    console.log('Order created:', result.order);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Insufficient stock')) {
        // Handle stock error
      } else if (error.message.includes('Not authenticated')) {
        // Redirect to login
      } else {
        // Generic error
      }
    }
  }
};
```

---

## Environment Variable

Add to your `.env.local` file:

```env
VITE_API_URL=http://localhost:3000
```

Or during production:

```env
VITE_API_URL=https://api.yourdomain.com
```

The client will automatically use `http://localhost:3000` if this variable is not set.

---

Done! Copy this entire file to `src/integrations/api/client.ts` in your frontend and start using it! 🚀
