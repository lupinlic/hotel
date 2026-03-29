import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-6xl font-bold">404</h1>

      <p className="text-gray-500">
        Trang bạn tìm không tồn tại
      </p>

      <Link
        href="/"
        className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
      >
        Về trang chủ
      </Link>
    </div>
  );
}