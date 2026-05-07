"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import DateField from "@/components/shared/components/DateField";
import RoomCard from "./components/RoomCard";
import { useRoomTypes } from "@/hooks/useRoomTypes";

export default function RoomView() {
  // state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const [openGuest, setOpenGuest] = useState<boolean>(false);
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.trim() ?? "";

  const { data: roomTypes, isLoading, isError } = useRoomTypes();

  const filteredRoomTypes = useMemo(() => {
    if (!roomTypes) {
      return undefined;
    }
    if (!searchQuery) {
      return roomTypes;
    }

    return roomTypes.filter((roomType) => {
      const lowerQuery = searchQuery.toLowerCase();
      const nameMatches = roomType.name.toLowerCase().includes(lowerQuery);
      const descriptionMatches = roomType.description
        ? roomType.description.toLowerCase().includes(lowerQuery)
        : false;
      return nameMatches || descriptionMatches;
    });
  }, [roomTypes, searchQuery]);

  return (
    <div className="flex flex-col gap-10">
      <div className="z-50 flex items-center gap-6 border border-gray-300 px-4 py-2">
        <div className="flex justify-between w-full">
          {/* Ngày đến */}
          <DateField
            label="Ngày đến"
            value={checkIn}
            min={today}
            onChange={(value) => {
              setCheckIn(value);
              if (checkOut && checkOut <= value) {
                setCheckOut("");
              }
            }}
            className="bg-white hover:bg-gray-50"
          />
          {/* Ngày đi */}
          <DateField
            label="Ngày đi"
            value={checkOut}
            min={checkIn || today}
            onChange={setCheckOut}
            className="border-l border-gray-300 bg-white"
          ></DateField>

          {/* Khách */}
          <div className="relative px-6 py-4 border-l border-gray-300">
            <div className="text-[#989898] text-[14px] uppercase">
              Khách hàng
            </div>

            <div
              className="text-gray-700 text-sm mt-1 cursor-pointer"
              onClick={() => setOpenGuest((prev) => !prev)}
            >
              {adults} người lớn , {children} trẻ em
            </div>

            {openGuest && (
              <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 shadow-lg p-4 w-[220px] z-50">
                {/* adults */}
                <div className="flex justify-between items-center mb-3">
                  <span>Người lớn</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                      className="px-2 bg-gray-200"
                    >
                      -
                    </button>
                    <span>{adults}</span>
                    <button
                      onClick={() => setAdults((prev) => prev + 1)}
                      className="px-2 bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* children */}
                <div className="flex justify-between items-center">
                  <span>Trẻ em</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setChildren((prev) => Math.max(0, prev - 1))
                      }
                      className="px-2 bg-gray-200"
                    >
                      -
                    </button>
                    <span>{children}</span>
                    <button
                      onClick={() => setChildren((prev) => prev + 1)}
                      className="px-2 bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Button */}
          <div className="flex items-center px-4 bg-gray-100 border-l border-gray-300">
            <button className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-6 py-3 rounded">
              SẴN SÀNG KIỂM TRA
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        {isLoading && (
          <p className="text-center text-gray-500">Đang tải phòng...</p>
        )}

        {isError && (
          <p className="text-center text-red-500">Không tải được danh sách phòng.</p>
        )}

        {!isLoading && !isError && (filteredRoomTypes?.length ?? 0) === 0 && (
          <p className="text-center text-gray-500">
            {searchQuery
              ? `Không tìm thấy phòng phù hợp với "${searchQuery}".`
              : "Chưa có phòng nào."}
          </p>
        )}

        {!isLoading && !isError && (filteredRoomTypes?.length ?? 0) > 0 && (
          filteredRoomTypes?.map((roomType) => {
            const room = {
              id: roomType.id,
              name: roomType.name,
              price: roomType.price,
              image: roomType.image_url || '/image/default-room.jpg',
              view: 'Cảnh quan đẹp',
              size: 25,
              bed: 'Giường thoải mái',
              maxAdults: roomType.adult_capacity,
              maxChildren: roomType.child_capacity,
            };
            return <RoomCard key={roomType.id} room={room} />;
          })
        )}
      </div>
    </div>
  );
}
