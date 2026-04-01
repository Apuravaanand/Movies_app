import { useState, useContext } from "react";
import { signup as apiSignup } from "../api/auth.api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // optional if you want auto-login

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        adminPassword: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (!form.name || !form.email || !form.password) {
            alert("Name, email, and password are required");
            setLoading(false);
            return;
        }
        if (form.role === "admin" && !form.adminPassword) {
            alert("Admin secret password is required");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
            };
            if (form.role === "admin") payload.adminPassword = form.adminPassword;

            const res = await apiSignup(payload);

            if (res.data.success && res.data.token) {
                // Optional: auto-login after signup
                login(res.data.user, res.data.token);

                // Navigate based on role
                navigate(res.data.user.role === "admin" ? "/admin-dashboard" : "/dashboard");

                // If you prefer email verification flow, remove auto-login and navigate to login
                // alert("Registered successfully! Please verify your email.");
                // navigate("/login");
            } else {
                alert(res.data.message || "Signup failed");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Signup failed");
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
                <h2 className="text-2xl font-bold text-center text-green-600">
                    Register
                </h2>

                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    autoFocus
                    className="w-full border border-gray-300 p-2 rounded"
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
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

                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                {form.role === "admin" && (
                    <input
                        name="adminPassword"
                        type="password"
                        placeholder="Admin Secret Password"
                        value={form.adminPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                <p className="text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-green-600 font-medium hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;