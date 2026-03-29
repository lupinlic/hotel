import type { Metadata } from "next";
import React from "react";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Hotel Room Booking Admin | Dashboard",
  description: "Portal quản lý đặt phòng khách sạn",
};

export default function HotelDashboard() {
  return <DashboardClient />;
}
