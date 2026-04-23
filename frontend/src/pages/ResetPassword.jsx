import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/auth.api.js"; // create this

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password) return alert("Password is required");
        if (!token) return alert("Invalid or missing token");

        setLoading(true);

        try {
            const res = await resetPassword(token, password);

            if (res.data.success) {
                alert(res.data.message || "Password reset successfully");
                navigate("/login");
            } else {
                alert(res.data.message || "Reset failed");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Reset failed");
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
                <h2 className="text-2xl font-bold text-green-600 text-center">
                    Reset Password
                </h2>

                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;