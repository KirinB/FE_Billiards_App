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
import { type RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, PlusCircle, Settings2, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const nameRegex = /^[a-zA-Z0-9À-ỹ\s]+$/;

// 1. Định nghĩa Object gốc trước
const roomFormObject = z.object({
  name: z
    .string()
    .min(2, "Tên ván tối thiểu 2 ký tự")
    .max(20, "Tên ván tối đa 20 ký tự")
    .regex(nameRegex, "Không dùng ký tự đặc biệt"),
  pin: z.string().min(4, "PIN phải đủ 4 số"),
  type: z.enum(["BIDA_DIEM_DEN", "BIDA_1VS1", "BIDA_BAI"]),
  playerCount: z.number().min(2).max(4),
  cardsPerPlayer: z.coerce
    .number()
    .min(1, "Tối thiểu 1 lá")
    .max(13, "Tối đa 13 lá"),
  names: z.array(z.string()),
  penaltyPoints: z.array(
    z.object({ key: z.number(), value: z.number().min(0) })
  ),
});

// 2. Tạo Type từ Object gốc để đảm bảo tính nhất quán
type RoomFormValues = z.infer<typeof roomFormObject>;

// 3. Tạo Schema hoàn chỉnh với superRefine
const roomFormSchema = roomFormObject.superRefine((data, ctx) => {
  if (data.type !== "BIDA_BAI") {
    for (let i = 0; i < data.playerCount; i++) {
      const pName = data.names[i]?.trim() || "";
      if (pName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ít nhất 2 ký tự",
          path: ["names", i],
        });
      } else if (pName.length > 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nhỏ hơn 20 ký tự",
          path: ["names", i],
        });
      } else if (!nameRegex.test(pName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Không chứa ký tự đặc biệt",
          path: ["names", i],
        });
      }
    }
  }
});

const ErrorMsg = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <span className="text-[10px] text-red-400 font-medium mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
      {message}
    </span>
  );
};

const CreateRoomDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
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
    resolver: zodResolver(roomFormSchema) as any,
    defaultValues: {
      name: "",
      pin: "",
      type: "BIDA_DIEM_DEN",
      playerCount: 3,
      cardsPerPlayer: 5,
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

  // Reset form khi mở Dialog
  useEffect(() => {
    if (open) {
      reset({
        name: "",
        pin: "",
        type: "BIDA_DIEM_DEN",
        playerCount: 3,
        cardsPerPlayer: 5,
        names: [username || "", "", "", ""],
        penaltyPoints: [
          { key: 3, value: 1 },
          { key: 6, value: 2 },
          { key: 9, value: 3 },
        ],
      });
    }
  }, [open, reset, username]);

  // Logic tự động chuyển đổi số người chơi khi đổi Tab
  useEffect(() => {
    if (selectedType === "BIDA_1VS1") {
      setValue("playerCount", 2);
    } else if (selectedType === "BIDA_DIEM_DEN") {
      // Nếu đang ở tab khác (như 1VS1) mà chuyển sang Điểm Đến, tự động set về 3
      if (playerCount < 3) {
        setValue("playerCount", 3);
      }
    } else if (selectedType === "BIDA_BAI") {
      if (playerCount < 2) setValue("playerCount", 4);
    }
  }, [selectedType, setValue, playerCount]);

  const onSubmit = async (values: RoomFormValues) => {
    try {
      toast.loading("Đang khởi tạo...", { id: "create-room" });
      const payload = {
        ...values,
        playerNames:
          values.type === "BIDA_BAI"
            ? []
            : values.names.slice(0, values.playerCount),
        playerCount: values.playerCount,
        cardsPerPlayer: values.type === "BIDA_BAI" ? values.cardsPerPlayer : 0,
        valBi3: values.penaltyPoints[0].value,
        valBi6: values.penaltyPoints[1].value,
        valBi9: values.penaltyPoints[2].value,
      };
      const res = await RoomService.create(payload as any);
      toast.success("Thành công!", { id: "create-room" });
      setOpen(false);
      if (onSuccess) onSuccess();
      navigate(`/room/${res.id}?pin=${values.pin}`);
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
          className="rounded-xl active:scale-95 bg-[#f2c94c] text-black hover:bg-[#d4af37]"
        >
          <PlusCircle className="size-4 mr-1" /> Tạo mới
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[400px] max-h-[95vh] flex flex-col p-0 overflow-hidden bg-[#1a3d32] border-[#2a4d40]">
        <DialogHeader className="p-6 border-b border-white/5 bg-black/20">
          <DialogTitle className="flex items-center gap-2 text-white font-black italic">
            <Trophy className="text-[#f2c94c] size-5" /> THIẾT LẬP VÁN MỚI
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label className="text-[10px] uppercase font-bold text-[#a8c5bb] mb-1.5 ml-1">
                Tên ván
              </Label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Bàn 1..."
                    className={cn(
                      "bg-white/5 border-none h-11 rounded-xl text-white focus:ring-1 ring-[#f2c94c]",
                      errors.name && "ring-1 ring-red-500 bg-red-500/10"
                    )}
                  />
                )}
              />
              <ErrorMsg message={errors.name?.message} />
            </div>

            <div className="flex flex-col">
              <Label className="text-[10px] uppercase font-bold text-[#a8c5bb] mb-1.5 ml-1">
                <Lock className="size-2" />
                Mã PIN (4 số)
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
                    className={cn(
                      "bg-white/5 border-none h-11 rounded-xl text-white text-center font-bold tracking-widest",
                      errors.pin && "ring-1 ring-red-500 bg-red-500/10"
                    )}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ""))
                    }
                  />
                )}
              />
              <ErrorMsg message={errors.pin?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-[#a8c5bb] ml-1">
              Chế độ chơi
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "BIDA_DIEM_DEN", label: "ĐIỂM ĐỀN" },
                { id: "BIDA_1VS1", label: "1 VS 1" },
                { id: "BIDA_BAI", label: "BIDA BÀI" },
              ].map((t) => (
                <Button
                  key={t.id}
                  type="button"
                  variant={selectedType === t.id ? "default" : "outline"}
                  className={cn(
                    "h-11 rounded-xl text-[9px] font-black",
                    selectedType === t.id
                      ? "bg-[#f2c94c] text-black hover:bg-[#f2c94c]"
                      : "opacity-40 border-white/10 text-white"
                  )}
                  onClick={() => setValue("type", t.id as any)}
                >
                  {t.label}
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
                  {[2, 3, 4].map((n) => {
                    const isDisabled =
                      selectedType === "BIDA_DIEM_DEN" && n === 2;
                    return (
                      <button
                        key={n}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setValue("playerCount", n)}
                        className={cn(
                          "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                          playerCount === n
                            ? "bg-[#f2c94c] text-black"
                            : "text-white/40 hover:text-white",
                          isDisabled && "hidden"
                        )}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedType === "BIDA_BAI" && (
              <div className="flex flex-col space-y-2 animate-in fade-in slide-in-from-left-2">
                <Label className="text-[10px] uppercase font-bold text-[#a8c5bb] ml-1">
                  Số lá bài mỗi người (1 - 13)
                </Label>
                <Controller
                  control={control}
                  name="cardsPerPlayer"
                  render={({ field }) => (
                    <div className="relative">
                      <Input
                        {...field}
                        type="number"
                        className={cn(
                          "bg-white/5 border-none h-11 rounded-xl text-white focus:ring-1 ring-[#f2c94c] font-bold",
                          errors.cardsPerPlayer &&
                            "ring-1 ring-red-500 bg-red-500/10"
                        )}
                        placeholder="Mặc định là 5 lá..."
                        onChange={(e) => field.onChange(e.target.value)} // Để coerce xử lý ép kiểu
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#f2c94c] font-black italic">
                        LÁ
                      </div>
                    </div>
                  )}
                />
                <ErrorMsg message={errors.cardsPerPlayer?.message} />
              </div>
            )}

            {selectedType === "BIDA_BAI" ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center">
                <p className="text-[10px] text-[#a8c5bb]">
                  Hệ thống sẽ tạo {playerCount} Slot trống.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {Array.from({ length: playerCount }).map((_, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#f2c94c]/60">
                        P{i + 1}
                      </span>
                      <Controller
                        control={control}
                        name={`names.${i}`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            disabled={i === 0 && !!accessToken}
                            placeholder={`Tên cơ thủ ${i + 1}`}
                            className={cn(
                              "bg-white/5 border-none h-11 pl-10 rounded-xl text-white transition-all",
                              errors.names?.[i] &&
                                "ring-1 ring-red-500 bg-red-500/10"
                            )}
                          />
                        )}
                      />
                    </div>
                    <ErrorMsg message={(errors.names as any)?.[i]?.message} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedType === "BIDA_DIEM_DEN" && (
            <div className="p-4 rounded-2xl bg-black/40 space-y-3">
              <Label className="text-[10px] uppercase font-bold text-[#a8c5bb] flex items-center gap-2">
                <Settings2 className="size-3" /> Điểm phạt Bi 3 - 6 - 9
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((idx) => (
                  <Controller
                    key={idx}
                    control={control}
                    name={`penaltyPoints.${idx}.value`}
                    render={({ field }) => (
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-10 text-center font-black bg-white/10 border-none text-[#f2c94c] rounded-lg"
                      />
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 rounded-2xl text-base font-black uppercase bg-[#f2c94c] text-black hover:bg-[#d4af37] shadow-xl mt-2 transition-transform active:scale-95"
          >
            BẮT ĐẦU TRẬN ĐẤU
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomDialog;
