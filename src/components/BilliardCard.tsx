import React from "react";
import { motion } from "framer-motion";
import { type Card as CardType } from "@/types/room.type";
import { Heart, Diamond, Spade, Club } from "lucide-react";

interface CardProps {
  card: CardType;
  index: number;
  totalCards: number;
  onFlip: (id: string) => void;
  onRemove: (card: CardType) => void;
}

const BilliardCard: React.FC<CardProps> = ({
  card,
  index,
  totalCards,
  onFlip,
  onRemove,
}) => {
  const middleIndex = (totalCards - 1) / 2;
  const relativeIndex = index - middleIndex;
  const rotation = relativeIndex * 12;
  const translateY = Math.abs(relativeIndex) * 12;
  const translateX = relativeIndex * 45;

  // Render Icon thay cho chữ
  const renderSuitIcon = (className: string) => {
    const suit = card.suit?.toLowerCase();
    switch (suit) {
      case "cơ":
      case "heart":
      case "hearts":
        return <Heart className={className} fill="currentColor" />;
      case "rô":
      case "diamond":
      case "diamonds":
        return <Diamond className={className} fill="currentColor" />;
      case "tép":
      case "chuồn":
      case "club":
      case "clubs":
        return <Club className={className} fill="currentColor" />;
      case "bích":
      case "spade":
      case "spades":
        return <Spade className={className} fill="currentColor" />;
      default:
        return null;
    }
  };

  const isRed =
    card.suit === "Cơ" ||
    card.suit === "Rô" ||
    card.suit === "Heart" ||
    card.suit === "Diamond";
  const cardColor = isRed ? "#e11d48" : "#0f172a";

  return (
    <motion.div
      layoutId={String(card.id)}
      initial={{ y: 500, x: 0, rotate: 0, opacity: 0 }}
      animate={{
        y: translateY,
        x: translateX,
        rotate: rotation,
        opacity: 1,
      }}
      exit={{ y: -600, opacity: 0, transition: { duration: 0.3 } }}
      drag="y"
      dragConstraints={{ top: -500, bottom: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -150) onRemove(card);
      }}
      onClick={() => onFlip(card.id)}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.1,
      }}
      whileDrag={{ scale: 1.1, zIndex: 100 }}
      style={{ position: "absolute", cursor: "grab", perspective: 1000 }}
      className="w-28 h-44 select-none"
    >
      <motion.div
        animate={{ rotateY: card.isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        style={{ transformStyle: "preserve-3d", width: "100%", height: "100%" }}
        className="relative"
      >
        {/* MẶT SAU */}
        <div
          className="absolute inset-0 bg-[#1a3d32] border-2 border-white/20 rounded-2xl flex items-center justify-center shadow-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-16 h-28 border border-white/5 rounded-xl flex items-center justify-center bg-black/10">
            <span className="text-[#f2c94c] font-black italic opacity-20 text-3xl rotate-90">
              BIDA
            </span>
          </div>
        </div>

        {/* MẶT TRƯỚC */}
        <div
          className="absolute inset-0 bg-white rounded-2xl shadow-2xl flex flex-col justify-between p-2 border-2 border-black/5"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            color: cardColor,
          }}
        >
          {/* Góc trên bên trái */}
          <div className="flex flex-col items-start ml-0.5 mt-0.5 leading-[0.8]">
            <span className="text-xl font-black tracking-tighter">
              {card.value}
            </span>
            <div className="ml-0.5 mt-1">{renderSuitIcon("size-2.5")}</div>
          </div>

          {/* Giữa bài trang trí */}
          <div className="flex justify-center opacity-[0.05] absolute inset-0 items-center pointer-events-none text-7xl font-black">
            {card.value}
          </div>

          {/* Vòng tròn số ở giữa */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 rounded-full border-[3px] border-current flex items-center justify-center font-black text-xl shadow-inner bg-white">
              {card.value}
            </div>
          </div>

          {/* Góc dưới bên phải */}
          <div className="flex flex-col items-start leading-[0.8] self-end rotate-180 mr-0.5 mb-0.5">
            <span className="text-xl font-black tracking-tighter">
              {card.value}
            </span>
            <div className="ml-0.5 mt-1">{renderSuitIcon("size-2.5")}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BilliardCard;
