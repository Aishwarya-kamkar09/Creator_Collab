import generateToken from "./generateToken.js";


const sendToken = (user, statusCode, message, res) => {
    const token = generateToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        data: {
            user,
            token,
        },
    });
};

export default sendToken;