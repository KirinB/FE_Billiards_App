import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import Contact from "./pages/ContactPage";
import { RoomPage } from "./pages/RoomDetail";
import FaqPage from "./pages/FaqPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          {/* Trang danh sách phòng */}
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Trang chi tiết bàn bida cụ thể */}
          {/* <Route path="/room/:roomId" element={<RoomDetail />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
