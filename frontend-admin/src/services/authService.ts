const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const TOKEN_KEY = "auth_token";

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  
  console.log(`🔵 Headers:`, headers);
  
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API ${path} error: ${res.status} ${errorText}`);
  }

  return res.json();
}

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token: string;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetchApi<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (response.token) {
    setToken(response.token);
  }
  return response;
};

export const logout = async (): Promise<{ success: boolean }> => {
  try {
    await fetchApi<{ success: boolean }>("/logout", {
      method: "POST",
    });
  } finally {
    clearToken();
  }
  return { success: true };
};

export const getMe = async (): Promise<{ user: { id: number; name: string; email: string; role: string } }> => {
  return fetchApi<{ user: { id: number; name: string; email: string; role: string } }>("/me");
};
