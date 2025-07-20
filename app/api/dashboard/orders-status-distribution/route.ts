import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  // Tüm siparişlerin statuslerine göre gruplandırılmış sayısını al
  const result = await prisma.order.groupBy({
    by: ["status"],
    _count: { status: true },
  });
  // { status: 'delivered', _count: { status: 5 } } => { status: 'delivered', count: 5 }
  type GroupByResult = { status: string; _count: { status: number } };
  const data = (result as GroupByResult[]).map((r) => ({
    status: r.status,
    count: r._count.status,
  }));
  return NextResponse.json(data);
}
