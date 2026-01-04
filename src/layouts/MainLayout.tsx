import { Outlet } from "react-router-dom";
// import { Header } from "../components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const MainLayout = () => {
  return (
    <div
      className={cn(
        "flex flex-col min-h-screen",
        "bg-[#032016] text-white transition-colors duration-300" // Màu nền gốc của ScoreBoard
      )}
    >
      {/* <Header /> */}

      {/* Nội dung trang sẽ thay đổi ở đây */}
      {/* Thêm safe-area-inset để tối ưu cho điện thoại (tai thỏ) */}
      <main className="grow w-full max-w-md mx-auto px-2 pt-[env(safe-area-inset-top)] pb-20">
        <Outlet />
      </main>

      {/* Footer thường sẽ fixed ở dưới hoặc bám sát đáy */}
      <div className="mt-auto">
        <Footer />
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;
