import NewDetails from "@/components/featured/NewsDetails";
import { Metadata } from "next";
const metadata: Metadata = {
  title: "Chi tiết tin tức",
};

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewDetail({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <NewDetails id={id} />
    </div>
  );
}