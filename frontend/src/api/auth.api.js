import api from "./index.js";

// Login user
export const login = (payload) => api.post("/auth/login", payload);

// Signup user
export const signup = (payload) => api.post("/auth/signup", payload);

// Verify email
export const verifyEmail = (token) => api.get(`/auth/verify-email?token=${token}`);

// Request password reset
export const requestPasswordReset = (email) => {
    if (!email || typeof email !== "string") {
        throw new Error("Email must be a string");
    }
    return api.post("/auth/request-password-reset", { email: email.toLowerCase().trim() });
};

// Reset password
export const resetPassword = (token, newPassword) =>
    api.post("/auth/reset-password", { token, newPassword });