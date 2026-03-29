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

export type ReviewDto = {
  id: number;
  user_id: number;
  room_id: number;
  rating: number;
  comment: string;
  status: string;
  created_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  room?: {
    room_number: string;
    room_type_id: number;
  };
};

export const getReviews = async (): Promise<ReviewDto[]> => {
  return fetchApi<ReviewDto[]>("/admin/reviews");
};

export const updateReview = async (id: number, data: Partial<ReviewDto>): Promise<ReviewDto> => {
  return fetchApi<ReviewDto>(`/admin/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteReview = async (id: number): Promise<{ success: boolean }> => {
  return fetchApi<{ success: boolean }>(`/admin/reviews/${id}`, {
    method: "DELETE",
  });
};
