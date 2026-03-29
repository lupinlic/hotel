import RoomDetails from "@/components/featured/Room_type";
import { Metadata } from "next";
const metadata: Metadata = {
  title: "Chi tiết phòng",
};

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoomDetail({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <RoomDetails id={id} />
    </div>
  );
}