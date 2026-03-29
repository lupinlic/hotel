"use client";

import React, { useEffect, useState } from "react";
import {
  getRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
  uploadRoomTypeImage,
  RoomTypeDto,
} from "@/services/roomTypeService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Pagination from "@/components/tables/Pagination";
import RoomTypeForm from "@/components/room-types/RoomTypeForm";

export default function RoomTypesPage() {
  const [types, setTypes] = useState<RoomTypeDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editType, setEditType] = useState<RoomTypeDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoomTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRoomTypes();
      setTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const PAGE_SIZE = 8;
  const totalPages = Math.max(1, Math.ceil(types.length / PAGE_SIZE));
  const pageTypes = types.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    loadRoomTypes();
  }, []);

  const handleOpenCreate = () => {
    setEditType(null);
    setFormOpen(true);
  };

  const handleEdit = (type: RoomTypeDto) => {
    setEditType(type);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xác nhận xóa loại phòng này?")) return;
    try {
      await deleteRoomType(id);
      setTypes((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi xóa loại phòng");
    }
  };

  const handleSubmit = async (data: Partial<RoomTypeDto>, imageFile?: File) => {
    try {
      let roomType: RoomTypeDto;
      if (editType) {
        roomType = await updateRoomType(editType.id, data);
      } else {
        roomType = await createRoomType(data);
      }

      if (imageFile) {
        const uploadResult = await uploadRoomTypeImage(roomType.id, imageFile);
        roomType.image_url = uploadResult.image_url;
      }

      await loadRoomTypes();
      setFormOpen(false);
      setEditType(null);
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
      <RoomTypeForm
        isOpen={formOpen}
        title={editType ? `Sửa loại ${editType.name}` : "Tạo loại phòng mới"}
        initialData={editType ?? undefined}
        onClose={() => {
          setFormOpen(false);
          setEditType(null);
        }}
        onSubmit={handleSubmit}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Loại phòng</h1>
        <button
          className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
          onClick={handleOpenCreate}
        >
          Thêm loại
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 font-medium">STT</th>
              <th className="px-4 py-2 font-medium">Tên loại</th>
              <th className="px-4 py-2 font-medium">Giá</th>
              <th className="px-4 py-2 font-medium">Mô tả</th>
              <th className="px-4 py-2 font-medium">Người lớn</th>
              <th className="px-4 py-2 font-medium">Trẻ em</th>
              <th className="px-4 py-2 font-medium">Loại giường</th>
              <th className="px-4 py-2 font-medium">Số giường</th>
              <th className="px-4 py-2 font-medium">Hình ảnh</th>
              <th className="px-4 py-2 font-medium">Tạo</th>
              <th className="px-4 py-2 font-medium">Cập nhật</th>
              <th className="px-4 py-2 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pageTypes.map((type, index) => (
              <tr key={type.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-2">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                <td className="px-4 py-2">{type.name}</td>
                <td className="px-4 py-2">{type.price?.toLocaleString()} VND</td>
                <td className="px-4 py-2">{type.description || "-"}</td>
                <td className="px-4 py-2">{type.adult_capacity}</td>
                <td className="px-4 py-2">{type.child_capacity}</td>
                <td className="px-4 py-2">{type.bed_type}</td>
                <td className="px-4 py-2">{type.bed_count}</td>
                <td className="px-4 py-2">
                  {type.image_url ? (
                    <img
                      src={type.image_url}
                      alt={type.name}
                      className="h-16 w-24 rounded-lg object-cover"
                      loading="lazy"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2">{type.created_at ? new Date(type.created_at).toLocaleString() : "-"}</td>
                <td className="px-4 py-2">{type.updated_at ? new Date(type.updated_at).toLocaleString() : "-"}</td>
                <td className="px-4 py-2">
                  <button className="mr-2 text-blue-600 hover:text-blue-800" onClick={() => handleEdit(type)}>
                    Sửa
                  </button>
                  <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(type.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {types.length > PAGE_SIZE && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Hiển thị {pageTypes.length} / {types.length} loại phòng
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
          </div>
        )}
      </div>
    </div>
  );
}