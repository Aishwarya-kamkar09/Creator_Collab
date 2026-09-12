import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import sendToken from "../utils/sendToken.js";


//register
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    //frontend validation
    if (!name || !email || !password || !role) {
        throw new ApiError(400, "Please fill all required fields");
    }
    
    //role backedn validation
    if (!["creator", "brand"].includes(role)) {
        throw new ApiError(400, "Invalid user role");
    }

    const existingUser = await User.findOne({ email });

    //check if user already exists
    if (existingUser) {
        throw new ApiError(409, "Email already registered");
    }

    //create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    //generate token and set cookie
    const token = generateToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    //send response
    return sendToken(user, 201, "Account created successfully", res);
});


// login
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    user.comparePassword(password)
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken(user._id);
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);
    user.password = undefined;

    return sendToken(user, 200, "Login successful", res);
});


//logout
export const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Logged out successfully"
        )
    );
});

//current user
export const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"
        )
    );

});