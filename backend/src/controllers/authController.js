import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is required');

export const generateToken = (id, roles) => {
  return jwt.sign({ id, roles }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const allowedRoles = ["customer", "owner"];
    const requestedRole = role && allowedRoles.includes(role) ? role : "customer";
    const initialRoles = [requestedRole];

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      roles: initialRoles,
    });

    await newUser.save();

    const token = generateToken(newUser._id, newUser.roles);
    setTokenCookie(res, token);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        roles: newUser.roles,
      },
    });
  } catch (error) {
    logger.error("Error in registerUser:", error.message);
    res.status(500).json({ message: "Error during registration", error: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isOwnerOrCustomer = user.roles.some(r => ["owner", "customer", "admin"].includes(r));
    const isStaffOnly = user.roles.some(r => ["waiter", "kitchen", "manager"].includes(r)) && !isOwnerOrCustomer;

    if (isStaffOnly && user.authProvider !== "local") {
      return res.status(400).json({
        message: "This staff account is configured for Google login only. Please use the 'Continue with Google' button."
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "This account does not have a password set. Please use 'Continue with Google'."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (role) {
      if (role === 'owner') {
        const hasStaffRoles = user.roles.some(r => ['manager', 'waiter', 'kitchen', 'staff', 'admin'].includes(r));
        if (hasStaffRoles) {
          return res.status(403).json({
            message: "Staff members cannot login as owners with the same account. Please use a separate account."
          });
        }
        if (!user.roles.includes('owner')) {
          user.roles.push('owner');
          await user.save();
        }
      } else if (['waiter', 'kitchen', 'manager', 'staff'].includes(role)) {
        if (!user.roles.includes(role)) {
          return res.status(403).json({
            message: `Access denied. You are not authorized as a ${role}.`
          });
        }
      }
    }

    const token = generateToken(user._id, user.roles);
    setTokenCookie(res, token);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        workingAt: user.workingAt,
      },
    });
  } catch (error) {
    logger.error("Error in loginUser:", error.message);
    res.status(500).json({ message: "Error during login", error: error.message });
  }
};

// Logout user
export const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    logger.error("Error in logoutUser:", error.message);
    res.status(500).json({ message: "Error during logout", error: error.message });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({ message: "User data retrieved", user: req.user });
  } catch (error) {
    logger.error("Error in getCurrentUser:", error.message);
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
};

// Google Auth Callback handler
export const googleAuthCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=Google auth failed`);
    }

    const token = generateToken(req.user._id, req.user.roles);
    setTokenCookie(res, token);

    const isStaffRole = req.user.roles.some(role => ["owner", "manager", "waiter", "kitchen", "admin"].includes(role));
    let redirectPath = isStaffRole ? "/business" : "/";

    if (req.query.state) {
      try {
        const state = JSON.parse(Buffer.from(req.query.state, "base64").toString());
        if (state.from === "staff") {
          redirectPath = "/business";
        } else if (state.from === "customer") {
          redirectPath = "/";
        }
      } catch (e) {
        logger.error("Error parsing Google OAuth state:", e.message);
      }
    }

    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}${redirectPath}`);
  } catch (error) {
    logger.error("Error in googleAuthCallback:", error.message);
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=Internal server error`);
  }
};
