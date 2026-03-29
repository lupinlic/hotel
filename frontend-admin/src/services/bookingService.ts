const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

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

export type BookingRoomDto = {
  id: number;
  room_number?: string;
  status?: string;
  room_type_id?: number;
};

export type BookingDto = {
  id: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  total_guests: number;
  total_price: number | string;
  special_requests?: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
  rooms?: BookingRoomDto[];
};

export const getAdminBookings = async (): Promise<BookingDto[]> => {
  return fetchApi<BookingDto[]>("/admin/bookings");
};

const updateBookingStatus = async (id: number, action: string): Promise<BookingDto> => {
  return fetchApi<BookingDto>(`/admin/bookings/${id}/${action}`, {
    method: "PUT",
  });
};

export const confirmBooking = async (id: number) => updateBookingStatus(id, "confirm");
export const checkInBooking = async (id: number) => updateBookingStatus(id, "check-in");
export const checkOutBooking = async (id: number) => updateBookingStatus(id, "check-out");
export const completeBooking = async (id: number) => updateBookingStatus(id, "complete");
export const noShowBooking = async (id: number) => updateBookingStatus(id, "no-show");
export const cancelBooking = async (id: number) => updateBookingStatus(id, "cancel");
