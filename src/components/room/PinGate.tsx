import { Loader2, Lock, Eye } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";

interface PinGateProps {
  loading?: boolean;
  onSubmit: (pin: string) => void;
  onJoinAsViewer?: () => void;
}

export const PinGate: React.FC<PinGateProps> = ({
  loading = false,
  onSubmit,
  onJoinAsViewer,
}) => {
  const [pin, setPin] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">
      <div className="bg-[#f2c94c]/10 p-4 rounded-full mb-6 italic animate-pulse">
        <Lock className="text-[#f2c94c] size-8" />
      </div>

      <h2 className="text-white font-black text-xl uppercase tracking-tighter mb-2">
        Quyền truy cập bàn
      </h2>

      <p className="text-[#a8c5bb] text-[11px] mb-8 max-w-[220px]">
        Nhập mã PIN gồm 4 chữ số để xác nhận quyền chủ bàn
      </p>

      <InputOTP
        maxLength={4}
        value={pin}
        onChange={setPin}
        onComplete={onSubmit}
      >
        <InputOTPGroup className="gap-3">
          {[0, 1, 2, 3].map((i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="w-12 h-16 text-2xl font-black border-2 border-white/10 bg-white/5 text-[#f2c94c] rounded-xl"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <div className="flex flex-col gap-3 w-56 mt-8">
        <button
          disabled={pin.length < 4 || loading}
          onClick={() => onSubmit(pin)}
          className="bg-[#f2c94c] disabled:opacity-30 text-black py-4 rounded-2xl font-black text-sm uppercase"
        >
          {loading ? (
            <Loader2 className="animate-spin size-5 mx-auto" />
          ) : (
            "XÁC NHẬN MÃ"
          )}
        </button>

        {onJoinAsViewer && (
          <button
            onClick={onJoinAsViewer}
            className="text-[#a8c5bb] text-[10px] font-bold uppercase py-2 flex items-center justify-center gap-2"
          >
            <Eye size={14} /> Tôi là người xem
          </button>
        )}
      </div>
    </div>
  );
};
