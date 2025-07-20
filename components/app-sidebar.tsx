"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  ShoppingCart,
  Users,
  ListOrdered,
  LogOutIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const items = [
  { title: "Anasayfa", url: "/dashboard", icon: Home },
  { title: "Ürünler", url: "/dashboard/products", icon: ShoppingCart },
  { title: "Siparişler", url: "/dashboard/orders", icon: ListOrdered },
  { title: "Müşteriler", url: "/dashboard/customers", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { data: session } = useSession();
  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col h-full justify-between">
        <div className="flex flex-col items-center w-full pt-4 pb-2">
          <div
            className={cn(
              isCollapsed ? "" : "flex items-center w-full px-4 gap-2"
            )}
          >
            <span className="bg-white relative text-md rounded-full h-10 !w-10 font-semibold items-center justify-center flex text-black">
              {initials}
            </span>
            <div className={cn(isCollapsed ? "hidden" : "flex flex-col")}>
              <span className="font-semibold text-white text-md leading-tight">
                {user?.name || "Kullanıcı"}
              </span>
              <span className="text-xs text-gray-300 leading-tight">
                {user?.email || "-"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <SidebarGroup>
            <SidebarGroupLabel>Menü</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 justify-center md:justify-start"
                      >
                        <item.icon className="w-5 h-5" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        <div className="flex flex-col gap-2 p-2">
          <SidebarTrigger />
          <Button
            variant="ghost"
            size="icon"
            className="w-full flex justify-start text-md"
            onClick={() => signOut()}
            data-sidebar="logout"
          >
            <div className="flex items-center ml-2 gap-2">
              <LogOutIcon />
              <span className={isCollapsed ? "hidden" : ""}>Çıkış Yap</span>
            </div>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
