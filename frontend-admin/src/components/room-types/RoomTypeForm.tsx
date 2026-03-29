"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
import { RoomTypeDto } from "@/services/roomTypeService";

interface RoomTypeFormProps {
  isOpen: boolean;
  title: string;
  initialData?: Partial<RoomTypeDto>;
  onClose: () => void;
  onSubmit: (data: Partial<RoomTypeDto>, imageFile?: File) => Promise<void>;
}

export default function RoomTypeForm({ isOpen, title, initialData, onClose, onSubmit }: RoomTypeFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "0");
  const [adultCapacity, setAdultCapacity] = useState(initialData?.adult_capacity?.toString() || "1");
  const [childCapacity, setChildCapacity] = useState(initialData?.child_capacity?.toString() || "0");
  const [bedType, setBedType] = useState(initialData?.bed_type || "Single");
  const [bedCount, setBedCount] = useState(initialData?.bed_count?.toString() || "1");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image_url || "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [status, setStatus] = useState(initialData?.status || "active");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName(initialData?.name || "");
    setDescription(initialData?.description || "");
    setPrice(initialData?.price?.toString() || "0");
    setAdultCapacity(initialData?.adult_capacity?.toString() || "1");
    setChildCapacity(initialData?.child_capacity?.toString() || "0");
    setBedType(initialData?.bed_type || "Single");
    setBedCount(initialData?.bed_count?.toString() || "1");
    setImageFile(null);
    setImagePreview(initialData?.image_url || "");
    setImageUrl(initialData?.image_url || "");
    setStatus(initialData?.status || "active");
  }, [isOpen, initialData]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert("Vui lòng nhập tên loại phòng");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(
        {
          name,
          description,
          price: Number(price),
          adult_capacity: Number(adultCapacity),
          child_capacity: Number(childCapacity),
          bed_type: bedType,
          bed_count: Number(bedCount),
          status,
        },
        imageFile ?? undefined
      );
      onClose();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Lỗi khi lưu loại phòng");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Đóng
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tên loại phòng</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Giá</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                min={0}
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Số khách (người lớn)</label>
              <input
                value={adultCapacity}
                onChange={(e) => setAdultCapacity(e.target.value)}
                type="number"
                min={1}
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Số khách (trẻ em)</label>
              <input
                value={childCapacity}
                onChange={(e) => setChildCapacity(e.target.value)}
                type="number"
                min={0}
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Loại giường</label>
              <input
                value={bedType}
                onChange={(e) => setBedType(e.target.value)}
                type="text"
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Ảnh mô tả (chọn file)</label>
            <div className="flex items-center justify-between">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                setImageFile(file);

                if (file) {
                  const objectUrl = URL.createObjectURL(file);
                  setImagePreview(objectUrl);
                } else {
                  setImagePreview(imageUrl || "");
                }
              }}
              className="mt-1 w-30 rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {imagePreview ? (
              <div className="mt-3">
                <img src={imagePreview} alt="Preview" className="h-24 w-36 rounded-lg object-cover" />
              </div>
            ) : imageUrl ? (
              <p className="mt-2 text-sm text-gray-500">
                Ảnh hiện tại: <a href={imageUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Xem</a>
              </p>
            ) : null}
            </div>
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
