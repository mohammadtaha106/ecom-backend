import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Step 1: Token read from cookies
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });
    }

    try {
      // Step 2: Verify token
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      // Step 3: Find user
      const user = await User.findById(decoded.userId || decoded.id).select(
        "-password"
      );

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Step 4: Attach user to req
      req.user = user;

      // Step 5: Continue
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Access token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in protect middleware:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid access token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};
