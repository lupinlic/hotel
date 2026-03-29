"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/button/Button";
import { RoomTypeDto } from "@/services/roomTypeService";
import { AmenityDto } from "@/services/amenityService";

interface AmenityFormProps {
  isOpen: boolean;
  title: string;
  roomTypes: RoomTypeDto[];
  initialData?: Partial<AmenityDto>;
  selectedRoomTypeId?: number | null;
  onClose: () => void;
  onSubmit: (data: Partial<AmenityDto>, roomTypeId: number | null) => Promise<void>;
}

export default function AmenityForm({
  isOpen,
  title,
  roomTypes,
  initialData,
  selectedRoomTypeId,
  onClose,
  onSubmit,
}: AmenityFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [icon, setIcon] = useState(initialData?.icon || "");
  const [type, setType] = useState(initialData?.type || "");
  const [roomTypeId, setRoomTypeId] = useState<number | null>(selectedRoomTypeId ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setName(initialData?.name || "");
    setIcon(initialData?.icon || "");
    setType(initialData?.type || "");
    setRoomTypeId(selectedRoomTypeId ?? null);
  }, [isOpen, initialData, selectedRoomTypeId]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Tên tiện nghi không được để trống");
      return;
    }

    if (!roomTypeId) {
      toast.error("Vui lòng chọn loại phòng");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(
        {
          name: name.trim(),
          icon: icon.trim() || null,
          type: type.trim() || null,
        },
        roomTypeId
      );
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            type="button"
            className="text-gray-500 transition hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Tên tiện nghi</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              placeholder="Ví dụ: Wifi, Tivi, Điều hòa"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Icon</label>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              placeholder="Tên icon hoặc class icon"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Loại tiện nghi</label>
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              placeholder="Ví dụ: Tiện nghi tiêu chuẩn, Tiện nghi cao cấp"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Chọn loại phòng</label>
            <select
              value={roomTypeId ?? ""}
              onChange={(e) => setRoomTypeId(e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              required
            >
              <option value="">-- Chọn loại phòng --</option>
              {roomTypes.map((roomType) => (
                <option key={roomType.id} value={roomType.id}>
                  {roomType.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Hủy
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu tiện nghi"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
