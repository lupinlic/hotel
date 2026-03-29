import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/api';

interface DashboardMetrics {
  total_users: number;
  total_bookings: number;
  total_revenue: number;
  total_rooms: number;
  occupied_rooms: number;
  available_rooms: number;
}

interface RevenueData {
  total_revenue: number;
  monthly_revenue: { month: string; revenue: number }[];
}

interface OccupancyData {
  total_rooms: number;
  occupied_rooms: number;
  occupancy_rate: number;
  daily_occupancy: { date: string; occupied: number; available: number }[];
}

interface GuestDemographics {
  total_guests: number;
  guest_types: { type: string; count: number }[];
  nationality_distribution: { nationality: string; count: number }[];
}

interface RecentBooking {
  id: number;
  guest_name: string;
  guest_email: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: string;
  created_at: string;
}

// Admin dashboard hooks
export const useDashboardMetrics = () => {
  return useQuery<DashboardMetrics, Error>({
    queryKey: ['dashboard', 'metrics'],
    queryFn: () => fetcher<DashboardMetrics>('/admin/dashboard/metrics'),
  });
};

export const useDashboardRevenue = () => {
  return useQuery<RevenueData, Error>({
    queryKey: ['dashboard', 'revenue'],
    queryFn: () => fetcher<RevenueData>('/admin/dashboard/revenue'),
  });
};

export const useDashboardOccupancy = () => {
  return useQuery<OccupancyData, Error>({
    queryKey: ['dashboard', 'occupancy'],
    queryFn: () => fetcher<OccupancyData>('/admin/dashboard/occupancy'),
  });
};

export const useGuestDemographics = () => {
  return useQuery<GuestDemographics, Error>({
    queryKey: ['dashboard', 'guest-demographics'],
    queryFn: () => fetcher<GuestDemographics>('/admin/dashboard/guest-demographics'),
  });
};

export const useRecentBookings = () => {
  return useQuery<RecentBooking[], Error>({
    queryKey: ['dashboard', 'recent-bookings'],
    queryFn: () => fetcher<RecentBooking[]>('/admin/dashboard/recent-bookings'),
  });
};