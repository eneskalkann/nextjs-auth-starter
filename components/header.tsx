"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getOrders } from "@/app/dashboard/orders/actions";
import { useNewOrder } from "@/lib/context/NewOrderContext";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { newOrdersCount, setNewOrdersCount } = useNewOrder();

  useEffect(() => {
    const fetchNewOrders = async () => {
      try {
        const { data } = await getOrders();
        if (data && Array.isArray(data)) {
          const count = data.filter((order: any) => order.isNew).length;
          setNewOrdersCount(count);
        } else {
          setNewOrdersCount(0);
        }
      } catch {
        setNewOrdersCount(0);
      }
    };
    fetchNewOrders();
  }, [setNewOrdersCount]);

  return (
    <header className="w-full h-full px-10 py-12 bg-transparent">
      <nav className="flex flex-col justify-between items-center h-full">
        <div className="flex flex-col items-center h-full">
          {session ? (
            <div className="flex flex-col justify-between h-full">
              <div className="">
                <div className="w-20 relative h-20 rounded-xl bg-gray-400 text-white flex items-center justify-center font-bold">
                  V
                  <div>
                    {newOrdersCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 px-2 py-0.5 text-xs"
                      >
                        {newOrdersCount}
                      </Badge>
                    )}
                  </div>
                </div>
                {session.user?.name && (
                  <div className="text-2xl font-bold text-white mt-[2px]">
                    {session.user.name}
                  </div>
                )}
                <div className="text-md mt-[2px] text-gray-400">
                  {session.user?.email}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href="/dashboard/products"
                  className={cn(
                    "text-4xl font-bold",
                    pathname.startsWith("/dashboard/products")
                      ? "text-zinc-400"
                      : "text-white hover:text-zinc-300 transition-all"
                  )}
                >
                  Products
                </Link>
                <Link
                  href="/dashboard/orders"
                  className={cn(
                    "text-4xl font-bold relative flex items-center",
                    pathname.startsWith("/dashboard/orders")
                      ? "text-zinc-400"
                      : "text-white hover:text-zinc-300 transition-all"
                  )}
                >
                  Orders
                  {newOrdersCount > 0 && (
                    <span className="ml-2 w-2 h-2 rounded-full bg-destructive"></span>
                  )}
                </Link>
                <Link
                  href="/dashboard/users/new"
                  className={cn(
                    "text-4xl font-bold",
                    pathname.startsWith("/dashboard/users")
                      ? "text-zinc-400"
                      : "text-white hover:text-zinc-300 transition-all"
                  )}
                >
                  Users
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => signOut()}
                  className="flex gap-2 text-xl items-center text-white transition-all hover:text-zinc-300"
                >
                  <LogOutIcon />
                  Sign Out
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
