import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

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

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
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

// Optional auth - populates req.user if token is present, continues anyway if not
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
    } catch (err) {
      // ignore invalid token for optional auth
    }
  }
  next();
};

export const isVendor = (req, res, next) => {
  if (req.user && (req.user.role === "vendor" || req.user.role === "admin")) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Vendor account required.",
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super Admin account required.",
    });
  }
};
