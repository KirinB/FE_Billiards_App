import BilliardCard from "@/components/BilliardCard";
import { type RootState } from "@/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Plus, Trophy, RefreshCw, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { BidaHistoryDialog } from "../BidaHistoryDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

interface BidaCardViewProps {
  room: any;
  isReadOnly: boolean;
  onDraw: (playerId: number) => void;
  onDiscard: (playerId: number, ballValue: number) => void;
  onStart: (pin: string) => void;
  onReset: (pin: string) => void;
  finishRoom: () => void;
}

interface Card {
  id: string;
  value: number;
  suit: string;
  isFlipped: boolean;
}

const FOOTER_HEIGHT = 80;
const BILLIARD_BALLS = Array.from({ length: 15 }).map((_, i) => {
  return new URL(`../../assets/bi${i + 1}.png`, import.meta.url).href;
});

export const BidaCardView = ({
  room,
  isReadOnly,
  onDraw,
  onDiscard,
  onStart,
  onReset,
  finishRoom,
}: BidaCardViewProps) => {
  const { id: userId } = useSelector((state: RootState) => state.user);

  const me = room.players.find((p: any) => p.userId === userId);
  const others = room.players.filter((p: any) => p.userId !== userId);

  const hasStarted = room.players.some((p: any) => p.cards?.length > 0);

  const winnerPlayer = room.players.find(
    (p: any) => hasStarted && p.userId && p.cards?.length === 0
  );
  const someoneWon = !!winnerPlayer;
  const isMeWinner = winnerPlayer?.userId === userId;

  const chunkCards = (arr: any[], size: number) => {
    const result: any = [];
    if (!arr) return result;
    for (let i = 0; i < arr.length; i += size)
      result.push(arr.slice(i, i + size));
    return result;
  };

  const handleDiscard = (card: any) => {
    if (isReadOnly || !me) return;
    onDiscard(me.id, card.value);
  };

  return (
    <div className="h-[calc(100vh-80px)] text-white overflow-hidden relative">
      {/* 1. OTHER PLAYERS */}
      <div className="flex justify-around px-4 pt-4 bg-black/20 pb-4">
        {others.map((p: any) => (
          <div
            key={p.id}
            className="flex flex-col items-center gap-1 opacity-80"
          >
            <div className={p.userId ? "relative" : "opacity-30"}>
              <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-white/5 flex items-center justify-center font-black overflow-hidden text-xs">
                {p.userId ? p.name?.[0] || "U" : "?"}
              </div>
              {p.userId && (
                <span className="absolute -bottom-1 -right-1 bg-green-500 size-3 rounded-full border-2 border-[#1a1c20]" />
              )}
            </div>
            <span className="text-[10px] font-bold truncate max-w-[60px]">
              {p.name}
            </span>
            <span className="text-[10px] text-[#f2c94c] font-bold">
              {p.cards?.length || 0} lá
            </span>
          </div>
        ))}
      </div>

      {/* 2. TABLE CENTER */}
      <div className="absolute inset-x-0 top-[35%] -translate-y-1/2 flex flex-col items-center gap-6">
        {!hasStarted && !isReadOnly && !someoneWon ? (
          <div className="flex flex-col items-center gap-4">
            <motion.button
              onClick={() => onStart(room.pin)}
              whileTap={{ scale: 0.9 }}
              className="bg-[#f2c94c] text-black px-8 py-4 rounded-3xl font-black shadow-[0_0_30px_rgba(242,201,76,0.3)] flex items-center gap-2"
            >
              <Play fill="black" /> BẮT ĐẦU & CHIA BÀI
            </motion.button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white/30 hover:text-red-400 hover:bg-white/5 text-[10px] uppercase font-black tracking-widest rounded-full"
                >
                  <LogOut size={12} className="mr-2" /> Kết thúc phòng
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Kết thúc ván đấu?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Xác nhận kết thúc ván đấu? Phòng sẽ đóng và mã PIN sẽ được
                    xóa.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => finishRoom()}
                    className="bg-red-600"
                  >
                    Kết thúc
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <BidaHistoryDialog room={room} />

              {!isReadOnly && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-full hover:bg-red-500/20 px-4 h-9 backdrop-blur-sm"
                    >
                      <LogOut size={14} className="mr-1.5" />
                      <span className="text-[10px] font-black uppercase">
                        Kết thúc
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận kết thúc?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => finishRoom()}
                        className="bg-red-600"
                      >
                        Xác nhận
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                <motion.button
                  disabled={
                    isReadOnly || !me || room.deckCount === 0 || someoneWon
                  }
                  onClick={() => me && onDraw(me.id)}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white py-2 px-10 rounded-full backdrop-blur-md border border-white/10 shadow-2xl flex flex-col items-center min-w-[140px]"
                >
                  <Plus className="group-active:rotate-90 transition-transform size-5" />
                  <span className="text-[12px] uppercase mt-0.5 font-bold tracking-tighter text-white">
                    {room.deckCount === 0 ? "Hết bài" : "Rút bài"}
                  </span>
                </motion.button>
              </div>
              {room.deckCount !== undefined && (
                <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                  <div
                    className={`size-1.5 rounded-full ${
                      room.deckCount > 0
                        ? "bg-green-500 animate-pulse"
                        : "bg-red-500"
                    }`}
                  />
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                    Bộ bài còn:{" "}
                    <span className="text-[#f2c94c] text-xs">
                      {room.deckCount} lá
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-3 bg-black/40 p-4 rounded-3xl border border-white/5 backdrop-blur-sm">
              {BILLIARD_BALLS.map((src, i) => {
                const ballValue = i + 1;
                const hasCard = me?.cards?.some(
                  (c: any) => Number(c.value) === ballValue
                );
                return (
                  <button
                    key={i}
                    disabled={isReadOnly || !me || !hasCard || someoneWon}
                    onClick={() => me && onDiscard(me.id, ballValue)}
                    className={`active:scale-75 transition-all relative ${
                      hasCard ? "opacity-100 scale-110" : "opacity-20 grayscale"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`ball-${ballValue}`}
                      className="w-8 h-8 object-contain drop-shadow-md"
                    />
                    {hasCard && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. MY HAND - ẨN KHI LÀ VIEWER */}
      {!isReadOnly && (
        <div
          className="fixed left-0 right-0 z-40"
          style={{
            bottom: `calc(${FOOTER_HEIGHT}px + env(safe-area-inset-bottom))`,
          }}
        >
          {me ? (
            <div className="relative flex flex-col items-center gap-0">
              {chunkCards(me.cards || [], 7).map(
                (rowCards: Card[], rowIndex: number, rows: Card[][]) => (
                  <div
                    key={rowIndex}
                    className="relative flex items-end justify-center"
                    style={{
                      height: 150,
                      marginTop: rowIndex === 0 ? 0 : -100,
                      zIndex: rowIndex === rows.length - 1 ? 50 : 10 + rowIndex,
                    }}
                  >
                    <AnimatePresence>
                      {rowCards.map((card: Card, index: number) => (
                        <BilliardCard
                          key={card.id}
                          card={card}
                          index={index}
                          totalCards={rowCards.length}
                          onFlip={() => {}}
                          onRemove={() => handleDiscard(card)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )
              )}
              {me.cards?.length > 0 && (
                <p className="text-center text-[8px] text-white/20 uppercase tracking-[0.2em] mt-4 font-bold">
                  VUỐT LÊN LÁ BÀI ĐỂ BỎ BÀI
                </p>
              )}
            </div>
          ) : (
            <div className="text-center pb-10">
              <p className="text-white/20 text-[10px] font-bold uppercase">
                Bạn chưa tham gia vị trí nào
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. WINNER OVERLAY */}
      <AnimatePresence>
        {someoneWon && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/60 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="mb-6 bg-yellow-500/20 p-6 rounded-full">
                <Trophy className="size-20 text-yellow-500 animate-bounce" />
              </div>
              <h2 className="text-5xl font-black text-white italic tracking-tighter mb-2">
                {isMeWinner ? "VICTORY!" : "GAME OVER"}
              </h2>
              <p className="text-white/60 text-sm font-bold uppercase tracking-[0.3em] mb-10">
                {isMeWinner
                  ? "Bạn đã thắng ván này"
                  : `${winnerPlayer.name} đã thắng ván này`}
              </p>
              {!isReadOnly && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onReset(room.pin)}
                  className="bg-white text-black px-10 py-4 rounded-2xl font-black flex items-center gap-2 shadow-2xl"
                >
                  <RefreshCw className="size-5" /> CHƠI TIẾP VÁN MỚI
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
