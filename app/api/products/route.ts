import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const productsPerPage = 10;
  const offset = (page - 1) * productsPerPage;

  try {
    const products = await prisma.product.findMany({
      skip: offset,
      take: productsPerPage,
      orderBy: { createdAt: "desc" },
      where: {
        adminId: url.searchParams.get("adminId") as string,
      },
      include: {
        categories: true,
        tags: true,
        images: true,
      },
    });

    const totalProducts = await prisma.product.count({
      where: {
        adminId: url.searchParams.get("adminId") as string,
      },
    });
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    return NextResponse.json({ products, totalPages });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
