import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profilePic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    profilePicPublicId: { type: String, default: "" },
    token: { type: String, default: "" },
    isverified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: String, default: null },
    address: { type: String },
    zipCode: { type: String },
    city: { type: String },
    phoneNo: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
