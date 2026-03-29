import NewsCard from "@/components/shared/components/NewsCard";
import { news } from "@/data/news";

export default function NewsSection() {
  return (
    <section className="py-16 bg-gray-100 max-w-6xl mx-auto px-6">
      <div className="container mx-auto">

        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-12">
          Khám phá & du lịch
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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

      </div>
    </section>
  );
}