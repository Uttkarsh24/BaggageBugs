import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import { generateToken } from "../helper/jwt.helper.js";
import { hashPassword, matchPassword } from "../helper/bcrypt.helper.js";
import { ROLES } from "../constants.js";
import {
    sendRegisterationEmail,
    sendLoginEmail,
} from "../utils/nodemailer/userEmail.js";

const partnerRegister = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        throw new ApiError(400, "Please fill all fields.");
    }
    let name = `${firstName} ${lastName}`;
    const existingUser = await User.findOne({
        $or: [{ email }],
    })
    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }
    try {
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            name,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: ROLES[2],
        });
        await sendRegisterationEmail(user.email);
        return res
            .status(201)
            .json(new ApiResponse(201, user, "Partner created successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error");
    }
});

const partnerLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Please fill all fields");
    }
    const user = await User.findOne({
        $or: [{ email }]
    });
    user.role = ROLES[2];
    await user.save();
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.googleAuth && !user.changedGooglePassword) {
        throw new ApiError(403, "Please login with Google");
    }
    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }
    const token = await generateToken(user);
    if (!token) {
        throw new ApiError(500, "token generation failed");
    }
    let tokenRole = "";
    for (const role in user.role) {
        tokenRole = tokenRole + user.role[role] + " ";
    }
    try {
        await sendLoginEmail(user.email);
        return res.status(200).json({
            token,
            role: tokenRole.trim(),
        });
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error.");
    }
});

const partnerGoogleCallback = asyncHandler(async (req, res) => {
    const token = req.token;
    const tokenRole = req.tokenRole;
    const role = tokenRole.trim();
    const redirectUrl = `${process.env.CLIENT_URL}/landingpage?token=${token}&role=${role}`;
    return res
        .redirect(redirectUrl);
});

export {
    partnerRegister,
    partnerLogin,
    partnerGoogleCallback
};