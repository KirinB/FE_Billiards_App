export interface TutorialStep {
  mode: "1VS1" | "PENALTY";
  title: string;
  description: string[];
  image?: string; // đường dẫn hình minh họa
}

export const TUTORIAL_DATA: TutorialStep[] = [
  {
    mode: "1VS1",
    title: "1 vs 1",
    description: [
      "Chế độ đối kháng giữa hai người chơi.",
      "Điểm số cập nhật theo lượt thắng thua.",
      "Phù hợp thi đấu hoặc tập luyện đối kháng.",
    ],
    // image: "/tutorial-1vs1.png",
  },
  {
    mode: "PENALTY",
    title: "Điểm đền",
    description: [
      "Theo luật bida 9 bóng sẽ đền bi 3, 6 ,9.",
      "Người chơi sẽ chọn người được điểm , bi ăn điểm, người bị đền và chọn ghi điểm để cập nhật bảng điểm.",
    ],
    // image: "/tutorial-tala.png",
  },
];
