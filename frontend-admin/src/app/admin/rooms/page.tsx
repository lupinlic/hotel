"use client";

import React, { useEffect, useState } from "react";
import { getRooms, createRoom, updateRoom, deleteRoom, RoomDto } from "@/services/roomService";
import { getRoomTypes, RoomTypeDto } from "@/services/roomTypeService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Pagination from "@/components/tables/Pagination";
import RoomForm from "@/components/rooms/RoomForm";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<RoomDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const loadRoomTypes = async () => {
    try {
      const types = await getRoomTypes();
      setRoomTypes(types);
    } catch (err) {
      console.error("Không thể tải room type", err);
    }
  };

  useEffect(() => {
    loadRooms();
    loadRoomTypes();
  }, []);

  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(rooms.length / PAGE_SIZE));
  const pageRooms = rooms.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleOpenCreate = () => {
    setEditRoom(null);
    setFormOpen(true);
  };

  const handleEdit = (room: RoomDto) => {
    setEditRoom(room);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xác nhận xóa phòng này?")) return;
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi xóa phòng");
    }
  };

  const handleSubmit = async (data: Partial<RoomDto>) => {
    try {
      if (editRoom) {
        await updateRoom(editRoom.id, data);
      } else {
        await createRoom(data);
      }
      await loadRooms();
      setFormOpen(false);
      setEditRoom(null);
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <RoomForm
        isOpen={formOpen}
        title={editRoom ? `Sửa phòng ${editRoom.room_number}` : "Tạo phòng mới"}
        initialData={editRoom ?? undefined}
        onClose={() => {
          setFormOpen(false);
          setEditRoom(null);
        }}
        onSubmit={handleSubmit}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Danh sách phòng</h1>
        <button
          className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
          onClick={handleOpenCreate}
        >
          Thêm phòng
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 font-medium">STT</th>
              <th className="px-4 py-2 font-medium">Phòng</th>
              <th className="px-4 py-2 font-medium">Loại phòng</th>
              <th className="px-4 py-2 font-medium">Trạng thái</th>
              <th className="px-4 py-2 font-medium">Tạo</th>
              <th className="px-4 py-2 font-medium">Cập nhật</th>
              <th className="px-4 py-2 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pageRooms.map((room, index) => {
              const roomType = roomTypes.find((rt) => rt.id === room.room_type_id);
              return (
                <tr key={room.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-2">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                  <td className="px-4 py-2">{room.room_number}</td>
                  <td className="px-4 py-2">{roomType ? roomType.name : `ID ${room.room_type_id}`}</td>
                  <td className="px-4 py-2">{room.status}</td>
                  <td className="px-4 py-2">{room.created_at ? new Date(room.created_at).toLocaleString() : "-"}</td>
                  <td className="px-4 py-2">{room.updated_at ? new Date(room.updated_at).toLocaleString() : "-"}</td>
                  <td className="px-4 py-2">
                    <button className="mr-2 text-blue-600 hover:text-blue-800" onClick={() => handleEdit(room)}>
                      Sửa
                    </button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(room.id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rooms.length > PAGE_SIZE && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Hiển thị {pageRooms.length} / {rooms.length} phòng
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
          </div>
        )}
      </div>
    </div>
  );
}
