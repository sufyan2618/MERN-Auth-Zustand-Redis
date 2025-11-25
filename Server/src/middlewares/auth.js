import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ENV } from "../util/dotenv.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Forbidden: You don't have enough privileges" });
        }
        next();
    };
};