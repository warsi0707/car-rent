"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  BarChart3,
  Car,
  Users,
  CalendarCheck,
  LogOut,
  Box,
} from "lucide-react";
import { signOut } from "@/server/auth";
import { toast } from "sonner";

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter()

  const handleLogout =async()=>{
    try{
      const res = await signOut()
      if(res.success){
        toast.success(res.message || "Logged out successfully")
        router.push('/signin')
      }
    }catch(error){
      console.log("Error while loging out")
    }
  }

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Cars", href: "/cars", icon: Car },
    { name: "Bookings", href: "/bookings", icon: CalendarCheck },
    { name: "Users", href: "/users", icon: Users },
    { name: "Addons", href: "/addons", icon: Box}
  ];

  // 👇 demo user (replace with real data)
  const user = {
    fullName: "Samir Warsi",
    email: "samir.warsi2001@gmail.com",
  };

  const initials =
    user.fullName
      ?.split(" ")
      ?.slice(0, 2)
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase() || "";

  return (
    <Sidebar>
      {/* 🔵 Header */}
      <SidebarHeader className="border-b px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
            R
          </div>
          <div>
            <p className="text-sm font-semibold">Rentify Admin</p>
            <p className="text-xs text-muted-foreground">
              Admin console
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* 🟢 Menu */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          {/* <SidebarGroupLabel>Menu</SidebarGroupLabel> */}

          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} className="text-xl">
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4 mr-2" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 🔴 Footer */}
      <SidebarFooter className="border-t px-4 py-4">
        {/* 👤 User Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white text-sm font-semibold">
            {initials}
          </div>

          <div className="text-sm">
            <p className="font-medium">{user.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        {/* 🚪 Logout */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}