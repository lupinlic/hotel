import TestimonialCard from "@/components/shared/components/TestimonialCard";
import { testimonials } from "@/data/testimonials";

export default function TestimonialSection() {
  return (
    <section className="bg-gradient-to-r from-sky-400 to-sky-300 py-20">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-center text-white text-3xl font-semibold mb-12">
          Hơn 1.000 đánh giá tuyệt vời
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <TestimonialCard
              key={item.id}
              name={item.name}
              avatar={item.avatar}
              content={item.content}
            />
          ))}
        </div>

      </div>
    </section>
  );
}