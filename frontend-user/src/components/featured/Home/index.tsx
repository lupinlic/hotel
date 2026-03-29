"use client";
import Banner from "./component/banner";
import RoomSystem from "./component/room_system";
import Introduce from "./component/introduce";
import TestimonialSection from "./component/TestimonialSection";
import NewsSection from "./component/NewsSection";

function Home() {
  return (
    <div>
      <Banner />
      <div className="max-w-6xl mx-auto py-10 flex flex-col gap-10">
        <RoomSystem />
        <Introduce /> 
      </div>
      <TestimonialSection />
      <NewsSection />
    </div>
  );
}

export default Home;
