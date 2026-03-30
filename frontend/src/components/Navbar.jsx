import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // ✅ Dynamic dashboard route
    const dashboardRoute =
        user?.role === "admin" ? "/admin-dashboard" : "/dashboard";

    return (
        <nav className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
            <div className="px-6 py-4 flex flex-col h-full">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-green-600 tracking-wide mb-8"
                >
                    Movie<span className="text-gray-800">Hub</span>
                </Link>

                {/* Navigation */}
                <div className="flex flex-col gap-6 flex-1">
                    <Link
                        to="/"
                        className="text-gray-600 hover:text-green-600 font-medium transition"
                    >
                        Home
                    </Link>

                    {user && (
                        <Link
                            to={dashboardRoute}
                            className="text-gray-600 hover:text-green-600 font-medium transition"
                        >
                            My Dashboard
                        </Link>
                    )}
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col gap-3 mt-6">
                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-center hover:bg-green-700 transition font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-center hover:bg-gray-200 transition font-medium"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className="text-gray-700 font-medium">
                                {user.name}
                            </span>

                            {user.role === "admin" && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md w-fit">
                                    Admin
                                </span>
                            )}

                            <button
                                onClick={handleLogout}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium text-left"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>


    );
};

export default Navbar;