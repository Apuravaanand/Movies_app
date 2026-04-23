import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../config/sendEmail.js";

export const signup = async (req, res) => {
    try {
        const { name, email, password, role, adminPassword } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (
            role === "admin" &&
            (!adminPassword || adminPassword !== process.env.ADMIN_SECRET)
        ) {
            return res.status(403).json({
                success: false,
                message: "Invalid admin password",
            });
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tokens
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpires = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            isVerified: false,
            verificationToken,
            verificationTokenExpires,
        });

        const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

        // Send email async (non-blocking)
        setImmediate(async () => {
            try {
                if (
                    process.env.SMTP_HOST &&
                    process.env.SMTP_USER &&
                    process.env.SMTP_PASS
                ) {
                    await sendEmail({
                        to: user.email,
                        subject: "Verify Your Email",
                        text: `Click this link: ${verifyLink}`,
                    });
                    console.log("Email sent");
                } else {
                    console.log("DEV MODE LINK:", verifyLink);
                }
            } catch (err) {
                console.error("Email error:", err);
            }
        });

        return res.status(201).json({
            success: true,
            message: "Signup successful. Please verify your email.",
        });

    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({
            success: false,
            message: "Signup failed",
        });
    }
};

// Verify email controller
export const verifyEmail = async (req, res) => {
    try {
        const token = req.query.token; //use query instead of body

        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        return res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (err) {
        console.error("Email verification error:", err);
        return res.status(500).json({ success: false, message: "Verification failed" });
    }
};
// --------------------
// Login
// --------------------
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

        if (!user.isVerified) {
            return res.status(401).json({ success: false, message: "Please verify your email first" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ success: false, message: "Login failed" });
    }
};

// --------------------
// Request Password Reset
// --------------------
export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // generate token using the new schema method
        const token = user.generateResetToken();
        await user.save();

        // Example: create reset link
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

        // Send email
        await sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            text: `Hello ${user.name},\n\nClick this link to reset your password:\n${resetUrl}\n\nThis link expires in 1 hour.`,
        });

        return res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (err) {
        console.error("Request Password Reset error:", err);
        return res.status(500).json({ success: false, message: "Request failed" });
    }
};

// --------------------
// Reset Password
// --------------------
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (err) {
        console.error("Reset Password error:", err);
        return res.status(500).json({ success: false, message: "Password reset failed" });
    }
};