import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingState {
  id: number;
  room: any;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  paymentMethod: string;

  setBooking: (data: Partial<BookingState>) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      id: 0,
      room: null,
      checkIn: "",
      checkOut: "",
      adults: 1,
      children: 0,
      paymentMethod: "hotel",

      setBooking: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      clearBooking: () =>
        set({
          id: 0,
          room: null,
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