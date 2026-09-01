 import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // =========================
    // User Name
    // =========================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================
    // Email
    // =========================
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // =========================
    // Password
    // =========================
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // =========================
    // Password Reset
    // =========================
    resetPasswordToken: {
      type: String,
      default: undefined,
    },

    resetPasswordExpire: {
      type: Date,
      default: undefined,
    },

    // =========================
    // Role
    // =========================
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },

    // =========================
    // Phone
    // =========================
    phone: {
      type: String,
    },

    // =========================
    // Avatar
    // =========================
    avatar: {
      type: String,
      default: "",
    },

    // =========================
    // Store
    // =========================
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },

    // =========================
    // Verification
    // =========================
    isVerified: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;