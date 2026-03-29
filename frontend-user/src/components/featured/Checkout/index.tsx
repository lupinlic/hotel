"use client";
import { useBookingStore } from "@/store/booking";
import BookingSummary from "./components/BookingSummary";
import BookingForm from "./components/BookingForm";

function Checkout() {
  const { room, adults, children, checkIn, checkOut } = useBookingStore();
  return (
    <div className="flex max-w-6xl mx-auto py-10 gap-10">
      <div className="w-2/3">
        <BookingForm />
      </div>
      <div className="w-1/3">
        <BookingSummary />
      </div>
    </div>
  );
}

export default Checkout;
