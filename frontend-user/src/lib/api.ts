import { getToken } from '@/services/token';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const fetcher = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const token = getToken();
  const headers = new Headers(options?.headers);

  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    const clonedRes = res.clone();
    try {
      const errorData = await clonedRes.json();
      if (errorData.message) errorMessage += ` - ${errorData.message}`;
      else if (errorData.error) errorMessage += ` - ${errorData.error}`;
    } catch (parseError) {
      try {
        const text = await clonedRes.text();
        if (text) errorMessage += ` - ${text}`;
      } catch (textError) {
        // Ignore
      }
    }
    throw new Error(errorMessage);
  }

  return res.json();
};