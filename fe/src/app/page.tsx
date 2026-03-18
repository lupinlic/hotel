import Home from "@/components/featured/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Hotel Booking",
};

export default function HomePage() {
  return (
   <div>
     <Home />
   </div>
  );
}
