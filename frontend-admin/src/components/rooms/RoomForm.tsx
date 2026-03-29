"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
import { RoomDto } from "@/services/roomService";
import { getRoomTypes, RoomTypeDto } from "@/services/roomTypeService";

interface RoomFormProps {
  isOpen: boolean;
  title: string;
  initialData?: Partial<RoomDto>;
  onClose: () => void;
  onSubmit: (data: Partial<RoomDto>) => Promise<void>;
}

const defaultStatus = "available";


export default function RoomForm({ isOpen, title, initialData, onClose, onSubmit }: RoomFormProps) {
  const [roomNumber, setRoomNumber] = useState(initialData?.room_number || "");
  const [roomTypeId, setRoomTypeId] = useState(initialData?.room_type_id?.toString() || "1");
  const [status, setStatus] = useState(initialData?.status || defaultStatus);
  const [roomTypes, setRoomTypes] = useState<RoomTypeDto[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setRoomNumber(initialData?.room_number || "");
    setRoomTypeId(initialData?.room_type_id?.toString() || "1");
    setStatus(initialData?.status || defaultStatus);

    const loadRoomTypes = async () => {
      try {
        const types = await getRoomTypes();
        setRoomTypes(types);
      } catch (err) {
        console.error("Không thể tải room type", err);
      }
    };

    loadRoomTypes();
  }, [isOpen, initialData]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber) {
      alert("Vui lòng nhập số phòng");
      return;
    }

    if (!roomTypeId) {
      alert("Vui lòng chọn loại phòng");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        room_number: roomNumber,
        room_type_id: Number(roomTypeId),
        status,
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Lỗi khi lưu phòng");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" onClick={onClose}>
            Đóng
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Số phòng</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Loại phòng</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={roomTypeId}
              onChange={(e) => setRoomTypeId(e.target.value)}
              required
            >
              <option value="">Chọn loại phòng...</option>
              {roomTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} (ID {type.id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Trạng thái</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
