import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios.js";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState("Verifying...");

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await api.get(`/auth/verify-email?token=${token}`);
                if (res.data.success) {
                    setStatus("Email verified successfully! You can now login.");
                } else {
                    setStatus(res.data.message || "Verification failed");
                }
            } catch (err) {
                setStatus(err.response?.data?.message || "Verification failed");
            }
        };
        if (token) verify();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-xl w-96 shadow text-center space-y-4">
                <h2 className="text-2xl font-bold text-green-600">Email Verification</h2>
                <p>{status}</p>
                {status.includes("successfully") && (
                    <Link
                        to="/login"
                        className="text-white bg-green-600 py-2 px-4 rounded hover:bg-green-700"
                    >
                        Go to Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;