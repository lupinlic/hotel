import Link from "next/link";

export default function GuestsPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Khách hàng</h1>
      <p className="text-gray-600 dark:text-gray-300">Chọn chức năng quản lý khách hàng hoặc đánh giá khách.</p>
      <div className="flex flex-wrap gap-2">
        <Link href="/guests/manage" className="rounded-lg border border-brand-500 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100 dark:border-brand-300 dark:bg-brand-900 dark:text-brand-200">
          Quản lý khách hàng
        </Link>
        <Link href="/guests/reviews" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
          Đánh giá khách hàng
        </Link>
      </div>
    </div>
  );
}