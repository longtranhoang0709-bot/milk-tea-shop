"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  ListPlus,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BACKEND_DOMAIN = "http://localhost:5000";
const API_URL = `${BACKEND_DOMAIN}/api/toppings`;

interface Topping {
  id: number;
  name: string;
  price: number;
  image: string | null;
}

export default function AdminToppingsPage() {
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });

  const fetchToppings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setToppings(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToppings();
  }, [fetchToppings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("price", formData.price);

      if (imageFile) {
        submitData.append("image", imageFile);
      }

      const res = await fetch(url, {
        method: method,
        body: submitData,
      });

      if (res.ok) {
        setFormData({ name: "", price: "" });
        setImageFile(null);
        setImagePreview(null);
        setEditingId(null);
        fetchToppings();
      } else {
        const err = await res.json();
        alert("Lỗi: " + err.message);
      }
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối đến máy chủ!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (topping: Topping) => {
    setEditingId(topping.id);
    setFormData({
      name: topping.name,
      price: topping.price.toString(),
    });

    setImageFile(null);

    if (topping.image) {
      const firstImage = topping.image.split(",")[0];
      setImagePreview(`${BACKEND_DOMAIN}${firstImage}`);
    } else {
      setImagePreview(null);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa topping này?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) fetchToppings();
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <main className="p-4 md:p-8 w-full space-y-8 bg-slate-50/50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản lý Topping
          </h1>
          <p className="text-slate-500 mt-1">
            Quản lý các loại thạch, trân châu ăn kèm
          </p>
        </div>
        <Button
          onClick={fetchToppings}
          variant="outline"
          className="bg-white shadow-sm border-slate-200 gap-2 px-6"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg ring-1 ring-slate-200 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 py-6 px-8 m-0 w-full block">
          <h3 className="text-white text-xl font-bold flex items-center gap-3 m-0 p-0 leading-none">
            <div className="bg-white/20 p-2 rounded-lg flex items-center justify-center">
              {editingId ? (
                <Edit className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </div>
            {editingId ? "Sửa thông tin Topping" : "Thêm Topping mới"}
          </h3>
        </div>

        <div className="p-8 w-full">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Tên Topping
              </label>
              <Input
                required
                className="h-10 border-slate-200"
                placeholder="VD: Trân châu đường đen"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Giá bán (VNĐ)
              </label>
              <Input
                required
                type="number"
                className="h-10 border-slate-200"
                placeholder="VD: 5000"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">
                Hình ảnh
              </label>
              <br />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 max-w-sm"
              />
              {imagePreview && (
                <div className="mt-2 flex items-center gap-3 bg-slate-50 p-2 rounded-md border border-slate-200 w-fit">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-10 w-10 object-cover rounded-md border border-slate-200 shadow-sm"
                  />
                  <span className="text-xs text-slate-500 font-medium italic">
                    Đã chọn ảnh
                  </span>
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: "", price: "" });
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  {" "}
                  Hủy bỏ{" "}
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-amber-600 hover:bg-amber-700 w-32 font-bold shadow-sm"
              >
                {isLoading ? "Đang lưu..." : "Lưu Topping"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Card className="border-none shadow-lg ring-1 ring-slate-200">
        <CardHeader className="border-b bg-white py-4 px-6">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ListPlus className="w-5 h-5 text-amber-600" /> Danh sách Topping
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Topping</th>
                  <th className="px-6 py-4">Giá</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {toppings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-10 text-slate-400"
                    >
                      Chưa có topping nào
                    </td>
                  </tr>
                ) : (
                  toppings.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-3 flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-slate-100 overflow-hidden ring-1 ring-slate-200 shrink-0">
                          {t.image ? (
                            <img
                              src={`${BACKEND_DOMAIN}${t.image.split(",")[0]}`}
                              alt={t.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50">
                              <ImageIcon className="w-5 h-5 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-base">
                            {t.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            #{t.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-black text-amber-600 text-base">
                        {new Intl.NumberFormat("vi-VN").format(t.price)}đ
                      </td>
                      <td className="px-6 py-3 text-right space-x-2 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-200 hover:bg-blue-50"
                          onClick={() => handleEdit(t)}
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-200 hover:bg-red-50"
                          onClick={() => handleDelete(t.id)}
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
