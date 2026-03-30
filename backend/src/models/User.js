// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6, // already hashed in controller
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        },
        profilePic: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Compare password method (optional, if controller handles hashing)
userSchema.methods.comparePassword = async function (candidatePassword) {
    const bcrypt = await import("bcryptjs"); // dynamic import for ES modules
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
