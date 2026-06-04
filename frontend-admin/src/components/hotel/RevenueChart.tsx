"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import { getDashboardRevenue } from "@/services/dashboardService";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Period = "day" | "week" | "month" | "quarter" | "year";

type RevenueChartProps = {
  revenueData?: Array<{ label: string; total_revenue: number }>;
  onPeriodChange?: (period: Period) => void;
};

export default function RevenueChart({
  revenueData = [
    { label: "Jan", total_revenue: 120000 },
    { label: "Feb", total_revenue: 98000 },
    { label: "Mar", total_revenue: 143000 },
    { label: "Apr", total_revenue: 116000 },
    { label: "May", total_revenue: 152000 },
    { label: "Jun", total_revenue: 137000 },
  ],
  onPeriodChange,
}: RevenueChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("day");
  const [data, setData] = useState(revenueData);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const startRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // attach flatpickr instances
    let startFp: any = null;
    let endFp: any = null;

    if (startRef.current) {
      startFp = flatpickr(startRef.current, {
        dateFormat: "Y-m-d",
        allowInput: true,
        defaultDate: startDate || undefined,
        onChange: (selectedDates: Date[]) => {
          if (selectedDates && selectedDates.length) setStartDate(formatDate(selectedDates[0]));
        },
      });
    }

    if (endRef.current) {
      endFp = flatpickr(endRef.current, {
        dateFormat: "Y-m-d",
        allowInput: true,
        defaultDate: endDate || undefined,
        onChange: (selectedDates: Date[]) => {
          if (selectedDates && selectedDates.length) setEndDate(formatDate(selectedDates[0]));
        },
      });
    }

    return () => {
      if (startFp && typeof startFp.destroy === "function") startFp.destroy();
      if (endFp && typeof endFp.destroy === "function") endFp.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const labels = data.map((item) => item.label);
  const totals = data.map((item) => item.total_revenue);

  const periodLabels: Record<Period, string> = {
    day: "Ngày",
    week: "Tuần",
    month: "Tháng",
    quarter: "Quý",
    year: "Năm",
  };

  const formatDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const getISOWeek = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return { year: date.getUTCFullYear(), week: weekNo };
  };

  const buildPeriodRange = (period: Period, count = 5) => {
    const end = new Date();
    const labels: string[] = [];

    for (let i = count - 1; i >= 0; i--) {
      if (period === "day") {
        const d = new Date();
        d.setDate(end.getDate() - i);
        labels.push(formatDate(d));
      } else if (period === "week") {
        const d = new Date();
        d.setDate(end.getDate() - i * 7);
        const w = getISOWeek(d);
        labels.push(`${w.year}-W${String(w.week).padStart(2, "0")}`);
      } else if (period === "month") {
        const d = new Date(end.getFullYear(), end.getMonth() - i, 1);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        labels.push(`${yyyy}-${mm}`);
      } else if (period === "quarter") {
        const monthIndex = end.getMonth();
        const currentQuarter = Math.floor(monthIndex / 3) + 1;
        const qIndex = currentQuarter - i; // this may go negative across years
        const qDate = new Date(end.getFullYear(), (currentQuarter - 1) * 3, 1);
        qDate.setMonth(qDate.getMonth() - i * 3);
        const qYear = qDate.getFullYear();
        const q = Math.floor(qDate.getMonth() / 3) + 1;
        labels.push(`${qYear}-Q${q}`);
      } else if (period === "year") {
        const d = new Date(end.getFullYear() - i, 0, 1);
        labels.push(String(d.getFullYear()));
      }
    }

    // compute full start/end for API call (from first label's first day to last label's last day)
    let start = labels[0];
    let endStr = labels[labels.length - 1];
    // normalize start/end to YYYY-MM-DD for API
    if (period === "day") {
      // already YYYY-MM-DD
    } else if (period === "week") {
      // start: take Monday of first week; end: Sunday of last week
      const [sYear, sWeekRaw] = start.split("-W");
      const sWeek = Number(sWeekRaw);
      const firstWeekDate = new Date(Number(sYear), 0, 1 + (sWeek - 1) * 7);
      start = formatDate(firstWeekDate);

      const [eYear, eWeekRaw] = endStr.split("-W");
      const eWeek = Number(eWeekRaw);
      const lastWeekDate = new Date(Number(eYear), 0, 1 + (eWeek - 1) * 7 + 6);
      endStr = formatDate(lastWeekDate);
    } else if (period === "month") {
      start = `${start}-01`;
      const [eyear, emonth] = endStr.split("-");
      const lastDay = new Date(Number(eyear), Number(emonth), 0).getDate();
      endStr = `${eyear}-${emonth}-${String(lastDay).padStart(2, "0")}`;
    } else if (period === "quarter") {
      const [sYear, sQ] = start.split("-Q");
      const sQnum = Number(sQ);
      const sMonth = (sQnum - 1) * 3 + 1;
      start = `${sYear}-${String(sMonth).padStart(2, "0")}-01`;
      const [eYear, eQ] = endStr.split("-Q");
      const eQnum = Number(eQ);
      const eMonth = eQnum * 3;
      const lastDay = new Date(Number(eYear), eMonth, 0).getDate();
      endStr = `${eYear}-${String(eMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    } else if (period === "year") {
      start = `${start}-01-01`;
      endStr = `${endStr}-12-31`;
    }

    return { labels, start, end: endStr };
  };

  const handlePeriodChange = async (period: Period) => {
    setSelectedPeriod(period);
    if (onPeriodChange) {
      onPeriodChange(period);
    }

    try {
      setIsLoading(true);
      const { labels: expectedLabels, start, end } = buildPeriodRange(period, 5);
      const result = await getDashboardRevenue({ period, start, end });

      // map result for quick lookup
      const map: Record<string, number> = {};
      (result.data || []).forEach((r: any) => {
        map[String(r.label)] = Number(r.total_revenue ?? r.total ?? 0);
      });

      const filled = expectedLabels.map((lbl) => ({ label: lbl, total_revenue: map[lbl] || 0 }));
      setData(filled);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Error loading revenue data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThongKe = async () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc");
      return;
    }

    try {
      setIsLoading(true);
      const result = await getDashboardRevenue({ start: startDate, end: endDate, period: selectedPeriod });

      // build expected labels between start and end according to selectedPeriod
      const buildBetween = (period: Period, startStr: string, endStr: string) => {
        const labels: string[] = [];
        const s = new Date(startStr);
        const e = new Date(endStr);
        if (period === "day") {
          for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
            labels.push(formatDate(new Date(d)));
          }
        } else if (period === "week") {
          // weeks by ISO week of Monday
          const cur = new Date(s);
          // move to start of week (Monday)
          while (cur.getDay() !== 1) cur.setDate(cur.getDate() + 1);
          while (cur <= e) {
            const w = getISOWeek(new Date(cur));
            labels.push(`${w.year}-W${String(w.week).padStart(2, "0")}`);
            cur.setDate(cur.getDate() + 7);
          }
        } else if (period === "month") {
          const cur = new Date(s.getFullYear(), s.getMonth(), 1);
          while (cur <= e) {
            labels.push(`${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`);
            cur.setMonth(cur.getMonth() + 1);
          }
        } else if (period === "quarter") {
          const startQuarter = Math.floor(s.getMonth() / 3) + 1;
          let curYear = s.getFullYear();
          let curQuarter = startQuarter;
          while (true) {
            labels.push(`${curYear}-Q${curQuarter}`);
            // advance quarter
            curQuarter++;
            if (curQuarter > 4) {
              curQuarter = 1;
              curYear++;
            }
            // break if beyond end
            const qMonth = (curQuarter - 1) * 3 + 1;
            const qDate = new Date(curYear, qMonth - 1, 1);
            if (qDate > e) break;
          }
        } else if (period === "year") {
          for (let y = s.getFullYear(); y <= e.getFullYear(); y++) labels.push(String(y));
        }
        return labels;
      };

      const expectedLabels = buildBetween(selectedPeriod, startDate, endDate);
      const map: Record<string, number> = {};
      (result.data || []).forEach((r: any) => {
        map[String(r.label)] = Number(r.total_revenue ?? r.total ?? 0);
      });
      const filled = expectedLabels.map((lbl) => ({ label: lbl, total_revenue: map[lbl] || 0 }));
      setData(filled);
    } catch (error) {
      console.error("Error loading revenue data:", error);
      alert("Lỗi khi tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // on mount, load latest 5 periods for the default selectedPeriod (day)
  useEffect(() => {
    // call the period loader once on mount
    handlePeriodChange(selectedPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 5,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        sizeOffset: 0,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(val),
      style: {
        colors: ["#1f2937"],
        fontSize: "12px",
        fontWeight: "600",
      },
      offsetY: -12,
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      enabled: false,
    },
    xaxis: {
      type: "category",
      categories: labels,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: (val: number) => {
          if (val >= 1000000) {
            return `${(val / 1000000).toFixed(0)}M`;
          }
          if (val >= 1000) {
            return `${(val / 1000).toFixed(0)}K`;
          }
          return val.toFixed(0);
        },
      },
    },
  };

  const series = [
    {
      name: "Doanh Thu",
      data: totals,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Doanh thu
          </h3>
          <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
            Theo dõi doanh thu đặt phòng
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3">
          {/* Period buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {(["day", "week", "month", "quarter", "year"] as Period[]).map(
              (period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  disabled={isLoading}
                >
                  {periodLabels[period]}
                </button>
              )
            )}
          </div>

          {/* Date range inputs */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-2">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Từ ngày
              </label>
              <input
                ref={startRef}
                type="text"
                value={startDate}
                readOnly
                placeholder="YYYY-MM-DD"
                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 cursor-pointer"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Đến ngày
              </label>
              <input
                ref={endRef}
                type="text"
                value={endDate}
                readOnly
                placeholder="YYYY-MM-DD"
                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 cursor-pointer"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleThongKe}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Đang tải..." : "Thống kê"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-[310px]">
              <div className="text-gray-500">Đang tải dữ liệu...</div>
            </div>
          ) : (
            <Chart options={options} series={series} type="area" height={310} />
          )}
        </div>
      </div>
    </div>
  );
}