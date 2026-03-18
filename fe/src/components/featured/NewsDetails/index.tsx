import React from 'react'
import { news } from "@/data/news";

function NewDetails({id}: {id: string}) {
   const item = news.find((n) => n.id === Number(id));

  if (!item) return <div>Không tìm thấy bài viết</div>;

  return (
    <div className='max-w-6xl mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-4'>{item.title}</h1>
      <span className='text-gray-500 mb-4'>
        {item.day}/{item.month}
      </span>
      <img src={item.image} alt={item.title} />
      <p className='text-lg mt-4'>{item.description}</p>
      
    </div>
  );
}

export default NewDetails