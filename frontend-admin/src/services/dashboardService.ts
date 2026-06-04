const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
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


export type BookingMetricsDto = {
  customers: {
    total: number;
    admin: number;
  };
  rooms: {
    total: number;
    available: number;
    occupied: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
  };
  revenue: number;
};

export type RevenueItemDto = { label: string; total_revenue: number };
export type OccupancyDto = {
  start: string;
  end: string;
  room_count: number;
  total_room_nights: number;
  occupied_nights: number;
  occupancy_rate: number;
};

export type GuestDemographicsDto = {
  customers_by_domain: Array<{ country: string; total: number }>;
  top_customers: Array<{ id: number; name: string; email: string; bookings_count: number }>;
};

export type RecentBookingDto = {
  id: number;
  check_in: string;
  check_out: string;
  status: string;
  total_price: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  rooms?: Array<{ id: number; room_number: string; status: string; room_type_id: number }>;
};

export type TopRoomDto = {
  id: number;
  room_number: string;
  room_type: string;
  booking_count: number;
  total_revenue: number;
};

export type TopRoomsDto = {
  period_start: string;
  period_end: string;
  data: TopRoomDto[];
};

export const getDashboardMetrics = async (): Promise<BookingMetricsDto> => {
  return fetchApi<BookingMetricsDto>("/admin/dashboard/metrics");
};

export const getDashboardRevenue = async (params?: { start?: string; end?: string; period?: "day" | "week" | "month" | "quarter" | "year"; }): Promise<{ period: string; start: string; end: string; data: RevenueItemDto[] }> => {
  const query = new URLSearchParams();
  if (params?.start) query.append("start", params.start);
  if (params?.end) query.append("end", params.end);
  query.append("period", params?.period || "month");
  return fetchApi(`/admin/dashboard/revenue?${query.toString()}`);
};

export const getDashboardOccupancy = async (params?: { start?: string; end?: string; }): Promise<OccupancyDto> => {
  const query = new URLSearchParams();
  if (params?.start) query.append("start", params.start);
  if (params?.end) query.append("end", params.end);
  return fetchApi(`/admin/dashboard/occupancy?${query.toString()}`);
};

export const getGuestDemographics = async (): Promise<GuestDemographicsDto> => {
  return fetchApi<GuestDemographicsDto>("/admin/dashboard/guest-demographics");
};

export const getRecentBookings = async (): Promise<RecentBookingDto[]> => {
  return fetchApi<RecentBookingDto[]>("/admin/dashboard/recent-bookings");
};

export const getTopRoomsBooked = async (params?: { start?: string; end?: string; limit?: number; }): Promise<TopRoomsDto> => {
  const query = new URLSearchParams();
  if (params?.start) query.append("start", params.start);
  if (params?.end) query.append("end", params.end);
  if (params?.limit) query.append("limit", params.limit.toString());
  return fetchApi(`/admin/dashboard/top-rooms-booked?${query.toString()}`);
};
