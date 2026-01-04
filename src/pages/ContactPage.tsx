import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Facebook, Bug, MessageCircle, Heart } from "lucide-react";
import { APP_INFO, VERSION_STRING } from "@/const/app";

const Contact = () => {
  return (
    <div className="px-2 pt-6 max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            <p className="uppercase">
              <span>🎱</span> Ứng dụng billiards
            </p>
          </CardTitle>
          {/* <CardDescription>Thông tin hỗ trợ và đóng góp ý kiến</CardDescription> */}
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Section: Báo lỗi */}
          <div className="flex items-start gap-4 p-2">
            <div className="p-3 rounded-2xl bg-white/10 shrink-0">
              <Bug className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base">Báo lỗi & Góp ý</h3>
              <p className="text-sm text-[#a8c5bb] opacity-70 leading-relaxed">
                Nếu bạn gặp bất kỳ sự cố nào hoặc có ý tưởng mới để nâng cấp ứng
                dụng, đừng ngần ngại nhắn tin cho tôi.
              </p>
            </div>
          </div>

          {/* Đường kẻ phân cách */}
          <div className="h-px w-full bg-white/5" />

          {/* Link Facebook */}
          <a
            href="https://www.facebook.com/ebs.bi/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-between p-4 rounded-2xl transition-all active:scale-95 group",
              "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="bg-[#1877F2]/10 p-2 rounded-xl">
                <Facebook className="w-6 h-6 text-[#1877F2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white">{APP_INFO.author}</span>
                <span className="text-[10px] text-[#a8c5bb] opacity-50 uppercase tracking-wider">
                  facebook.com/ebs.bi
                </span>
              </div>
            </div>
            <MessageCircle className="w-5 h-5 text-[#f2c94c] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
          </a>

          {/* Footer App Info gộp trực tiếp vào cuối Card */}
          <div className="pt-4 text-center border-t border-white/5">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="text-[10px] opacity-40 uppercase tracking-[0.2em]">
                Made with
              </span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-[10px] opacity-40 uppercase tracking-[0.2em]">
                for Billiard Lovers
              </span>
            </div>

            {/* Nội dung từ FooterContact cũ */}
            <p className="text-[9px] text-[#f2c94c] opacity-40 uppercase tracking-[0.3em] font-bold">
              {APP_INFO.name} {VERSION_STRING}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Khoảng đệm dưới cùng tránh bị che bởi Mobile Footer Navigation */}
      <div className="h-20" />
    </div>
  );
};

export default Contact;
