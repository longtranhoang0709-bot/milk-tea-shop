import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 py-10 mt-10">
      <div className="container mx-auto max-w-screen-2xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1: Thông tin */}
          <div>
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              PL Milk Tea
            </h3>
            <p className="text-sm text-muted-foreground">
              Mang đến hương vị trà sữa tuyệt vời nhất cho mỗi ngày của bạn.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-foreground mb-2">Liên kết</h3>
            <Link
              href="/menu"
              className="text-sm text-muted-foreground hover:text-amber-600"
            >
              Thực đơn
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-amber-600"
            >
              Điều khoản sử dụng
            </Link>
          </div>

          {/* Cột 3: Liên hệ */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-foreground mb-2">Liên hệ</h3>
            <p className="text-sm text-muted-foreground">
              Email: contact@plmilktea.com
            </p>
            <p className="text-sm text-muted-foreground">Hotline: 1900 1234</p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PL Milk Tea. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  );
}
