import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d211a] text-white px-4">
      <h1 className="text-6xl font-extrabold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">
        Oops! Không tìm thấy trang
      </h2>
      <p className="text-center text-gray-300 mb-6">
        Trang bạn đang tìm kiếm không tồn tại hoặc chức năng này đang tạm thời
        bị khóa để cập nhật.
      </p>
      <Button
        onClick={() => navigate("/")}
        className="bg-[#f2c94c] text-black hover:bg-[#e6b944]"
      >
        Quay về Trang Chủ
      </Button>
    </div>
  );
};

export default NotFoundPage;
