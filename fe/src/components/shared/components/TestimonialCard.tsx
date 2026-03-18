import Image from "next/image";

interface Props {
  name: string;
  avatar: string;
  content: string;
}

export default function TestimonialCard({ name, avatar, content }: Props) {
  return (
    <div className="bg-white p-8 text-center shadow-md relative">
      
      {/* quote */}
      <div className="text-red-500 text-4xl mb-4">❝</div>

      {/* content */}
      <p className="text-gray-700 leading-relaxed mb-6 line-clamp-5">
        {content}
      </p>

      {/* avatar */}
      <div className="flex flex-col items-center">
        <div className="relative w-14 h-14 mb-2">
          <Image
            src={avatar}
            alt={name}
            fill
            className="rounded-full object-cover"
          />
        </div>

        <span className="text-gray-700 font-medium">{name}</span>
      </div>
    </div>
  );
}