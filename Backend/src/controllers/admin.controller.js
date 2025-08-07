import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Facility from "../models/facility.model.js";

const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find().limit(10);
        res.status(200).json(new ApiResponse(users));
    } catch (error) {
        next(new ApiError("Failed to fetch users", 500));
    }
});

const getFacilities = asyncHandler(async (req, res) => {
    try {
        const facilities = await Facility.find().limit(10);
        res.status(200).json(new ApiResponse(facilities));
    } catch (error) {
        next(new ApiError("Failed to fetch facilities", 500));
    }
});

const getUsersByName = asyncHandler(async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return next(new ApiError("Name query parameter is required", 400));
    }
    try {
        const users = await User.find({ name });
        res.status(200).json(new ApiResponse(users));
    } catch (error) {
        next(new ApiError("Failed to fetch users by name", 500));
    }
});

const getFacilitiesByName = asyncHandler(async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return next(new ApiError("Name query parameter is required", 400));
    }
    try {
        const facilities = await Facility.find({ name });
        res.status(200).json(new ApiResponse(facilities));
    } catch (error) {
        next(new ApiError("Failed to fetch facilities by name", 500));
    }
});

export {
    getUsers,
    getFacilities,
    getUsersByName,
    getFacilitiesByName
};