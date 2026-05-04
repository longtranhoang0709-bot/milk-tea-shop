"use client";

import * as z from "zod";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
    confirmPassword: z.string().min(6, "Vui lòng xác nhận mật khẩu."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setMessage({
        type: "error",
        text: "Đường dẫn không hợp lệ hoặc mã xác thực đã hết hạn.",
      });
    }
  }, [token]);

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    if (!token) return;

    setMessage(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: token,
            newPassword: values.newPassword,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Mật khẩu của bạn đã được cập nhật. Đang chuyển hướng...",
        });
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setMessage({
          type: "error",
          text: typeof data === "string" ? data : "Mã xác thực không hợp lệ.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Không thể kết nối đến máy chủ." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-border/50">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
          Cập nhật mật khẩu
        </CardTitle>
        <CardDescription>
          {token
            ? "Nhập mật khẩu mới để hoàn tất việc khôi phục tài khoản."
            : "Yêu cầu không hợp lệ. Vui lòng thực hiện lại từ trang Quên mật khẩu."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {message && (
          <div
            className={`mb-4 p-3 text-sm font-medium rounded-md text-center ${
              message.type === "success"
                ? "bg-green-500/10 text-green-600 border border-green-200"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}
          >
            {message.text}
          </div>
        )}

        {token ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white h-11 transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Đang cập
                    nhật...
                  </span>
                ) : (
                  "Cập nhật mật khẩu"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <Button asChild className="w-full h-11 bg-slate-800">
            <Link href="/forgot-password">Yêu cầu mã mới</Link>
          </Button>
        )}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Đã nhớ mật khẩu?{" "}
          <Link
            href="/login"
            className="text-amber-600 hover:underline font-semibold"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <Suspense
        fallback={
          <Card className="w-full max-w-md p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
            <p className="mt-4 text-slate-500">Đang tải trang xác thực...</p>
          </Card>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
