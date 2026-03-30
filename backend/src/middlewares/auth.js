// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        req.user = { id: user._id, role: user.role };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};