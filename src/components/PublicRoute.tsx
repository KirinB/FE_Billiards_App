import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";

const PublicRoute = () => {
  const { user } = useSelector((state: RootState) => state);
  const accessToken = user.accessToken;

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
