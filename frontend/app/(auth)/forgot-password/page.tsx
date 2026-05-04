"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ."),
});

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setMessage(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Hướng dẫn đặt lại mật khẩu đã được gửi vào email của bạn!",
        });
      } else {
        setMessage({
          type: "error",
          text:
            typeof data === "string"
              ? data
              : "Email không tồn tại trong hệ thống!",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Lỗi kết nối máy chủ." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
            Quên mật khẩu?
          </CardTitle>
          <CardDescription>
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu mới.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {message && (
                <div
                  className={`p-3 text-sm font-medium rounded-md text-center ${
                    message.type === "success"
                      ? "bg-green-500/10 text-green-600"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email đăng ký</FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white h-11"
              >
                {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Quay lại trang{" "}
            <Link
              href="/login"
              className="text-amber-600 hover:underline font-medium"
            >
              Đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
