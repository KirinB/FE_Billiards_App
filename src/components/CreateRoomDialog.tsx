import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { RoomService } from "@/services/room.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, PlusCircle, Settings2, Trophy, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useNavigate } from "react-router-dom";
import type { CreateRoomDto } from "@/types/room.type";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";

const roomFormSchema = z
  .object({
    name: z.string().min(2, "Tên ván đấu quá ngắn (tối thiểu 2 ký tự)"),
    pin: z.string().min(4, "Mã PIN phải đủ 4 số"),
    type: z.enum(["BIDA_DIEM_DEN", "BIDA_1VS1"]),
    playerCount: z.number(),
    names: z.array(z.string()),
    penaltyPoints: z.array(
      z.object({ key: z.number(), value: z.number().min(0) })
    ),
  })
  .superRefine((data, ctx) => {
    for (let i = 0; i < data.playerCount; i++) {
      if (!data.names[i] || data.names[i].trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Tên cơ thủ ${i + 1} quá ngắn`,
          path: ["names", i],
        });
      }
    }
  });

type RoomFormValues = z.infer<typeof roomFormSchema>;

const CreateRoomDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Lấy thông tin user từ Redux
  const { username, accessToken } = useSelector(
    (state: RootState) => state.user
  );

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      pin: "",
      type: "BIDA_DIEM_DEN",
      playerCount: 3,
      names: ["", "", "", ""],
      penaltyPoints: [
        { key: 3, value: 1 },
        { key: 6, value: 2 },
        { key: 9, value: 3 },
      ],
    },
  });

  const selectedType = watch("type");
  const playerCount = watch("playerCount");

  // Reset form và tự động điền tên Admin nếu có
  useEffect(() => {
    if (open) {
      const initialNames = ["", "", "", ""];
      if (accessToken && username) {
        initialNames[0] = username;
      }

      reset({
        name: "",
        pin: "",
        type: "BIDA_DIEM_DEN",
        playerCount: 3,
        names: initialNames,
        penaltyPoints: [
          { key: 3, value: 1 },
          { key: 6, value: 2 },
          { key: 9, value: 3 },
        ],
      });
    }
  }, [open, reset, username, accessToken]);

  useEffect(() => {
    if (selectedType === "BIDA_1VS1") {
      setValue("playerCount", 2);
    } else if (playerCount === 2 && selectedType === "BIDA_DIEM_DEN") {
      setValue("playerCount", 3);
    }
  }, [selectedType, setValue, playerCount]);

  const onSubmit = async (values: RoomFormValues) => {
    try {
      toast.loading("Đang khởi tạo bàn đấu...", { id: "create-room" });

      const payload = {
        name: values.name,
        pin: values.pin,
        type: values.type,
        playerNames: values.names.slice(0, values.playerCount),
        valBi3: values.penaltyPoints[0].value,
        valBi6: values.penaltyPoints[1].value,
        valBi9: values.penaltyPoints[2].value,
      };

      const res = await RoomService.create(payload as CreateRoomDto);
      const roomId = res.id;
      toast.success("Tạo ván đấu thành công!", { id: "create-room" });
      setOpen(false);
      if (onSuccess) onSuccess();
      if (roomId) navigate(`/room/${roomId}?pin=${values.pin}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi tạo phòng", {
        id: "create-room",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="rounded-xl shadow-amber-500/20 active:scale-95"
        >
          <PlusCircle className="size-4 mr-1" /> Tạo mới
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[400px] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-[#1a3d32] border-[#2a4d40]">
        <DialogHeader className="p-6 border-b border-white/5">
          <DialogTitle className="flex items-center gap-2 text-white font-black italic">
            <Trophy className="text-[#f2c94c] size-5" /> THIẾT LẬP VÁN MỚI
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-[#a8c5bb] ml-1">
                Tên ván
              </Label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Bàn 1..."
                    className="bg-white/5 border-none h-11 rounded-xl text-white focus:ring-1 ring-[#f2c94c]"
                  />
                )}
              />
              {errors.name && (
                <p className="text-[10px] text-red-400 font-medium ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-[#a8c5bb] ml-1 flex items-center gap-1">
                <Lock className="size-2" /> Mã PIN (4 số)
              </Label>
              <Controller
                control={control}
                name="pin"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    maxLength={4}
                    placeholder="****"
                    className="bg-white/5 border-none h-11 rounded-xl text-white text-center tracking-[0.5em] font-bold"
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ""))
                    }
                  />
                )}
              />
              {errors.pin && (
                <p className="text-[10px] text-red-400 font-medium ml-1">
                  {errors.pin.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-[#a8c5bb] ml-1">
              Chế độ chơi
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {(["BIDA_DIEM_DEN", "BIDA_1VS1"] as const).map((t) => (
                <Button
                  key={t}
                  type="button"
                  variant={selectedType === t ? "default" : "outline"}
                  className={cn(
                    "h-11 rounded-xl text-[10px] font-black tracking-widest transition-all",
                    selectedType === t
                      ? "bg-[#f2c94c] text-black hover:bg-[#f2c94c]"
                      : "opacity-40 border-white/10 text-white"
                  )}
                  onClick={() => setValue("type", t)}
                >
                  {t === "BIDA_DIEM_DEN" ? "ĐIỂM ĐỀN" : "1 VS 1"}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] uppercase font-bold text-[#a8c5bb] ml-1">
                Cơ thủ tham gia
              </Label>
              {selectedType !== "BIDA_1VS1" && (
                <div className="flex gap-1 bg-black/40 p-1 rounded-lg">
                  {[3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setValue("playerCount", n)}
                      className={cn(
                        "px-3 py-1 text-[10px] font-bold rounded-md transition-colors",
                        playerCount === n
                          ? "bg-[#f2c94c] text-black"
                          : "text-white/40 hover:text-white"
                      )}
                    >
                      {n} Người
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-2.5">
              {Array.from({ length: playerCount }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Controller
                    control={control}
                    name={`names.${i}`}
                    render={({ field }) => (
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#f2c94c]/60">
                          P{i + 1}
                        </span>
                        <Input
                          {...field}
                          disabled={i === 0 && !!accessToken} // Disable P1 nếu đã login
                          placeholder={`Tên cơ thủ ${i + 1}`}
                          className={cn(
                            "bg-white/5 border-none h-11 pl-10 rounded-xl text-white transition-all",
                            i === 0 &&
                              accessToken &&
                              "bg-white/10 text-[#f2c94c] font-bold border border-[#f2c94c]/20"
                          )}
                        />
                        {i === 0 && accessToken && (
                          <UserCheck className="absolute right-4 top-1/2 -translate-y-1/2 size-3 text-[#f2c94c]" />
                        )}
                      </div>
                    )}
                  />
                  {errors.names?.[i] && (
                    <p className="text-[9px] text-red-400 font-bold ml-2 uppercase">
                      {errors.names[i]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedType === "BIDA_DIEM_DEN" && (
            <div className="space-y-3 pt-2">
              <Label className="text-[10px] uppercase font-bold text-[#a8c5bb] ml-1 flex items-center gap-2">
                <Settings2 className="size-3" /> Cấu hình điểm bi
              </Label>
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/40">
                {[3, 6, 9].map((bi, i) => (
                  <div key={bi} className="text-center space-y-1">
                    <span className="text-[9px] font-bold opacity-30 text-white">
                      BI {bi}
                    </span>
                    <Controller
                      control={control}
                      name={`penaltyPoints.${i}.value`}
                      render={({ field }) => (
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="h-9 text-center font-black bg-white/10 border-none text-[#f2c94c] rounded-lg"
                        />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest bg-[#f2c94c] text-black hover:bg-[#d4af37] shadow-xl shadow-[#f2c94c]/10 mt-4"
          >
            BẮT ĐẦU TRẬN ĐẤU
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomDialog;
