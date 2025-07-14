import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/cn";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

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
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-2 border-gray-400 rounded-lg p-4">
          <h2 className="text-lg font-medium mb-2">New Orders</h2>
          {orders.map((order, ind) => (
            <div key={order.id} className="border-t-2 pb-2">
              <span>{order.id}</span>
              <div className="mb-1">
                Toplam Tutar:{" "}
                <span className="font-bold">{order.totalPrice} ₺</span>
              </div>
              <div className="mb-1">
                Ödeme Durumu:{" "}
                <span className="font-bold">{order.paymentStatus}</span>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
