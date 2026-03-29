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

export type RoomTypeDto = {
  id: number;
  name: string;
  description: string;
  price: number;
  adult_capacity: number;
  child_capacity: number;
  bed_type: string;
  bed_count: number;
  image_url?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  amenities?: { id: number }[];
};

export const getRoomTypes = async (): Promise<RoomTypeDto[]> => {
  return fetchApi<RoomTypeDto[]>("/room-types");
};

export const syncAmenities = async (roomTypeId: number, amenityIds: number[]): Promise<{ message: string }> => {
  return fetchApi<{ message: string }>(`/admin/room-types/${roomTypeId}/amenities`, {
    method: "POST",
    body: JSON.stringify({ amenity_ids: amenityIds }),
  });
};

export const createRoomType = async (data: Partial<RoomTypeDto>): Promise<RoomTypeDto> => {
  return fetchApi<RoomTypeDto>("/admin/room-types", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateRoomType = async (id: number, data: Partial<RoomTypeDto>): Promise<RoomTypeDto> => {
  return fetchApi<RoomTypeDto>(`/admin/room-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteRoomType = async (id: number): Promise<{ success: boolean }> => {
  return fetchApi<{ success: boolean }>(`/admin/room-types/${id}`, {
    method: "DELETE",
  });
};

export const uploadRoomTypeImage = async (id: number, file: File): Promise<{ image_url: string }> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/admin/room-types/${id}/upload-image`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Upload image error: ${res.status} ${errorText}`);
  }

  return res.json();
};
