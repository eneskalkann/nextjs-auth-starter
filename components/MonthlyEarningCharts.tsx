"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Spinner from "./ui/Spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyEarningCharts() {
  const [data, setData] = useState<{ date: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/daily-earnings")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner overlay />;

  // Toplam kazancı hesapla
  const totalEarnings = data.reduce((sum, d) => sum + d.total, 0);
  const formattedTotal = totalEarnings.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
  });

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        data: data.map((d) => d.total),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 2,
      },
    ],
  };

  return (
    <div className="bg-transparent">
      <div className="mb-4 text-lg font-bold text-left ">{formattedTotal}</div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              ticks: {
                callback: function (
                  this: any,
                  val: any,
                  index: any,
                  ticks: any[]
                ) {
                  // Sadece 0, 7, 14, 21. indexlerde label göster
                  // labels dizisini kullanarak label'ı doğrudan al
                  // @ts-ignore
                  const labels =
                    (this.getLabels
                      ? this.getLabels()
                      : this.chart.data.labels) || [];
                  return index % 7 === 0 ? String(labels[index] ?? "") : "";
                } as (this: any, val: any, index: any, ticks: any[]) => string,
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
              },
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 100,
                callback: (value: string | number) =>
                  typeof value === "number"
                    ? value.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })
                    : value,
              },
            },
          },
        }}
      />
    </div>
  );
}
