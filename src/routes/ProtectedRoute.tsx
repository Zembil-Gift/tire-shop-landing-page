import { Navigate, Outlet, useLocation } from "react-router-dom";

const ACCESS_TOKEN_KEY = "accessToken";

export default function ProtectedRoute() {
    const location = useLocation();
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
        return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
    }

    return <Outlet />;
}
