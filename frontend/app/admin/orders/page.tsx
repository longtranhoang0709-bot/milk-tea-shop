"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  ShoppingBag,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BACKEND_DOMAIN = "http://localhost:5000";
const API_URL = `${BACKEND_DOMAIN}/api/orders`;

interface ToppingDetail {
  id: number;
  toppings: { name: string; price: number };
}
interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  products: { name: string; image: string | null };
  order_toppings: ToppingDetail[];
}
interface Order {
  id: number;
  user_id: number | null;
  total_price: number;
  status: string;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  users: { name: string; email: string } | null;
  order_items: OrderItem[];
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN").format(price) + "đ";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
          <Clock className="w-3 h-3" /> Chờ xác nhận
        </span>
      );
    case "processing":
      return (
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
          <ShoppingBag className="w-3 h-3" /> Đang chuẩn bị
        </span>
      );
    case "shipping":
      return (
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
          <Truck className="w-3 h-3" /> Đang giao
        </span>
      );
    case "completed":
      return (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
          <CheckCircle2 className="w-3 h-3" /> Hoàn thành
        </span>
      );
    case "cancelled":
      return (
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
          <XCircle className="w-3 h-3" /> Đã hủy
        </span>
      );
    default:
      return <span>{status}</span>;
  }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    if (!confirm(`Xác nhận chuyển trạng thái đơn hàng thành: ${newStatus}?`))
      return;
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const getDisplayCustomer = (o: Order) => {
    const name = o.customer_name || o.users?.name || "Khách ẩn danh";
    const phone = o.customer_phone || "Chưa có SĐT";
    const type = o.user_id ? "Thành viên" : "Khách vãng lai";
    return { name, phone, type };
  };

  const filteredOrders = orders.filter((o) => {
    const cust = getDisplayCustomer(o);
    return (
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toString().includes(searchTerm) ||
      cust.phone.includes(searchTerm)
    );
  });

  return (
    <main className="p-4 md:p-8 w-full space-y-8 bg-slate-50/50 min-h-screen font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản lý Đơn hàng
          </h1>
          <p className="text-slate-500 mt-1">
            Theo dõi và xử lý các đơn đặt hàng từ khách
          </p>
        </div>
        <Button
          onClick={fetchOrders}
          variant="outline"
          className="bg-white shadow-sm border-slate-200 gap-2 px-6"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />{" "}
          Làm mới
        </Button>
      </div>

      <Card className="border-none shadow-lg ring-1 ring-slate-200">
        <CardHeader className="border-b bg-white py-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" /> Danh sách Đơn
            hàng
          </CardTitle>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm mã đơn, tên khách, SĐT..."
              className="pl-9 h-9 border-slate-200 bg-slate-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Mã Đơn</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Tổng tiền</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Ngày đặt</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-slate-400"
                    >
                      Không tìm thấy đơn hàng nào.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const cust = getDisplayCustomer(o);
                    return (
                      <tr
                        key={o.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-slate-700">
                          #{o.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-slate-800 text-base">
                              {cust.name}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              {cust.type === "Thành viên" ? (
                                <User className="w-3 h-3 text-blue-500" />
                              ) : (
                                <User className="w-3 h-3 text-slate-400" />
                              )}
                              {cust.type} • {cust.phone}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-black text-amber-600 text-base">
                          {formatPrice(o.total_price)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(o.status)}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {new Date(o.created_at).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            onClick={() => setSelectedOrder(o)}
                          >
                            <Eye className="w-4 h-4 mr-1" /> Chi tiết
                          </Button>
                          <select
                            className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                            value={o.status}
                            onChange={(e) =>
                              handleUpdateStatus(o.id, e.target.value)
                            }
                          >
                            <option value="pending">Chờ xác nhận</option>
                            <option value="processing">Đang chuẩn bị</option>
                            <option value="shipping">Đang giao</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Hủy đơn</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Chi tiết đơn hàng #{selectedOrder.id}
                {getStatusBadge(selectedOrder.status)}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedOrder(null)}
                className="hover:bg-slate-200 rounded-full"
              >
                <X className="w-5 h-5 text-slate-500" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
                <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase">
                  Thông tin giao hàng
                </h3>
                <p className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />{" "}
                  <strong>Người nhận:</strong>{" "}
                  {getDisplayCustomer(selectedOrder).name}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />{" "}
                  <strong>Điện thoại:</strong>{" "}
                  {getDisplayCustomer(selectedOrder).phone}
                </p>
                <p className="text-sm flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />{" "}
                  <strong>Địa chỉ:</strong>{" "}
                  {selectedOrder.shipping_address || "Khách mua tại quầy"}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase border-b pb-2">
                  Danh sách món nước
                </h3>
                <div className="space-y-4">
                  {selectedOrder.order_items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-16 h-16 bg-slate-100 rounded-md ring-1 ring-slate-200 shrink-0 overflow-hidden">
                        {item.products.image ? (
                          <img
                            src={`${BACKEND_DOMAIN}${item.products.image.split(",")[0]}`}
                            className="w-full h-full object-cover"
                            alt="product"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-800">
                            {item.products.name}{" "}
                            <span className="text-amber-600 ml-2">
                              x{item.quantity}
                            </span>
                          </h4>
                          <span className="font-bold text-slate-700">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                        {item.order_toppings.length > 0 ? (
                          <div className="mt-1 text-xs text-slate-500 bg-slate-50 p-2 rounded inline-block">
                            <strong className="text-slate-600 block mb-1">
                              Topping thêm:
                            </strong>
                            <ul className="list-disc pl-4 space-y-0.5">
                              {item.order_toppings.map((ot, tIdx) => (
                                <li key={tIdx}>
                                  {ot.toppings.name} (+
                                  {formatPrice(ot.toppings.price)})
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 mt-1 italic">
                            Không có topping
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t flex justify-between items-center">
              <span className="text-slate-600 font-medium">
                Tổng thanh toán:
              </span>
              <span className="text-2xl font-black text-amber-600">
                {formatPrice(selectedOrder.total_price)}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
