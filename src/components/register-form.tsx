import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Activity, Lock, Mail, User, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";

// Định nghĩa Schema kiểm tra dữ liệu
const registerSchema = z.object({
  username: z.string().min(2, "Tên hiển thị phải có ít nhất 2 ký tự"),
  email: z.string().email("Định dạng email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setApiError("");

    try {
      await authService.register(data);

      setIsSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setApiError(
        err.response?.data?.message || "Lỗi không xac định khi đăng ký"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1d24] to-[#0f1115] border border-white/5 rounded-[32px] p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="size-16 rounded-2xl bg-[#f2c94c] shadow-[0_0_20px_rgba(242,201,76,0.3)] flex items-center justify-center text-black rotate-3 mb-4">
            <Activity size={32} strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
            Tạo tài khoản mới
          </h1>
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">
            Gia nhập cộng đồng Bida
          </p>
        </div>

        {isSuccess ? (
          <div className="relative z-10 py-8 flex flex-col items-center text-center space-y-4">
            <CheckCircle2 className="size-16 text-green-400 animate-bounce" />
            <p className="text-green-400 font-bold uppercase tracking-widest text-sm">
              Đăng ký thành công!
            </p>
            <p className="text-white/40 text-xs">
              Đang chuyển hướng sang đăng nhập...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative z-10 space-y-4"
          >
            {/* Username Field */}
            <div className="space-y-1">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                <Input
                  {...register("username")}
                  placeholder="Tên hiển thị"
                  className={cn(
                    "h-14 pl-12 bg-white/5 border-white/5 rounded-2xl focus:border-[#f2c94c]/50 focus:ring-0 text-sm",
                    errors.username && "border-red-500/50"
                  )}
                />
              </div>
              {errors.username && (
                <p className="text-[10px] text-red-500 ml-4 font-bold uppercase italic italic">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email đăng ký"
                  className={cn(
                    "h-14 pl-12 bg-white/5 border-white/5 rounded-2xl focus:border-[#f2c94c]/50 focus:ring-0 text-sm",
                    errors.email && "border-red-500/50"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-500 ml-4 font-bold uppercase italic">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Mật khẩu"
                  className={cn(
                    "h-14 pl-12 bg-white/5 border-white/5 rounded-2xl focus:border-[#f2c94c]/50 focus:ring-0 text-sm",
                    errors.password && "border-red-500/50"
                  )}
                />
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-500 ml-4 font-bold uppercase italic">
                  {errors.password.message}
                </p>
              )}
            </div>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-xs text-red-500 font-bold text-center uppercase tracking-tighter">
                  {apiError}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#f2c94c] hover:bg-[#d4ae3d] text-black font-black uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98]"
            >
              {loading ? "Đang tạo..." : "Đăng ký ngay"}
            </Button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[11px] text-white/40 uppercase font-bold tracking-wider hover:text-[#f2c94c] transition-colors"
              >
                Đã có tài khoản?{" "}
                <span className="text-[#f2c94c] underline ml-1">Đăng nhập</span>
              </button>
            </div>
          </form>
        )}

        <Activity className="absolute -right-8 -bottom-8 size-48 text-white/[0.02] -rotate-12" />
      </div>
    </div>
  );
}
