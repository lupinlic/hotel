"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AmenityForm from "@/components/amenities/AmenityForm";
import {
  getAmenities,
  createAmenity,
  updateAmenity,
  deleteAmenity,
  AmenityDto,
} from "@/services/amenityService";
import { getRoomTypes, syncAmenities, RoomTypeDto } from "@/services/roomTypeService";
import { PencilIcon, TrashBinIcon } from "@/icons";

export default function HousekeepingPage() {
  const [amenities, setAmenities] = useState<AmenityDto[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeDto[]>([]);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(null);
  const [editingRoomTypeId, setEditingRoomTypeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editAmenity, setEditAmenity] = useState<AmenityDto | null>(null);
  const [deletingAmenityId, setDeletingAmenityId] = useState<number | null>(null);

  const loadAmenities = async () => {
    setLoading(true);
    setError(null);
    try {
      const [amenityData, roomTypeData] = await Promise.all([getAmenities(), getRoomTypes()]);
      setAmenities(amenityData);
      setRoomTypes(roomTypeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải danh sách tiện nghi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAmenities();
  }, []);

  const openCreateForm = () => {
    setEditAmenity(null);
    setSelectedRoomTypeId(null);
    setEditingRoomTypeId(null);
    setFormOpen(true);
  };

  const openEditForm = (amenity: AmenityDto) => {
    const assignedRoomType = roomTypes.find((roomType) =>
      roomType.amenities?.some((item) => item.id === amenity.id)
    );

    setEditAmenity(amenity);
    setSelectedRoomTypeId(assignedRoomType?.id ?? null);
    setEditingRoomTypeId(assignedRoomType?.id ?? null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditAmenity(null);
    setSelectedRoomTypeId(null);
    setEditingRoomTypeId(null);
  };

  const handleSubmit = async (payload: Partial<AmenityDto>, roomTypeId: number | null) => {
    try {
      if (!roomTypeId) {
        toast.error("Vui lòng chọn loại phòng");
        return;
      }

      let result: AmenityDto;
      if (editAmenity) {
        result = await updateAmenity(editAmenity.id, payload);
      } else {
        result = await createAmenity(payload);
      }

      const targetRoomType = roomTypes.find((roomTypeItem) => roomTypeItem.id === roomTypeId);
      const originalRoomType = editingRoomTypeId
        ? roomTypes.find((roomTypeItem) => roomTypeItem.id === editingRoomTypeId)
        : null;

      if (originalRoomType && editingRoomTypeId !== roomTypeId) {
        const oldAmenities = originalRoomType.amenities?.map((item) => item.id).filter((id) => id !== result.id) ?? [];
        await syncAmenities(originalRoomType.id, oldAmenities);
        setRoomTypes((prev) =>
          prev.map((item) =>
            item.id === originalRoomType.id
              ? { ...item, amenities: oldAmenities.map((id) => ({ id })) }
              : item
          )
        );
      }

      if (targetRoomType) {
        const existingIds = targetRoomType.amenities?.map((item) => item.id) ?? [];
        const amenityIds = existingIds.includes(result.id) ? existingIds : [...existingIds, result.id];
        await syncAmenities(roomTypeId, amenityIds);

        setRoomTypes((prev) =>
          prev.map((item) =>
            item.id === roomTypeId
              ? { ...item, amenities: amenityIds.map((id) => ({ id })) }
              : item
          )
        );
      }

      if (editAmenity) {
        setAmenities((prev) => prev.map((item) => (item.id === result.id ? result : item)));
        toast.success("Cập nhật tiện nghi thành công");
      } else {
        setAmenities((prev) => [...prev, result]);
        toast.success("Tạo tiện nghi mới thành công");
      }
      closeForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi khi lưu tiện nghi");
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xác nhận xóa tiện nghi này?")) return;

    setDeletingAmenityId(id);
    try {
      await deleteAmenity(id);
      setAmenities((prev) => prev.filter((item) => item.id !== id));
      toast.success("Xóa tiện nghi thành công");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi khi xóa tiện nghi");
    } finally {
      setDeletingAmenityId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center p-4 text-gray-500">
        <div className="flex items-center gap-3 rounded-xl   px-5 py-4 dark:border-gray-800 dark:bg-gray-900">
          <LoadingSpinner size="lg" className="text-brand-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý tiện nghi phòng</h1>
          <p className="text-sm text-gray-500">Tạo, sửa và xóa tiện nghi dùng cho phòng và gán vào loại phòng.</p>
        </div>
        <button
          className="inline-flex items-center rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
          onClick={openCreateForm}
          type="button"
        >
          Thêm tiện nghi mới
        </button>
      </div>

      <AmenityForm
        isOpen={formOpen}
        title={editAmenity ? "Chỉnh sửa tiện nghi" : "Tiện nghi mới"}
        roomTypes={roomTypes}
        selectedRoomTypeId={selectedRoomTypeId}
        initialData={editAmenity ?? undefined}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-600 dark:divide-gray-800 dark:text-gray-300">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-950 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">STT</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Icon</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Tạo</th>
              <th className="px-4 py-3">Cập nhật</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {amenities.map((amenity, index) => (
              <tr key={amenity.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{amenity.name}</td>
                <td className="px-4 py-3">{amenity.icon || "-"}</td>
                <td className="px-4 py-3">{amenity.type || "-"}</td>
                <td className="px-4 py-3">{amenity.created_at ? new Date(amenity.created_at).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-3">{amenity.updated_at ? new Date(amenity.updated_at).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => openEditForm(amenity)}
                      type="button"
                      aria-label="Sửa tiện nghi"
                      title="Sửa"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-500 text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => handleDelete(amenity.id)}
                      type="button"
                      aria-label="Xóa tiện nghi"
                      title="Xóa"
                      disabled={deletingAmenityId === amenity.id}
                    >
                      {deletingAmenityId === amenity.id ? (
                        <LoadingSpinner size="sm" className="text-white" />
                      ) : (
                        <TrashBinIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {amenities.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={7}>
                  Chưa có tiện nghi nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
