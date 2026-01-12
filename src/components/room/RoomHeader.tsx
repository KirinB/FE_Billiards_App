import { Eye, QrCode } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

interface RoomHeaderProps {
  room: any;
  isViewer?: boolean;
  isReadOnly?: boolean;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  room,
  isViewer = false,
  isReadOnly = false,
}) => {
  const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;
  const pin = localStorage.getItem(`room_pin_${room.id}`);
  const shareUrl = `${APP_URL}/room/${room.id}${
    !isViewer && pin ? `?pin=${pin}` : ""
  }`;

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">
          {room.name}
        </h1>

        <div className="flex items-center gap-2 mt-1">
          <span className="px-2 py-0.5 bg-[#f2c94c] text-black text-[9px] font-black rounded uppercase">
            {room.type === "BIDA_1VS1" ? "1 VS 1" : "ĐIỂM ĐỀN"}
          </span>

          {isViewer && (
            <span className="text-[9px] text-[#a8c5bb] font-bold uppercase border border-white/10 px-2 py-0.5 rounded flex items-center gap-1">
              <Eye size={10} /> Viewer
            </span>
          )}
        </div>
      </div>

      {isViewer ? null : (
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-white/5 p-3 rounded-2xl border border-white/5 active:scale-90 transition-all">
              <QrCode className="text-[#f2c94c] size-6" />
            </button>
          </DialogTrigger>

          <DialogContent className="bg-[#0d211a] border-white/10 text-white rounded-[32px] sm:max-w-md flex flex-col items-center p-8">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase italic text-[#f2c94c] tracking-widest">
                Mời cơ thủ
              </DialogTitle>
            </DialogHeader>

            <div className="bg-white p-4 rounded-[24px] mt-6 shadow-[0_0_40px_rgba(242,201,76,0.15)]">
              <QRCodeSVG value={shareUrl} size={220} level="H" />
            </div>

            {isReadOnly ? null : (
              <div className="mt-8 text-center space-y-3">
                <p className="text-[#a8c5bb] text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                  Quét để tự động vào bàn
                </p>

                <div className="bg-white/5 px-6 py-2 rounded-2xl border border-white/10">
                  <span className="text-[#f2c94c] font-black tracking-[0.4em] text-xl">
                    {pin}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                toast.success("Đã sao chép link mời!");
              }}
              className="mt-6 text-[10px] font-black uppercase text-[#a8c5bb] hover:text-[#f2c94c] underline underline-offset-4"
            >
              Sao chép đường dẫn
            </button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
