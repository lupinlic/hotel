import React from "react";
import { Metadata } from "next";
import News from "@/components/featured/News";

export const metadata: Metadata = {
  title: "Tin tức",
};

function NewsPage() {
  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Tin tức</h1>
      <News />
    </div>
  );
}

export default NewsPage;
