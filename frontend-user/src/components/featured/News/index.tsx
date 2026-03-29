import React from "react";
import { news } from "@/data/news";
import NewsCard from "@/components/shared/components/NewsCard";

function News() {
  return (
    <div className=" grid grid-cols-3 gap-6">
      {news.map((item) => (
        <NewsCard
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          image={item.image}
          day={item.day}
          month={item.month}
        />
      ))}
    </div>
  );
}

export default News;
