import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Liên hệ",
}

function ContactPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 text-slate-900">
      <section className="rounded-3xl bg-slate-100 p-10 text-slate-900 shadow-xl">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Liên hệ</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">Kết nối với Marriott</h1>
          <p className="mx-auto max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            Chúng tôi sẵn sàng hỗ trợ bạn với mọi yêu cầu đặt phòng, tổ chức sự kiện hoặc đặt dịch vụ tại khách sạn.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8 rounded-3xl bg-white p-8 shadow-md">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-slate-900">Thông tin liên hệ</h2>
            <p className="text-base leading-7 text-slate-600">
              Bạn có thể liên hệ với chúng tôi qua điện thoại, email hoặc truy cập trực tiếp tại khách sạn.
              Đội ngũ Marriott luôn sẵn sàng mang đến trải nghiệm tốt nhất cho bạn.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900">Địa chỉ</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Số 123 Đại lộ Trung tâm, Quận 1, Thành phố Hồ Chí Minh
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900">Điện thoại</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">+84 123 456 789</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900">Email</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">info@marriott.vn</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900">Giờ làm việc</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                24/7 cho lễ tân và dịch vụ phòng; Bộ phận đặt phòng: 08:00 - 22:00
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Yêu cầu đặc biệt</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Nếu bạn cần đặt phòng nhóm, tổ chức sự kiện hoặc yêu cầu dịch vụ riêng, hãy liên hệ trước để chúng tôi phục vụ bạn nhanh chóng nhất.
            </p>
          </div>
        </div>

        <aside className="rounded-3xl bg-slate-50 p-6 shadow-lg">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Bản đồ</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">Vị trí Marriott</h3>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <iframe
                title="Bản đồ Marriott Hotel"
                src="https://www.google.com/maps?q=Marriott+Hotel+Ho+Chi+Minh+City&z=15&output=embed"
                className="h-[420px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Lưu ý</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Bản đồ chỉ mang tính chất tham khảo. Bạn nên xác nhận lại địa điểm khi đặt vé hoặc đến nhận phòng.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default ContactPage