import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is required');

export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.cookies.jwt) {
            token = req.cookies.jwt;
        } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            next();
        } catch (error) {
            console.error("JWT Verification failed:", error.message);
            if (req.cookies.jwt) {
                res.clearCookie("jwt", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
                });
            }
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error in auth middleware" });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles || !Array.isArray(req.user.roles)) {
            console.error("Access Denied: User has no roles or invalid role structure.", req.user?._id);
            return res.status(403).json({ message: "Access Denied: User roles not found." });
        }

        const hasRole = req.user.roles.some(role => roles.includes(role));

        if (!hasRole) {
            return res.status(403).json({ message: `Access Denied: Your role (${req.user.roles.join(', ')}) is not authorized.` });
        }
        next();
    };
};

export const optionalProtect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return next();
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            console.error("Optional Protect: Token failed verification", error.message);
            if (req.cookies.jwt) {
                res.clearCookie("jwt", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
                });
            }
            next();
        }
    } catch (error) {
        console.error(error);
        next();
    }
};
