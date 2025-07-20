import { NextResponse } from "next/server";
import { getDailyEarningsLastMonth } from "@/app/dashboard/actions";

export async function GET() {
  const data = await getDailyEarningsLastMonth();
  return NextResponse.json(data);
}
