import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = ({ open, setOpen }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const dashboardRoute =
        user?.role === "admin" ? "/admin-dashboard" : "/dashboard";

    return (
        <>
            {/* OPEN BUTTON */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed top-4 left-4 z-50 bg-white shadow-md px-3 py-2 rounded-md hover:bg-gray-100"
                >
                    ☰
                </button>
            )}

            {/* SIDEBAR */}
            <nav
                className={`fixed top-0 left-0 h-screen w-64 bg-white border-r flex flex-col z-40 transform transition-transform duration-300 
                ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="px-6 py-5 flex flex-col h-full">

                    {/* TOP */}
                    <div className="flex items-center justify-between mb-8">
                        <Link
                            to="/"
                            className="text-2xl font-bold text-green-600"
                        >
                            Movie<span className="text-gray-800">Hub</span>
                        </Link>

                        <button
                            onClick={() => setOpen(false)}
                            className="text-gray-500 hover:text-red-500"
                        >
                            ✖
                        </button>
                    </div>

                    {/* LINKS */}
                    <div className="flex flex-col gap-4 flex-1 text-sm">
                        <Link
                            to="/"
                            className="text-gray-600 hover:text-green-600"
                        >
                            Home
                        </Link>

                        {user && (
                            <Link
                                to={dashboardRoute}
                                className="text-gray-600 hover:text-green-600"
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* USER SECTION */}
                    <div className="flex flex-col gap-3 text-sm border-t pt-4">
                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    className="bg-green-600 text-white px-4 py-2 rounded text-center"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gray-100 px-4 py-2 rounded text-center"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <span className="font-medium">
                                    {user.name}
                                </span>

                                {user.role === "admin" && (
                                    <span className="text-xs bg-green-100 px-2 py-1 rounded w-fit">
                                        Admin
                                    </span>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-100 px-4 py-2 rounded text-left hover:bg-gray-200"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;