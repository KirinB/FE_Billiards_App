export interface FaqItem {
  question: string;
  answer: string | string[]; // string hoặc array để render list
}

export const FAQ_DATA: FaqItem[] = [
  {
    question: "Ứng dụng này dùng để làm gì?",
    answer:
      "Ứng dụng dùng để tính điểm cho các trò chơi bida (1vs1 / điểm đền). Trong tương lai sẽ mở rộng các tính năng về bida và các trò chơi khác.",
  },
  //   {
  //     question: "Solo và 1vs1 khác nhau thế nào?",
  //     answer: [
  //       "Solo: ghi nhận điểm cá nhân, phù hợp luyện tập hoặc thống kê.",
  //       "1vs1: so tài trực tiếp giữa hai người, cập nhật điểm thắng thua theo lượt.",
  //     ],
  //   },
  {
    question: "Điểm số có cập nhật theo thời gian thực không?",
    answer:
      "Có. Mỗi lần ghi điểm sẽ được phát realtime đến tất cả người đang xem phòng chơi.",
  },
  {
    question: "Có lưu lịch sử ván đấu không?",
    answer:
      "Có. Mỗi lượt ghi điểm đều được lưu lại để xem lại hoặc hoàn tác khi cần.",
  },
  {
    question: "Có thể hoàn tác (Undo) khi ghi nhầm không?",
    answer:
      "Có. Người điều khiển phòng có thể hoàn tác lượt ghi điểm gần nhất.",
  },
];
