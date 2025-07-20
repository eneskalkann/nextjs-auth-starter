"use client";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Spinner from "./ui/Spinner";

ChartJS.register(ArcElement, Tooltip, Legend);

// orders/page.tsx'daki status-color ve status-turkce eşleşmesi
const statusMap: Record<string, string> = {
  processing: "İşleniyor",
  preparing: "Hazırlanıyor",
  shipping: "Kargoda",
  delivered: "Teslim Edildi",
  completed: "Tamamlandı",
  cancelled: "İptal Edildi",
  pending: "Beklemede",
  paid: "Ödendi",
};
const colorMap: Record<string, string> = {
  processing: "#fef08a", // bg-yellow-100
  preparing: "#dbeafe", // bg-blue-100
  shipping: "#ffedd5", // bg-orange-100
  delivered: "#bbf7d0", // bg-green-100
  completed: "#bbf7d0", // bg-green-100
  cancelled: "#fecaca", // bg-red-100
  pending: "#fef08a", // bg-yellow-100
  paid: "#bbf7d0", // bg-green-100
};

export default function OrderStatusPieChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/orders-status-distribution")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner overlay />;

  const labels = data.map((d) => statusMap[d.status] || d.status);
  const counts = data.map((d) => d.count);
  const backgroundColors = labels.map(
    (_, i) => colorMap[data[i].status] || "#e5e7eb"
  );
  const borderColors = labels.map(() => "#fff");

  const chartData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Pie
        data={chartData}
        options={{ plugins: { legend: { position: "bottom" } } }}
      />
    </div>
  );
}
