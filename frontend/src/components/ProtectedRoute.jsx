import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useContext(AuthContext);

    if (!user) return <Navigate to="/login" replace />; // not logged in
    if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />; // not admin

    return children;
};

export default ProtectedRoute;