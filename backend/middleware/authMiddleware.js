import jwt from "jsonwebtoken";

const JWT_SECRET = "multitenant_super_jwt_secret_key_2026";
export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!token || token === "null" || token === "undefined") {
        return res.status(401).json({
          success: false,
          message: "Not authorized, invalid token format",
        });
      }

      console.log("JWT SECRET:", JWT_SECRET);
      console.log(
        "TOKEN RECEIVED:",
        token ? token.substring(0, 20) : "NO TOKEN"
      );

      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = decoded;
      return next();
    } catch (error) {
      console.log("JWT VERIFY ERROR:", error.message);

      return res.status(401).json({
        success: false,
        message: "Not authorized, token invalid or expired",
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: "Not authorized, no authentication token provided",
  });
};
export const optionalAuth = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (token && token !== "null" && token !== "undefined") {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
      }
    } catch (error) {
      req.user = null;
    }
  }

  next();
};
export const isVendor = (req, res, next) => {
  if (req.user && req.user.role === "vendor") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Vendor account required.",
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Super Admin account required.",
  });
};