import { useState } from "react";
import { signup as apiSignup } from "../api/auth.api.js";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        adminPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle input change
    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setError(""); // clear error on typing
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        // Validation
        if (!form.name || !form.email || !form.password) {
            return setError("All fields are required");
        }

        // if (
        //     form.role === "admin" &&
        //     form.adminPassword !== import.meta.env.ADMIN_SECRET
        // ) {
        //     return setError("Invalid admin secret password");
        // }

        try {
            setLoading(true);

            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
                ...(form.role === "admin" && {
                    adminPassword: form.adminPassword,
                }),
            };

            console.log("Sending signup request...");

            const res = await apiSignup(payload);

            console.log("Response:", res);

            if (res?.data?.success) {
                alert("Registered successfully! Please verify your email.");

                navigate(
                    `/verify-email?email=${encodeURIComponent(form.email)}`
                );
            } else {
                setError(res?.data?.message || "Signup failed");
            }

        } catch (err) {
            console.error("Signup error:", err);

            setError(
                err?.response?.data?.message ||
                err.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl w-full max-w-md shadow space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-green-600">
                    Register
                </h2>

                {/* Error Message */}
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}

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
                    <Link to="/login" className="text-green-600 hover:underline">
                        Sign In
                    </Link>
                </p>

                <p className="text-sm text-center text-gray-600">
                    Forgot Password?{" "}
                    <Link
                        to="/forgot-password"
                        className="text-green-600 hover:underline"
                    >
                        Reset
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;