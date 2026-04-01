import { useState, useContext } from "react";
import { login as apiLogin } from "../api/auth.api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            alert("Email and password are required");
            return;
        }

        setLoading(true);
        try {
            const res = await apiLogin(form);

            if (res.data.success && res.data.token) {
                // Save user & token in AuthContext
                login(res.data.user, res.data.token);

                // Navigate after login
                navigate(res.data.user.role === "admin" ? "/admin-dashboard" : "/dashboard");
            } else {
                alert(res.data.message || "Login failed");
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl w-96 shadow space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-green-600">Login</h2>

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    autoFocus
                    className="w-full border border-gray-300 p-2 rounded"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-green-600 font-medium hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;