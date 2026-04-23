// models/User.js
import mongoose from "mongoose";
import * as crypto from "crypto";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6 },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date },
        profilePic: { type: String, default: "" },
        favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],

        // Email verification
        isVerified: { type: Boolean, default: false },
        verificationToken: { type: String },
        verificationTokenExpires: { type: Date },

        // Password reset
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
    },
    { timestamps: true }
);

userSchema.methods.generateResetToken = function () {
    // Generate a random token
    const token = crypto.randomBytes(32).toString("hex");

    // Set token and expiration (1 hour)
    this.resetPasswordToken = token;
    this.resetPasswordExpires = Date.now() + 3600000;

    return token;
};


// Compare password method (optional, if controller handles hashing)
userSchema.methods.comparePassword = async function (candidatePassword) {
    const bcrypt = await import("bcryptjs"); // dynamic import for ES modules
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
