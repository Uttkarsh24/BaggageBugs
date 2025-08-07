import asyncHandler from "../utils/asyncHandler.js";
import { tokenValidation } from "../helper/jwt.helper.js";
import User from "../models/user.model.js"

const isAdmin = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access. No token provided.",
            });
        }
        const decoded = await tokenValidation(token);
        const user = await User.findById(
            decoded.id,
        );
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access. User not found.",
            });
        }
        if (!user.role.includes('admin')) {
            return res.status(403).json({
                success: false,
                message: "Forbidden Access. Admins are not allowed to perform this action.",
            });
        }
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized Access. Invalid token.",
        });
    }
});

export default isAdmin;