"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export type TopRoomData = {
  id: number;
  room_number: string;
  room_type: string;
  booking_count: number;
  total_revenue: number;
};

type TopRoomsChartProps = {
  topRooms?: TopRoomData[];
};

export default function TopRoomsChart({
  topRooms = [
    {
      id: 1,
      room_number: "101",
      room_type: "Deluxe",
      booking_count: 45,
      total_revenue: 4500000,
    },
    {
      id: 2,
      room_number: "102",
      room_type: "Standard",
      booking_count: 38,
      total_revenue: 2850000,
    },
    {
      id: 3,
      room_number: "201",
      room_type: "Suite",
      booking_count: 32,
      total_revenue: 5120000,
    },
    {
      id: 4,
      room_number: "202",
      room_type: "Deluxe",
      booking_count: 28,
      total_revenue: 2800000,
    },
    {
      id: 5,
      room_number: "103",
      room_type: "Standard",
      booking_count: 25,
      total_revenue: 1875000,
    },
  ],
}: TopRoomsChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<"booking_count" | "total_revenue">(
    "booking_count"
  );

  const labels = topRooms.map((room) => room.room_number);
  const data = topRooms.map((room) =>
    selectedMetric === "booking_count" ? room.booking_count : room.total_revenue
  );

  const colors = ["#465FFF", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"];

  const options: ApexOptions = {
    colors: colors,
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "pie",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    labels: labels,
    legend: {
      show: true,
      position: "bottom",
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val) => {
          if (selectedMetric === "total_revenue") {
            return new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(val);
          }
          return val.toString();
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="text-xl font-bold text-black dark:text-white">
            Top 5 Phòng Được Đặt Nhiều Nhất
          </h4>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMetric("booking_count")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              selectedMetric === "booking_count"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            Số Lần Đặt
          </button>
          <button
            onClick={() => setSelectedMetric("total_revenue")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              selectedMetric === "total_revenue"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            Doanh Thu
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Hiển thị theo:{" "}
          <span className="font-bold text-black dark:text-white">
            {selectedMetric === "booking_count" ? "Số Lần Đặt" : "Doanh Thu"}
          </span>
        </p>
      </div>

      <ReactApexChart
        options={options}
        series={data}
        type="pie"
        height={350}
      />

      <div className="mt-6 space-y-3">
        {topRooms.map((room, index) => (
          <div key={room.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span className="text-sm font-medium text-black dark:text-white">
                Phòng {room.room_number}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({room.room_type})
              </span>
            </div>
            <span className="text-sm font-bold text-black dark:text-white">
              {selectedMetric === "booking_count"
                ? `${room.booking_count} lần`
                : new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(room.total_revenue)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
