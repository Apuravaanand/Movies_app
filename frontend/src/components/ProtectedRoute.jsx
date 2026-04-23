import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null; // or spinner

    if (!user) return <Navigate to="/login" replace />;
    if (!user.isVerified) return <Navigate to="/verify-email" replace />; // redirect unverified users
    if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;

    return children;
};

export default ProtectedRoute;