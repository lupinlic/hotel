import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giới thiệu Marriott',
  description: 'Khám phá không gian sang trọng, dịch vụ cao cấp và trải nghiệm đẳng cấp tại khách sạn Marriott.',
}

function IntroducePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 text-gray-900">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 p-10 text-white shadow-xl animate-fade-in-up">
        <div className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-300">Khởi nguồn hành trình</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">Chào mừng đến với Marriott</h1>
          <p className="mx-auto max-w-3xl text-base leading-8 sm:text-lg text-slate-200">
            Trải nghiệm đẳng cấp quốc tế tại Marriott, nơi sang trọng, tiện nghi và dịch vụ tận tâm hòa quyện
            để tạo nên kỳ nghỉ hoàn hảo cho gia đình, cặp đôi và doanh nhân.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-5 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-xl font-semibold">Vị trí đắc địa</h2>
              <p className="mt-2 text-sm text-slate-200">Gần trung tâm thành phố, sân bay và các điểm du lịch nổi tiếng.</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-xl font-semibold">Không gian tinh tế</h2>
              <p className="mt-2 text-sm text-slate-200">Phòng nghỉ hiện đại, nội thất sang trọng và tầm nhìn thư giãn.</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-xl font-semibold">Dịch vụ hoàn hảo</h2>
              <p className="mt-2 text-sm text-slate-200">Đội ngũ chuyên nghiệp phục vụ 24/7, đáp ứng mọi nhu cầu của khách hàng.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8 rounded-3xl bg-white p-8 shadow-md animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div>
            <h2 className="text-3xl font-semibold">Giới thiệu về Marriott</h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              Marriott là biểu tượng của sự sang trọng và phong cách. Với không gian thiết kế tinh tế, tiện nghi hiện đại và
              dịch vụ khách hàng tận tâm, chúng tôi mang đến cho bạn kỳ nghỉ hoàn hảo ngay trong lòng thành phố.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 p-6 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              <h3 className="text-xl font-semibold">Phòng nghỉ</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Từ phòng Premium đến suite cao cấp, mỗi phòng đều được thiết kế để mang lại sự thư giãn tối đa và tiện nghi hàng đầu.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-6 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl font-semibold">Ẩm thực</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Nhà hàng đa dạng ẩm thực quốc tế, quầy bar sang trọng và phòng trà ấm cúng là nơi bạn tận hưởng những trải nghiệm vị giác đỉnh cao.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-6 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <h3 className="text-xl font-semibold">Sự kiện & Hội nghị</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Không gian hội nghị hiện đại, trang thiết bị tối tân cùng dịch vụ tổ chức chuyên nghiệp cho sự kiện doanh nghiệp và tiệc cưới.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-6 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-xl font-semibold">Tiện ích thư giãn</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Spa, hồ bơi, phòng gym và khu vực thư giãn được thiết kế để tiếp thêm năng lượng cho du khách.
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-8 rounded-3xl bg-slate-900 p-8 text-white shadow-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Ưu đãi đặc biệt</p>
            <h3 className="text-2xl font-semibold">Ưu đãi khách đặt phòng trực tuyến</h3>
            <p className="text-sm leading-7 text-slate-300">
              Đặt trực tiếp để nhận giá ưu đãi, bữa sáng miễn phí và nâng hạng phòng tùy vào tình trạng.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-800 p-6 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Liên hệ</p>
            <p className="mt-4 text-base font-medium">Marriott Hotel</p>
            <p className="mt-2 text-sm text-slate-300">Địa chỉ: Số 123, Đại lộ Trung tâm, Thành phố</p>
            <p className="mt-2 text-sm text-slate-300">Điện thoại: +84 123 456 789</p>
            <p className="mt-2 text-sm text-slate-300">Email: info@marriott.vn</p>
          </div>

          <div className="rounded-3xl bg-slate-800 p-6 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-xl">
            <h4 className="text-lg font-semibold">Mục tiêu của chúng tôi</h4>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Cung cấp trải nghiệm nghỉ dưỡng đáng nhớ với tiêu chuẩn quốc tế, không gian ấm cúng và chăm sóc tận tâm.
            </p>
          </div>
        </aside>
      </section>

      <section className="mt-12 rounded-3xl bg-white p-8 shadow-md animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Trải nghiệm</p>
            <h2 className="text-2xl font-semibold">Khám phá Marriott</h2>
          </div>

          <div className="rounded-3xl border border-slate-200 p-6 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-xl">
            <h3 className="text-xl font-semibold">Phòng sang trọng</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Phòng ngủ rộng rãi, giường êm ái và nội thất hiện đại, phù hợp cho kỳ nghỉ thư giãn hoặc chuyến công tác.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 p-6 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-xl">
            <h3 className="text-xl font-semibold">Dịch vụ 5 sao</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Từ lễ tân tới dịch vụ phòng, mỗi chi tiết đều được chăm chút và thực hiện bởi đội ngũ chuyên nghiệp.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default IntroducePage