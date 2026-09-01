import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =========================
// Signup User
// =========================
export const signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, email, password)",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
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
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create account",
    });
  }
};

// =========================
// Login User
// =========================
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

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

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
    res.status(500).json({
      success: false,
      message: error.message || "Failed to log in",
    });
  }
};