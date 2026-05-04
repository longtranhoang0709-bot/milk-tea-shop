"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Users,
  ShieldAlert,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit,
  Lock,
  Unlock,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BACKEND_DOMAIN = "http://localhost:5000";
const API_URL = `${BACKEND_DOMAIN}/api/users`;

interface User {
  id: number;
  name: string;
  email: string;
  so_dien_thoai: string | null;
  dia_chi: string | null;
  role: string;
  status: string;
  created_at: string;
}

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    so_dien_thoai: "",
    dia_chi: "",
    role: "user",
    status: "active",
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setEditingId(null);
        fetchUsers();
      } else {
        const err = await res.json();
        alert("Lỗi: " + err.message);
      }
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối máy chủ!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      so_dien_thoai: user.so_dien_thoai || "",
      dia_chi: user.dia_chi || "",
      role: user.role,
      status: user.status || "active",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleLock = async (user: User) => {
    const newStatus = user.status === "locked" ? "active" : "locked";
    const actionName = newStatus === "locked" ? "KHÓA" : "MỞ KHÓA";

    if (
      !confirm(
        `Bạn có chắc chắn muốn ${actionName} tài khoản của ${user.name}?`,
      )
    )
      return;

    try {
      const res = await fetch(`${API_URL}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, status: newStatus }),
      });
      if (res.ok) {
        if (editingId === user.id) setEditingId(null);
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "CẢNH BÁO TỐI THƯỢNG: Hành động này sẽ XÓA VĨNH VIỄN khách hàng khỏi database! Bạn chắc chứ?",
      )
    )
      return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (editingId === id) setEditingId(null);
        fetchUsers();
      } else alert("Không thể xóa (Khách này đang có đơn hàng).");
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.so_dien_thoai?.includes(searchTerm),
  );

  return (
    <main className="p-4 md:p-8 w-full space-y-8 bg-slate-50/50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản lý Khách hàng
          </h1>
          <p className="text-slate-500 mt-1">
            Quản lý thông tin và trạng thái hoạt động của tài khoản
          </p>
        </div>
        <Button
          onClick={fetchUsers}
          variant="outline"
          className="bg-white shadow-sm border-slate-200 gap-2 px-6"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />{" "}
          Làm mới
        </Button>
      </div>

      {/* KHỐI FORM SỬA KHÁCH HÀNG */}
      {editingId && (
        <div className="bg-white rounded-xl shadow-lg ring-1 ring-slate-200 overflow-hidden flex flex-col relative animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6 px-8 m-0 w-full flex justify-between items-center">
            <h3 className="text-white text-xl font-bold flex items-center gap-3 m-0 p-0 leading-none">
              <div className="bg-white/20 p-2 rounded-lg flex items-center justify-center">
                <Edit className="w-5 h-5" />
              </div>
              Chỉnh sửa thông tin tài khoản
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
              onClick={() => setEditingId(null)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-8 w-full">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Họ và Tên
                </label>
                <Input
                  required
                  className="h-10 border-slate-200"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Email (Không thể đổi)
                </label>
                <Input
                  disabled
                  type="email"
                  className="h-10 border-slate-200 bg-slate-100"
                  value={formData.email}
                  title="Email không thể thay đổi để đảm bảo tính xác thực"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Số điện thoại
                </label>
                <Input
                  className="h-10 border-slate-200"
                  placeholder="VD: 0912345678"
                  value={formData.so_dien_thoai}
                  onChange={(e) =>
                    setFormData({ ...formData, so_dien_thoai: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Địa chỉ giao hàng
                </label>
                <Input
                  className="h-10 border-slate-200"
                  placeholder="VD: Số nhà, Tên đường, Quận, TP"
                  value={formData.dia_chi}
                  onChange={(e) =>
                    setFormData({ ...formData, dia_chi: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Vai trò
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="user">Khách hàng (User)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Trạng thái
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="active">Hoạt động bình thường</option>
                  <option value="locked">Khóa tài khoản</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingId(null)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 w-36 font-bold shadow-sm"
                >
                  {isLoading ? "Đang lưu..." : "Lưu Thay Đổi"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card className="border-none shadow-lg ring-1 ring-slate-200">
        <CardHeader className="border-b bg-white py-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" /> Danh sách Tài khoản
          </CardTitle>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm theo tên, email, SĐT..."
              className="pl-9 h-9 border-slate-200 bg-slate-50 focus:bg-white"
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
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Liên hệ</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-10 text-slate-400"
                    >
                      Không có dữ liệu.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className={`hover:bg-slate-50/80 transition-colors ${u.status === "locked" ? "bg-red-50/30 opacity-75" : ""} ${editingId === u.id ? "bg-blue-50/50" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-800 text-base flex items-center gap-2">
                            {u.name}
                            {u.role === "admin" && (
                              <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                ADMIN
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            #{u.id} • Tham gia:{" "}
                            {new Date(u.created_at).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 text-slate-600">
                          <span className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />{" "}
                            {u.email}
                          </span>
                          <span className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />{" "}
                            {u.so_dien_thoai || "---"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {u.status === "locked" ? (
                          <span className="flex items-center w-fit gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                            <Lock className="w-3 h-3" /> Đã khóa
                          </span>
                        ) : (
                          <span className="flex items-center w-fit gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            <Unlock className="w-3 h-3" /> Hoạt động
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`border-slate-200 ${editingId === u.id ? "bg-blue-100 ring-2 ring-blue-400" : "hover:bg-blue-50"}`}
                          onClick={() => handleEdit(u)}
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            u.status === "locked"
                              ? "border-slate-200 hover:bg-green-50"
                              : "border-slate-200 hover:bg-orange-50"
                          }
                          onClick={() => handleToggleLock(u)}
                          disabled={u.role === "admin"}
                        >
                          {u.status === "locked" ? (
                            <Unlock className="w-4 h-4 text-green-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-orange-600" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-200 hover:bg-red-50"
                          onClick={() => handleDelete(u.id)}
                          disabled={u.role === "admin"}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
