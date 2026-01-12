import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";

const ProtectedRoute = () => {
  const { user } = useSelector((state: RootState) => state);
  const accessToken = user.accessToken;

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
