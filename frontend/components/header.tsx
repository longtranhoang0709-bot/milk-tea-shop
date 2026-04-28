import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle"; // Đảm bảo đường dẫn này khớp với file của bạn

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 1. Cụm Logo & Tên quán */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              PL Milk Tea
            </span>
          </Link>
        </div>

        {/* 2. Cụm Navigation (Giữa) - Tự động ẩn trên màn hình điện thoại */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/menu"
            className="transition-colors hover:text-amber-600 text-foreground/80"
          >
            Thực đơn
          </Link>
          <Link
            href="/promotions"
            className="transition-colors hover:text-amber-600 text-foreground/80"
          >
            Khuyến mãi
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-amber-600 text-foreground/80"
          >
            Giới thiệu
          </Link>
        </nav>

        {/* 3. Cụm Hành động (Phải) - Đăng nhập, Đăng ký, Darkmode */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-2">
            <Link href="/login">
              <Button variant="ghost" className="hover:text-amber-600">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Đăng ký
              </Button>
            </Link>
          </div>

          {/* Nút Toggle Theme */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
