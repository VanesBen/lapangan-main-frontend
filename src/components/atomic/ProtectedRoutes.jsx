import { Outlet, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router";

export default function ProtectedRoute({ allowedRoles }) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // if (isLoading) return <p>Memuat…</p> 

    // if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
    console.log(user.role)
    if (allowedRoles && !allowedRoles.includes(user.role))
        return <Navigate to="/unauthorized" replace />;
    
    return <Outlet />;
}