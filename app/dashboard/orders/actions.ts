"use server";

import { authOptions } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function getOrders() {
  try {
    const orders = await prisma.$queryRaw`
      SELECT 
        o.*, 
        o."isNew" as "isNew",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email
        ) as user,
        (
          SELECT json_agg(
            json_build_object(
              'id', oi.id,
              'productId', oi."productId",
              'quantity', oi.quantity,
              'price', oi.price,
              'createdAt', oi."createdAt",
              'product', json_build_object(
                'id', p.id,
                'title', p.title
              )
            )
          )
          FROM "OrderItem" oi
          JOIN "Product" p ON oi."productId" = p.id
          WHERE oi."orderId" = o.id
        ) as items
      FROM "Order" o
      JOIN "User" u ON o."userId" = u.id
      ORDER BY o."createdAt" DESC
    `;

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
