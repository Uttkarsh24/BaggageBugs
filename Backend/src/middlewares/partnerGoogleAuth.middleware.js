import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { generateToken } from "../helper/jwt.helper.js";
import { ROLES } from "../constants.js";

const partnerGoogleAuth = asyncHandler(async (req, res, next) => {
    try {
        const findUser = await User.findOne({ email: req.user?._json?.email });
        let savedUser;
        if (!findUser) {
            const newUser = await User.create({
                name: req.user?._json?.name,
                email: req.user?._json?.email,
                password: "xxxxxxxxxxx",
                googleAuth: true,
                role: ROLES[2],
            });
            savedUser = await newUser.save();
        }
        const token = await generateToken(findUser ? findUser : savedUser);
        let tokenRole = "";
        for (const role in findUser ? findUser.role : savedUser.role) {
            tokenRole = tokenRole + (findUser ? findUser.role : savedUser.role)[role] + " ";
        }
        req.token = token;
        req.tokenRole = tokenRole;
        next();
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error");
    }
});

export default partnerGoogleAuth;