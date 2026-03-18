import RoomView from "@/components/featured/Room"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hệ thống phòng",
}

function RoomPage() {
  return (
    <div className="max-w-6xl px-6 mx-auto py-10">
      <RoomView />
    </div>
  )
}

export default RoomPage