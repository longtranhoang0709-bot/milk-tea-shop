"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Coffee,
  Users,
  Settings,
  Cherry,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItemClass = (path: string) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      isActive(path)
        ? "bg-amber-50 text-amber-600 shadow-sm ring-1 ring-amber-100"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      <aside className="hidden w-64 flex-col border-r bg-white md:flex sticky top-0 h-screen">
        <div className="flex h-16 items-center border-b px-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-bold text-xl text-amber-600"
          >
            <Coffee className="h-6 w-6" />
            <span>PL Admin</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6 font-medium">
          <Link href="/admin" className={navItemClass("/admin")}>
            <LayoutDashboard className="h-5 w-5" />
            <span>Tổng quan</span>
          </Link>

          <Link href="/admin/orders" className={navItemClass("/admin/orders")}>
            <ShoppingCart className="h-5 w-5" />
            <span>Đơn hàng</span>
          </Link>

          <Link
            href="/admin/products"
            className={navItemClass("/admin/products")}
          >
            <Coffee className="h-5 w-5" />
            <span>Menu</span>
          </Link>

          <Link
            href="/admin/toppings"
            className={navItemClass("/admin/toppings")}
          >
            <Cherry className="h-5 w-5" />
            <span>Toppings</span>
          </Link>

          <Link
            href="/admin/customers"
            className={navItemClass("/admin/customers")}
          >
            <Users className="h-5 w-5" />
            <span>Khách hàng</span>
          </Link>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
