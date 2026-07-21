const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('tendrlo_token');
}

export async function api(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') localStorage.setItem('tendrlo_token', token);
};

export const clearToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('tendrlo_token');
  }
};

export const getStoredToken = getToken;
