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

export type RoomDto = {
  id: number;
  room_number: string;
  room_type_id: number;
  status: string;
  created_at?: string;
  updated_at?: string;
};

export const getRooms = async (): Promise<RoomDto[]> => {
  return fetchApi<RoomDto[]>("/rooms");
};

export const createRoom = async (data: Partial<RoomDto>): Promise<RoomDto> => {
  return fetchApi<RoomDto>("/admin/rooms", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateRoom = async (id: number, data: Partial<RoomDto>): Promise<RoomDto> => {
  return fetchApi<RoomDto>(`/admin/rooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteRoom = async (id: number): Promise<{ success: boolean }> => {
  return fetchApi<{ success: boolean }>(`/admin/rooms/${id}`, {
    method: "DELETE",
  });
};
