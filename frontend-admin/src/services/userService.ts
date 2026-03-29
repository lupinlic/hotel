const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API ${path} error: ${res.status} ${errorText}`);
  }

  return res.json();
}

export type UserDto = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
};

export const getUsers = async (): Promise<UserDto[]> => {
  return fetchApi<UserDto[]>("/admin/users");
};

export const updateUser = async (id: number, data: Partial<UserDto>): Promise<UserDto> => {
  return fetchApi<UserDto>(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (id: number): Promise<{ success: boolean }> => {
  return fetchApi<{ success: boolean }>(`/admin/users/${id}`, {
    method: "DELETE",
  });
};
