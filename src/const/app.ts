export const APP_INFO = {
  name: "Billiard Scoreboard",
  author: "Minh Nhân",
};

export const APP_VERSION = {
  major: 2,
  minor: 0,
  patch: 0,
};

export const VERSION_STRING = `v${APP_VERSION.major}.${APP_VERSION.minor}.${APP_VERSION.patch}`;

export const VOICE_MESSAGES = {
  // Khi cộng điểm bình thường
  ADD_SCORE: (name: string, points: number, total: number) =>
    `Người chơi ${name}, cộng ${points} điểm. Tổng ${total} điểm.`,

  // Khi bị trừ điểm (bi số 10 hoặc lỗi)
  SUBTRACT_SCORE: (name: string, points: number, total: number) =>
    `Người chơi ${name}, bị trừ ${Math.abs(
      points
    )} điểm. Còn lại ${total} điểm.`,

  // Khi thắng trận
  WINNER: (name: string) =>
    `Trận đấu kết thúc. Chúc mừng ${name} đã giành chiến thắng tâm phục khẩu phục!`,

  // Khi bắt đầu trận đấu
  START_GAME: "Trận đấu bắt đầu. Chúc các cơ thủ thi đấu tự tin.",

  // Khi có người đạt "Cơ điên" (ví dụ ăn bi 9 liên tục)
  HOT_STREAK: (name: string) => `Kinh khủng! ${name} đang có một cơ điên!`,
};
