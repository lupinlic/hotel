import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingState {
  id: number;
  room: any;
  bookingId?: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  paymentMethod: string;

  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;

  setBooking: (data: Partial<BookingState>) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      id: 0,
      room: null,
      bookingId: undefined,
      checkIn: "",
      checkOut: "",
      adults: 1,
      children: 0,
      paymentMethod: "hotel",

      guestName: "",
      guestEmail: "",
      guestPhone: "",
      specialRequests: "",

      setBooking: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      clearBooking: () =>
        set({
          id: 0,
          room: null,
          bookingId: undefined,
          checkIn: "",
          checkOut: "",
          adults: 1,
          children: 0,
          paymentMethod: "hotel",
        }),
    }),
    {
      name: "booking-storage",
    }
  )
);