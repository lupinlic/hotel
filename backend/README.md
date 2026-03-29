# 🏨 Hotel Booking System

Hệ thống đặt phòng khách sạn cho **1 khách sạn**, xây dựng với:

* Backend: Laravel
* Frontend: Next.js

---

# 📌 1. Giới thiệu

Hệ thống cho phép:

* Khách hàng tìm kiếm phòng theo ngày, số người
* Xem thông tin loại phòng
* Đặt phòng (tránh trùng lịch)
* Thanh toán (tại quầy hoặc online)
* Admin quản lý phòng và booking

---

# 🧠 2. Kiến trúc hệ thống

## 🎯 Nguyên tắc chính

* `room_types` → thông tin hiển thị (loại phòng)
* `rooms` → tài nguyên thực tế (phòng cụ thể)
* `booking_rooms` → liên kết phòng và booking
* `payments` → quản lý thanh toán

---

# 🗄️ 3. Database Design

## 🏷️ room_types

Lưu thông tin loại phòng

| Field          | Description            |
| -------------- | ---------------------- |
| id             | ID                     |
| name           | VIP, Thường, Hạng sang |
| price          | Giá                    |
| description    | Mô tả                  |
| adult_capacity | Số người lớn           |
| child_capacity | Số trẻ em              |
| bed_type       | Loại giường            |
| bed_count      | Số giường              |
| image_url      | Ảnh đại diện           |

---

## 🏨 rooms

Phòng cụ thể

| Field        | Description             |
| ------------ | ----------------------- |
| id           | ID                      |
| room_number  | vip1, vip2...           |
| room_type_id | FK                      |
| status       | available / maintenance |

---

## 👤 users

| Field    | Description      |
| -------- | ---------------- |
| id       | ID               |
| name     | Tên              |
| email    | Email            |
| password | Password         |
| role     | admin / customer |

---

## 📅 bookings

| Field       | Description                     |
| ----------- | ------------------------------- |
| id          | ID                              |
| user_id     | FK                              |
| check_in    | Ngày nhận                       |
| check_out   | Ngày trả                        |
| total_price | Tổng tiền                       |
| status      | pending / confirmed / cancelled |

---

## 🔗 booking_rooms

| Field      | Description |
| ---------- | ----------- |
| id         | ID          |
| booking_id | FK          |
| room_id    | FK          |

---

## 💳 payments

| Field          | Description             |
| -------------- | ----------------------- |
| id             | ID                      |
| booking_id     | FK                      |
| amount         | Số tiền                 |
| method         | cash / online           |
| status         | pending / paid / failed |
| transaction_id | Mã giao dịch            |
| paid_at        | Thời gian thanh toán    |

---

# 🔥 4. Logic quan trọng

## ✅ Kiểm tra phòng trống

Điều kiện overlap:

```
check_in < new_check_out
AND check_out > new_check_in
```

---

## ✅ Query phòng trống

```
SELECT * FROM rooms
WHERE room_type_id = ?
AND id NOT IN (
  SELECT room_id FROM booking_rooms br
  JOIN bookings b ON b.id = br.booking_id
  WHERE b.status != 'cancelled'
  AND (
    b.check_in < :check_out
    AND b.check_out > :check_in
  )
)
```

---

## ✅ Đếm số phòng trống theo loại

```
SELECT room_type_id, COUNT(*) as available_rooms
FROM rooms
WHERE id NOT IN (...)
GROUP BY room_type_id
```

---

# 🔒 5. Tránh overbooking

Sử dụng transaction + lock:

```php
DB::transaction(function () {
    // lock rooms
    // check availability
    // insert booking
});
```

👉 Đảm bảo:

* Không có 2 người đặt cùng 1 phòng

---

# 💳 6. Flow thanh toán

## 🧾 Thanh toán tại quầy

```
Booking → pending
→ khách đến
→ admin xác nhận
→ payment = paid
→ booking = confirmed
```

---

## 💻 Thanh toán online

```
Booking → pending
→ redirect payment
→ success → confirmed
→ fail → failed
```

---

# 🔄 7. Flow đặt phòng

1. User chọn:

   * ngày
   * số người

2. Backend:

   * lọc room_types theo capacity
   * check phòng trống

3. User chọn loại phòng

4. Backend:

   * transaction + lock
   * gán phòng cụ thể

5. Tạo booking

6. Thanh toán

---

# 🎨 8. API gợi ý

## Lấy danh sách loại phòng

```
GET /api/room-types?check_in=&check_out=&adults=&children=
```

Response:

```json
[
  {
    "id": 1,
    "name": "VIP",
    "price": 1000000,
    "image": "...",
    "available_rooms": 2,
    "capacity": {
      "adults": 2,
      "children": 1
    }
  }
]
```

---

# ⚠️ 9. Lỗi cần tránh

* Không check overlap đúng
* Không dùng transaction
* Không gán phòng cụ thể
* Lưu giá trong rooms
* Không tách payments

---

# 🚀 10. Nâng cao (future)

* Giữ phòng 15 phút (reservation hold)
* Dynamic pricing (theo ngày)
* Redis cache
* Queue xử lý booking
* Review & rating

---

# 🎯 11. Tổng kết

* `room_types` → thông tin hiển thị
* `rooms` → tài nguyên thật
* `booking_rooms` → mapping
* `payments` → xử lý tiền
* `transaction + lock` → chống overbooking

---

# 📬 12. Author

Project phục vụ mục đích học tập & xây dựng hệ thống booking thực tế.
