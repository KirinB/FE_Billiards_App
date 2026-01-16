import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_INFO, VERSION_STRING } from "@/const/app";
import { ShieldCheck, UserCircle, Database, Trash2, Heart } from "lucide-react";

const PrivacyPage = () => {
  return (
    <div className="px-2 pt-6 max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            <p className="uppercase flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Chính sách bảo mật
            </p>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-4 text-[#a8c5bb]">
          {/* Mục 1: Thu thập thông tin */}
          <div className="flex items-start gap-4 p-2">
            <div className="p-3 rounded-2xl bg-white/10 shrink-0">
              <UserCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-white">
                Thông tin thu thập
              </h3>
              <p className="text-sm opacity-70 leading-relaxed">
                Khi bạn đăng nhập bằng Facebook, chúng tôi chỉ yêu cầu quyền
                truy cập
                <strong> Tên (Public Profile)</strong> và <strong>Email</strong>{" "}
                của bạn.
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-white/5" />

          {/* Mục 2: Mục đích sử dụng */}
          <div className="flex items-start gap-4 p-2">
            <div className="p-3 rounded-2xl bg-white/10 shrink-0">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-white">
                Mục đích sử dụng
              </h3>
              <p className="text-sm opacity-70 leading-relaxed">
                Thông tin này dùng để định danh bạn trong phòng chơi và đồng bộ
                kết quả trận đấu billiards trên hệ thống của {APP_INFO.name}.
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-white/5" />

          {/* Mục 3: Xóa dữ liệu */}
          <div className="flex items-start gap-4 p-2">
            <div className="p-3 rounded-2xl bg-white/10 shrink-0">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-white">
                Yêu cầu xóa dữ liệu
              </h3>
              <p className="text-sm opacity-70 leading-relaxed">
                Bạn có thể yêu cầu xóa dữ liệu bằng cách gỡ ứng dụng trong cài
                đặt Facebook hoặc nhắn tin trực tiếp qua hỗ trợ kỹ thuật tại
                trang Liên hệ.
              </p>
            </div>
          </div>

          {/* Footer App Info */}
          <div className="pt-4 text-center border-t border-white/5">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="text-[10px] opacity-40 uppercase tracking-[0.2em]">
                Securing
              </span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span className="text-[10px] opacity-40 uppercase tracking-[0.2em]">
                Your Privacy
              </span>
            </div>
            <p className="text-[9px] text-[#f2c94c] opacity-40 uppercase tracking-[0.3em] font-bold">
              {APP_INFO.name} {VERSION_STRING}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="h-20" />
    </div>
  );
};

export default PrivacyPage;
