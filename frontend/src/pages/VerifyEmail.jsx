import { useEffect, useState, useContext } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { verifyEmail as apiVerifyEmail } from "../api/auth.api.js";
import { AuthContext } from "../context/AuthContext.jsx";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    const [status, setStatus] = useState("Verifying your email...");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setStatus("Invalid or expired verification link");
            setLoading(false);
            setSuccess(false);
            return;
        }

        let interval;

        const verify = async () => {
            try {
                setLoading(true);
                const res = await apiVerifyEmail(token);

                if (res.data.success) {
                    setStatus("Email verified successfully! Redirecting...");
                    setSuccess(true);

                    // Update AuthContext if user is logged in
                    if (user && user.email === res.data.user?.email) {
                        setUser({ ...user, isVerified: true });
                    }

                    // Redirect after a short delay
                    setTimeout(() => navigate("/login"), 2000);
                } else {
                    setStatus(res.data.message || "Verification failed");
                    setSuccess(false);
                }
            } catch (err) {
                setStatus(err.response?.data?.message || "Verification failed");
                setSuccess(false);
            } finally {
                setLoading(false);
            }
        };

        // Initial verify call
        verify();

        // Optional: Poll every 5 seconds for real-time update if user is logged in
        if (user) {
            interval = setInterval(verify, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [token, navigate, user, setUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow text-center space-y-4">
                <h2 className="text-2xl font-bold text-green-600">Email Verification</h2>

                <p
                    className={`${loading
                            ? "text-gray-500"
                            : success
                                ? "text-green-600"
                                : "text-red-500"
                        }`}
                >
                    {status}
                </p>

                {!loading && !success && (
                    <div className="flex justify-center gap-2 mt-4">
                        <Link
                            to="/register"
                            className="text-white bg-blue-600 py-2 px-4 rounded hover:bg-blue-700"
                        >
                            Register Again
                        </Link>
                        <Link
                            to="/login"
                            className="text-white bg-green-600 py-2 px-4 rounded hover:bg-green-700"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;