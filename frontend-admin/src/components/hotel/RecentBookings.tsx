import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

type RecentBooking = {
  id: number;
  guestName: string;
  room: string;
  dates: string;
  amount: string;
  status: "Confirmed" | "Pending" | "Canceled";
};

type RecentBookingsProps = {
  bookings?: RecentBooking[];
};

const defaultData: RecentBooking[] = [
  {
    id: 1,
    guestName: "Nguyễn Văn A",
    room: "Superior - 201",
    dates: "15/05 - 18/05",
    amount: "₫3,600,000",
    status: "Confirmed",
  },
  {
    id: 2,
    guestName: "Lê Thị B",
    room: "Deluxe - 304",
    dates: "16/05 - 17/05",
    amount: "₫1,800,000",
    status: "Pending",
  },
  {
    id: 3,
    guestName: "Trần Văn C",
    room: "Presidential - 501",
    dates: "14/05 - 19/05",
    amount: "₫10,800,000",
    status: "Confirmed",
  },
  {
    id: 4,
    guestName: "Phạm Thị D",
    room: "Standard - 106",
    dates: "17/05 - 18/05",
    amount: "₫900,000",
    status: "Canceled",
  },
  {
    id: 5,
    guestName: "Hoàng Minh E",
    room: "Suite - 402",
    dates: "18/05 - 21/05",
    amount: "₫4,500,000",
    status: "Confirmed",
  },
];

export default function RecentBookings({ bookings = defaultData }: RecentBookingsProps) {
  // Sort bookings: pending first, then confirmed, then canceled
  const sortedBookings = [...bookings].sort((a, b) => {
    const statusOrder = { "Pending": 0, "Confirmed": 1, "Canceled": 2 };
    const orderA = statusOrder[a.status] ?? 3;
    const orderB = statusOrder[b.status] ?? 3;
    return orderA - orderB;
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Đặt phòng gần đây
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200">
            Lọc
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200">
            Xem tất cả
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-full">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Khách hàng
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Phòng
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Ngày
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Số tiền
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Trạng thái
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {sortedBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">{booking.guestName}</TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{booking.room}</TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{booking.dates}</TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{booking.amount}</TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={booking.status === "Confirmed" ? "success" : booking.status === "Pending" ? "warning" : "error"}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
