"use server";

import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getCustomers() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  try {
    const customers = await prisma.user.findMany({
      where: {
        orders: {
          some: {
            items: {
              some: {
                product: {
                  adminId: session.user.id,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        orders: {
          where: {
            items: {
              some: {
                product: {
                  adminId: session.user.id,
                },
              },
            },
          },
          select: { id: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return customers;
  } catch (error) {
    console.error("Müşteriler alınırken hata oluştu:", error);
    throw new Error("Müşteriler alınırken bir hata oluştu");
  }
}

export async function getCustomerDetail(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  try {
    const customer = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    const orders = await prisma.order.findMany({
      where: {
        userId: id,
        items: {
          some: {
            product: {
              adminId: session.user.id,
            },
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { customer, orders };
  } catch (error) {
    console.error("Müşteri detayı alınırken hata oluştu:", error);
    throw new Error("Müşteri detayı alınırken bir hata oluştu");
  }
}
