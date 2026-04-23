import { useState } from "react";
import { requestPasswordReset } from "../api/auth.api.js"; // Make sure this API exists

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // For success/error messages

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) return alert("Email is required");

        setLoading(true);
        try {
            const res = await requestPasswordReset(email); // pass the string directly

            if (res.data.success) {
                alert(res.data.message || "Check your email for the reset link");
            } else {
                alert(res.data.message || "Request failed");
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Request failed");
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
                <h2 className="text-2xl font-bold text-green-600 text-center">
                    Forgot Password
                </h2>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                    autoFocus
                />

                {status && (
                    <p
                        className={`text-sm font-medium ${status.type === "success" ? "text-green-600" : "text-red-500"
                            }`}
                    >
                        {status.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;