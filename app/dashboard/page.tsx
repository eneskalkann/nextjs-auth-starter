import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import {
  BanknoteArrowUp,
  ChartLine,
  ChartPie,
  ShoppingCart,
  SmilePlus,
  Truck,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getDashboardSummary, getDailyEarningsLastMonth } from "./actions";
import MonthlyEarningCharts from "@/components/MonthlyEarningCharts";
import OrderStatusPieChart from "@/components/OrderStatusPieChart";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const summary = await getDashboardSummary();
  const dailyEarnings = await getDailyEarningsLastMonth();
  const last28Total = dailyEarnings.reduce((sum, d) => sum + d.total, 0);

  // Son 3 order'ı çek
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      user: { select: { name: true } },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Anaysayfa</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 col-span-1 bg-gray-100 rounded-lg p-6 flex gap-6">
          <div className=" w-1/3 border-r border-gray-400 flex gap-2">
            <div className="bg-purple-100 w-fit p-5 rounded-lg">
              <BanknoteArrowUp className="text-purple-700" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-500">Toplam Kazanç</span>
              <span className="text-purple-700 text-xl font-bold">
                {summary.totalProductEarnings.toLocaleString("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                })}
              </span>
            </div>
          </div>
          <div className=" w-1/3 border-r border-gray-400 flex gap-2">
            <div className="bg-blue-100 w-fit p-5 rounded-lg">
              <ShoppingCart className="text-blue-400" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-500">Toplam Ürün</span>
              <span className="text-blue-400 text-xl font-bold">
                {summary.totalProductCount}
              </span>
            </div>
          </div>
          <div className=" w-1/3 flex gap-2">
            <div className="bg-pink-100 w-fit p-5 rounded-lg">
              <Truck className="text-pink-500" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-500">Tamamlanan Satış</span>
              <span className="text-pink-500 text-xl font-bold">
                {summary.statusCounts.delivered ?? 0}
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-3 md:col-span-2 bg-gray-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-500 text-lg font-semibold">
              Son 28 günlük gelir
            </h2>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartLine className="text-purple-700" />
            </div>
          </div>
          <div className="mt-1">
            <MonthlyEarningCharts />
          </div>
        </div>
        <div className="col-span-3 md:col-span-1 rounded-lg bg-gray-100 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-500 text-lg font-semibold">
              Sipariş dağılımı
            </h2>
            <div className="p-3 bg-green-100 rounded-lg">
              <ChartPie className="text-green-500" />
            </div>
          </div>
          <div className="w-full h-full flex items-center justify-center">
            <OrderStatusPieChart />
          </div>
        </div>
        <div className="col-span-3 md:col-span-3 rounded-lg bg-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-500 text-lg font-semibold">
                En iyi ürünler
              </h2>
              <p className="text-gray-400 text-sm font-normal">
                En çok satanlar ürünlerin
              </p>
            </div>
            <div className=" bg-rose-100 rounded-lg p-3">
              <SmilePlus className="text-rose-400" />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-1 mt-3">
            <div className=" col-span-2">Ürün ismi</div>
            <div className=" col-span-2">Eklendiği tarih</div>
            <div className=" col-span-1">Fiyatı</div>
            <div className=" col-span-1">Toplam satış</div>
            {summary.topProducts.map((product: any) => (
              <Link
                href={product.slug}
                key={product.id}
                className="bg-white rounded-lg shadow p-4 col-span-6 grid grid-cols-6 gap-1 mt-2 w-full items-center"
              >
                <div className="relative flex gap-1 items-center col-span-2">
                  <Image
                    src={product.images?.[0]?.url || ""}
                    alt={product.title}
                    width={100}
                    height={100}
                    sizes="5vw"
                    className="rounded-lg"
                  />
                  <div className="font-semibold text-center mb-1 text-gray-400">
                    {product.title}
                  </div>
                </div>
                <div className="text-md font-semibold text-gray-400 mb-1 col-span-2">
                  {new Date(product.createdAt).toLocaleDateString("tr-TR")}
                </div>
                <div className="text-md font-semibold text-gray-400 mb-1 col-span-1">
                  {product.price.toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })}
                </div>
                <div className="text-md text-gray-400 font-semibold col-span-1">
                  {product.sold} adet satıldı
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
