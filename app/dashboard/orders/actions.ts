"use server";

import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getOrders() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  try {
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              adminId: session.user.id,
            },
          },
        },
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { data: orders, error: null };
  } catch (error) {
    console.error("Siparişler alınırken hata oluştu:", error);
    return {
      data: null,
      error: "Siparişler alınırken bir hata oluştu",
    };
  }
}

export async function getOrderById(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              images: true,
              price: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
}

export async function markOrderAsRead(orderId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { isNew: false },
  });
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });
  return order;
}

export async function updateOrderStatusAction(
  orderId: string,
  prevState: any,
  formData: FormData
) {
  "use server";
  const newStatus = formData.get("status") as string;
  await updateOrderStatus(orderId, newStatus);
  return { status: newStatus };
}
