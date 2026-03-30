import { useState } from "react";
import { signup } from "../api/auth.api.js"; // Correct API import
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

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
            };
            if (form.role === "admin") payload.adminPassword = form.adminPassword;

            const res = await signup(payload);

            if (res.data.success) {
                alert("Registered successfully!");
                navigate("/login");
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