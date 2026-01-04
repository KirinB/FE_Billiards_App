// lib/achievement.utils.ts

export interface Achievements {
  topBi9Id: string | null;
  maxTurnId: string | null;
  topBi9Count: number;
  maxTurnScore: number;
}

export const calculateAchievements = (history: any[]): Achievements => {
  const bi9Stats: Record<string, number> = {};
  let maxTurnScore = 0;
  let maxTurnId: string | null = null;

  history.forEach((h) => {
    const log = h.rawLog; // Đây là JSON từ Backend trả về
    if (!log || log.type !== "DIEM_DEN") return;

    const { currentPlayerId, events, totalEarned } = log;

    // 1. Tính Trùm Bi 9
    const bi9Event = events?.find((e: any) => e.bi === 9);
    if (bi9Event) {
      bi9Stats[currentPlayerId] =
        (bi9Stats[currentPlayerId] || 0) + bi9Event.count;
    }

    // 2. Tính Cơ điên (Turn có điểm cao nhất)
    if (totalEarned > maxTurnScore) {
      maxTurnScore = totalEarned;
      maxTurnId = currentPlayerId;
    }
  });

  // Tìm ID có số lượng bi 9 nhiều nhất
  let topBi9Id: string | null = null;
  let topBi9Count = 0;

  Object.entries(bi9Stats).forEach(([id, count]) => {
    if (count > topBi9Count) {
      topBi9Count = count;
      topBi9Id = id;
    }
  });

  return { topBi9Id, maxTurnId, topBi9Count, maxTurnScore };
};
