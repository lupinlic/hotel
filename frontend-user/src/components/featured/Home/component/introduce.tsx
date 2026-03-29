import React from "react";

function Introduce() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between gap-10">
        <img
          src="/image/introduce.jpg"
          alt="introduce"
          className="w-[555px] h-[640px] object-cover "
        />
        <div className="flex flex-col items-center justify-center gap-6 text-text-primary">
          <h4 className="text-3xl font-bold text-center">
            GIỚI THIỆU KHÁCH SẠN HILLTER
          </h4>
          <p className="text-[18px] text-center font-medium">
            Chúng tôi gọi nơi này là nhà, nơi tình bạn bắt đầu dù bạn đến từ đâu
            trên thế giới, có quốc tịch và màu gia ra sao.
          </p>
          <p className="text-[16px] text-center ">
            Chúng tôi yêu thiên nhiên, yêu sự khác biệt, yêu con người, yêu
            những nét văn hóa truyền thống và yêu tâm hồn bạn. Hãy đến với chúng
            tôi để cảm nhận sự trọn vẹn về một Đà Nẵng thân thiện, mến khách, để
            sống cùng nhau trong vùng âm nhạc tuyệt vời
          </p>
          <button className="px-6 py-2 bg-[#F4511E] text-white rounded-md mt-4 cursor-pointer hover:bg-[#F4511E]/80 transition">
            Xem thêm
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-10">
        <div className="flex flex-col gap-6 text-text-primary">
          <h4 className="text-3xl font-bold text-center">Dịch vụ & tiện ích</h4>
          <p className="text-16px text-center">
            Một trong những khách sạn được yêu thích nhất ở Đà Lạt, Hotel Hilter
            được công nhận là một trong những khách sạn hàng đầu của Việt Nam,
            với lòng hiếu khách của hòn đảo duyên dáng, tiện nghi chu đáo và đặc
            sắc.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <img src="/image/minibar.png" alt="icon1" className="w-16 h-16 object-cover" />
              <p className="text-lg font-semibold">Minibar</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <img src="/image/washing.png" alt="icon2" className="w-16 h-16 object-cover" />
              <p className="text-lg font-semibold">Giặt là</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <img src="/image/air.png" alt="icon3" className="w-16 h-16 object-cover" />
              <p className="text-lg font-semibold">Điều hòa</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <img src="/image/scooter.png" alt="icon1" className="w-16 h-16 object-cover" />
              <p className="text-lg font-semibold">Cho thuê xe máy</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <img src="/image/dinner.png" alt="icon2" className="w-16 h-16 object-cover" />
              <p className="text-lg font-semibold">Điểm tâm sáng</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <img src="/image/wifi.png" alt="icon3" className="w-16 h-16 object-cover" />
              <p className="text-lg font-semibold">Wifi phủ sóng</p>
            </div>

          </div>
        </div>
        <img
          src="/image/listicon.jpg"
          alt="listicon"
          className="w-[555px] h-[640px] object-cover "
        />
      </div>
    </div>
  );
}

export default Introduce;
