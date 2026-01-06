import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { useScrollDirection } from "@/hooks/useScrollDirection"; // Import hook vừa tạo

const MainLayout = () => {
  const isVisible = useScrollDirection();

  return (
    <div
      className={cn(
        "flex flex-col min-h-[100dvh]",
        "bg-[#032016] text-white transition-colors duration-300",
        "selection:bg-emerald-500/30"
      )}
    >
      <main
        className={cn(
          "grow w-full mx-auto",
          "px-4 md:px-6 lg:px-8",
          "pt-[max(1rem,env(safe-area-inset-top))]",
          "pb-[calc(80px+env(safe-area-inset-bottom))]",
          "max-w-full md:max-w-5xl lg:max-w-6xl"
        )}
      >
        <Outlet />
      </main>

      {/* FOOTER CONTAINER VỚI HIỆU ỨNG TRƯỢT */}
      <footer
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
          "bg-gradient-to-t from-[#032016] via-[#032016]/95 to-transparent pt-4",
          // Nếu không visible thì đẩy xuống 100% chiều cao của nó
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="max-w-md mx-auto">
          <Footer />
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </footer>

      <Toaster
        position="bottom-center"
        expand={false}
        richColors
        theme="dark"
      />
    </div>
  );
};

export default MainLayout;
