"use client";

import { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Coffee, TrendingUp } from "lucide-react";

const BACKEND_DOMAIN = "http://localhost:5000";

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalCups: number;
  recentOrders: Array<{
    id: number;
    total_price: number;
    status: string;
    created_at: string;
    customer_name: string | null;
    users: { name: string } | null;
  }>;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN").format(price) + "đ";

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs font-bold">
          Chờ xác nhận
        </span>
      );
    case "processing":
      return (
        <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs font-bold">
          Đang làm
        </span>
      );
    case "shipping":
      return (
        <span className="text-purple-600 bg-purple-100 px-2 py-1 rounded text-xs font-bold">
          Đang giao
        </span>
      );
    case "completed":
      return (
        <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-bold">
          Hoàn tất
        </span>
      );
    case "cancelled":
      return (
        <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs font-bold">
          Đã hủy
        </span>
      );
    default:
      return status;
  }
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${BACKEND_DOMAIN}/api/dashboard`);
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium animate-pulse">
        Đang tải dữ liệu tổng quan...
      </div>
    );
  }

  if (!data) return null;

  return (
    <main className="p-4 md:p-8 w-full space-y-8 bg-slate-50/50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Tổng quan hệ thống
          </h1>
          <p className="text-slate-500 mt-1">
            Chào mừng trở lại! Đây là tình hình kinh doanh của cửa hàng.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold border border-green-200 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Dữ liệu thời gian thực
        </div>
      </div>

      {/* 3 Thẻ Thống kê (Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thẻ Doanh Thu */}
        <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">
              Doanh Thu
            </span>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800">
            {formatPrice(data.totalRevenue)}
          </div>
          <div className="mt-2 text-xs text-green-600 flex items-center font-medium">
            <TrendingUp className="w-3 h-3 mr-1" /> Tính trên các đơn đã hoàn
            tất
          </div>
        </div>

        {/* Thẻ Tổng Đơn Hàng */}
        <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">
              Tổng Đơn Hàng
            </span>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800">
            {data.totalOrders}{" "}
            <span className="text-sm font-medium text-slate-400">đơn</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 font-medium">
            Toàn thời gian
          </div>
        </div>

        {/* Thẻ Số Ly Đã Bán */}
        <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">
              Ly Đã Bán
            </span>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Coffee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800">
            {data.totalCups}{" "}
            <span className="text-sm font-medium text-slate-400">ly</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 font-medium">
            Từ các đơn đã giao thành công
          </div>
        </div>
      </div>

      {/* Danh sách Đơn hàng mới nhất (Mở rộng full width) */}
      <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-slate-200 mt-6">
        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-amber-600" />
          Đơn hàng mới nhất
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-xs border-y border-slate-100">
              <tr>
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Ngày đặt</th>
                <th className="px-4 py-3 text-right">Tổng tiền</th>
                <th className="px-4 py-3 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-slate-400 italic"
                  >
                    Chưa có đơn hàng nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                data.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-4 font-bold text-slate-700">
                      #{order.id}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {order.customer_name ||
                        order.users?.name ||
                        "Khách vãng lai"}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {new Date(order.created_at).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-4 font-black text-amber-600 text-right">
                      {formatPrice(order.total_price)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {getStatusText(order.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
