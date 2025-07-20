import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { subDays, startOfDay } from "date-fns";

export async function getDashboardSummary() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Tek seferde tüm verileri çek
  const [orders, products, topProducts, orderItems] = await Promise.all([
    prisma.order.findMany({
      where: {
        items: {
          some: {
            product: { adminId: session.user.id },
          },
        },
      },
      select: {
        id: true,
        status: true,
      },
    }),
    prisma.product.count({
      where: { adminId: session.user.id },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        product: { adminId: session.user.id },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 3,
    }),
    prisma.orderItem.findMany({
      where: {
        order: { status: "delivered" },
        product: { adminId: session.user.id },
      },
      select: {
        quantity: true,
        price: true,
      },
    }),
  ]);

  // Ürünlerden gelen toplam kazanç (tamamlanan siparişlerdeki ürünler)
  const totalProductEarnings = orderItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // Toplam kazanç (tamamlanan siparişler)
  const totalSales = orders.filter((o) => o.status === "completed").length;

  // Sipariş durumlarına göre sayılar
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // topProducts'tan ürün detaylarını çek
  type TopProduct = { productId: number; _sum: { quantity: number } };
  const topProductsTyped = topProducts as TopProduct[];
  const topProductDetails = await Promise.all(
    topProductsTyped.map(async (tp) => {
      const product = await prisma.product.findUnique({
        where: { id: tp.productId },
        select: {
          id: true,
          slug: true,
          title: true,
          images: { select: { url: true } },
          createdAt: true,
          price: true,
        },
      });
      return {
        ...product,
        sold: tp._sum.quantity || 0,
      };
    })
  );

  return {
    totalProductCount: products,
    totalSales,
    statusCounts,
    topProducts: topProductDetails,
    totalProductEarnings,
  };
}

export async function getDailyEarningsLastMonth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const startDate = startOfDay(subDays(new Date(), 29)); // 30 gün önce
  const endDate = new Date();

  // Tüm delivered orderItem'ları çek
  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        status: "delivered",
        createdAt: { gte: startDate, lte: endDate },
      },
      product: { adminId: session.user.id },
    },
    select: {
      quantity: true,
      price: true,
      order: { select: { createdAt: true } },
    },
  });

  // Günlük toplamları hesapla
  const dailyTotals: Record<string, number> = {};
  for (let i = 0; i < 28; i++) {
    const date = startOfDay(subDays(endDate, 27 - i));
    const key = date.toISOString().slice(0, 10);
    dailyTotals[key] = 0;
  }
  items.forEach((item) => {
    const key = startOfDay(item.order.createdAt).toISOString().slice(0, 10);
    if (dailyTotals[key] !== undefined) {
      dailyTotals[key] += item.quantity * item.price;
    }
  });

  // Diziye çevir
  return Object.entries(dailyTotals).map(([date, total]) => ({ date, total }));
}
