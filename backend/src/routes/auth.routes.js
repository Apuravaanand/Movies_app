import express from "express";
import {
    signup,
    login,
    verifyEmail,
    requestPasswordReset,
    resetPassword
} from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";

const authRoutes = express.Router();

// Signup with email verification
authRoutes.post("/signup", signup);

// Login (JWT issued)
authRoutes.post("/login", login);

// Verify email link
authRoutes.get("/verify-email", verifyEmail);

// Request password reset (sends email link)
authRoutes.post("/request-password-reset", requestPasswordReset);

// Reset password (from link)
authRoutes.post("/reset-password", resetPassword);

// Example protected route (only for verified + JWT authenticated users)
authRoutes.get("/protected", auth, (req, res) => {
    res.json({ success: true, message: `Hello ${req.user.id}, you are authorized!` });
});

export default authRoutes;
