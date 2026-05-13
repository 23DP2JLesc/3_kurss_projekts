/**
 * API KONFIGURĀCIJA
 */
const getBaseUrl = (): string => {
  // Pārbaudām, vai VITE_API_URL ir definēts, ja nē - izmantojam tavu galveno linku
  const url = import.meta.env.VITE_API_URL || 'https://3kurssprojekts-production.up.railway.app';
  return url.replace(/\/$/, ''); // Noņemam slīpsvītru beigās, ja tāda ir
};

// Svarīgi: Pieliekam /api klāt šeit!
const API_URL = `${getBaseUrl()}/api`;

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  token?: string;
  user?: any;
}

// --- ŽETONU PĀRVALDĪBA ---
const getAuthToken = () => localStorage.getItem('auth_token');
export const setAuthToken = (token: string) => localStorage.setItem('auth_token', token);
export const clearAuthToken = () => localStorage.removeItem('auth_token');

// --- GALVENĀ FETCH FUNKCIJA ---
const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Šeit izveidojas pareizais links: .../api/auth/register
  const finalUrl = `${API_URL}${cleanEndpoint}`;

  console.log("Sūtu pieprasījumu uz:", finalUrl);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(finalUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `API kļūda: ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error?.error || errorMessage;
    } catch (e) {}
    throw new Error(errorMessage);
  }

  return response.json();
};

// --- API MODUĻI ---
export const authApi = {
  register: (email: string, password: string, displayName: string) =>
    apiFetch<ApiResponse<any>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    }),
  login: (email: string, password: string) =>
    apiFetch<ApiResponse<any>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => {
    clearAuthToken();
    return apiFetch('/auth/logout', { method: 'POST' });
  },
};

// ... (pārējie API moduļi paliek tādi paši, jo tie visi izmanto apiFetch)