import { BidaPenaltyView } from "@/components/View/BidaPenaltyView";
import { BidaSoloView } from "@/components/View/BidaSolo";
import { PinGate } from "@/components/room/PinGate";
import { RoomHeader } from "@/components/room/RoomHeader";
import { useRoomController } from "@/hooks/useRoomController";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export const RoomPage = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();

  const {
    room,
    loading,
    isAuthorized,
    isViewer,
    loadRoom,
    updateRoom,
    updateScore1vs1,
    undoScore1vs1,
  } = useRoomController(roomId);

  /* AUTO LOGIN PIN */
  useEffect(() => {
    const pin =
      searchParams.get("pin") || localStorage.getItem(`room_pin_${roomId}`);

    if (pin) loadRoom(pin);
  }, [roomId]);

  if (!isAuthorized) {
    return <PinGate loading={loading} onSubmit={loadRoom} />;
  }

  if (!room) return null;

  return (
    <div className="min-h-screen p-4">
      <RoomHeader room={room} />

      {room.type === "BIDA_1VS1" ? (
        <BidaSoloView
          room={room}
          isReadOnly={isViewer}
          onUpdateScore={updateScore1vs1}
          onUndo={undoScore1vs1}
        />
      ) : (
        <BidaPenaltyView
          room={room}
          isReadOnly={isViewer}
          onUpdateRoom={updateRoom}
        />
      )}
    </div>
  );
};
