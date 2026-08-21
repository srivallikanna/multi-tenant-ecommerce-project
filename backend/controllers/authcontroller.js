// controllers/authController.js

import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

// In-Memory fallback store for guaranteed reliability if local MongoDB is not running
const inMemoryUsers = [
  {
    _id: "usr_v101",
    name: "Gaurav (Audio & Tech)",
    email: "vendor@gaurav.com",
    passwordHash: bcrypt.hashSync("vendor123", 10),
    role: "vendor",
    storeName: "Gaurav's Store",
    tenantSlug: "gaurav-store",
  },
  {
    _id: "usr_v102",
    name: "Srivalli (Luxury Watches)",
    email: "vendor@srivalli.com",
    passwordHash: bcrypt.hashSync("vendor123", 10),
    role: "vendor",
    storeName: "Srivalli's Store",
    tenantSlug: "srivalli-store",
  },
  {
    _id: "usr_v103",
    name: "Riya (Clean Beauty)",
    email: "vendor@riya.com",
    passwordHash: bcrypt.hashSync("vendor123", 10),
    role: "vendor",
    storeName: "Riya's Store",
    tenantSlug: "riya-store",
  },
  {
    _id: "usr_v104",
    name: "Anuj (Urban Streetwear)",
    email: "vendor@anuj.com",
    passwordHash: bcrypt.hashSync("vendor123", 10),
    role: "vendor",
    storeName: "Anuj's Store",
    tenantSlug: "anuj-store",
  },
  {
    _id: "usr_c101",
    name: "Anuj (Customer)",
    email: "anuj@customer.com",
    passwordHash: bcrypt.hashSync("password123", 10),
    role: "customer",
  },
  {
    _id: "usr_a101",
    name: "Gaurav (Platform Admin)",
    email: "admin@gaurav.com",
    passwordHash: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
];

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role || "customer",
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Signup User
export const signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, email, password)",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userRole = role || "customer";

    // 1. If MongoDB is actively connected, use Mongoose
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email address",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: userRole,
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: "Signup successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // 2. Fallback in-memory store if MongoDB is offline
    const existingMemoryUser = inMemoryUsers.find((u) => u.email === normalizedEmail);
    if (existingMemoryUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email address",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newMemoryUser = {
      _id: "usr_" + Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashedPassword,
      role: userRole,
    };

    inMemoryUsers.push(newMemoryUser);
    const token = generateToken(newMemoryUser);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: newMemoryUser._id,
        name: newMemoryUser.name,
        email: newMemoryUser.email,
        role: newMemoryUser.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create account",
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. If MongoDB is connected, query DB
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "No account found with this email",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid password",
        });
      }

      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // 2. Fallback in-memory verification if MongoDB is offline
    const memoryUser = inMemoryUsers.find((u) => u.email === normalizedEmail);
    if (!memoryUser) {
      // Auto-register demo account or check password
      return res.status(400).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const isMatch = await bcrypt.compare(password, memoryUser.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken(memoryUser);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: memoryUser._id,
        name: memoryUser.name,
        email: memoryUser.email,
        role: memoryUser.role,
        storeName: memoryUser.storeName,
        tenantSlug: memoryUser.tenantSlug,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to log in",
    });
  }
};