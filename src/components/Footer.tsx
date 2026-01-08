import { cn } from "@/lib/utils";
import type { RootState } from "@/store/store";
import {
  HeartHandshakeIcon,
  Home,
  MessageCircle,
  User2Icon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const items = [
    {
      label: "Trang Chủ",
      icon: Home,
      path: "/",
    },
    {
      label: "Liên Hệ",
      icon: MessageCircle,
      path: "/contact",
    },
    {
      label: "FAQ",
      icon: HeartHandshakeIcon,
      path: "/faq",
    },
    {
      label: user.id ? "Hồ Sơ" : "Đăng Nhập",
      icon: User2Icon,
      path: user.id ? "/profile" : "/login",
    },
    // {
    //   label: "Cài đặt",
    //   icon: Settings,
    //   path: "/settings",
    // },
  ];

  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "border-t border-white/5 bg-[#0d211a]/80 backdrop-blur-lg", // Màu xanh đen khớp với Card đáy
        "pb-[env(safe-area-inset-bottom)]" // Chống tràn cho iPhone (tai thỏ dưới)
      )}
    >
      <div className="flex justify-around items-center h-16">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[10px] uppercase tracking-widest transition-all duration-300 w-full h-full",
                isActive
                  ? "text-[#f2c94c] font-black" // Màu vàng gold giống số điểm trong ScoreBoard
                  : "text-[#a8c5bb] opacity-60 hover:opacity-100" // Màu xanh nhạt của label
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  isActive &&
                    "bg-white/5 shadow-[0_0_15px_rgba(242,201,76,0.2)]"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                  )}
                />
              </div>
              <span className="font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </footer>
  );
};

export default Footer;
