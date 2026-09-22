const jwt = require("jsonwebtoken");
const { hasPermission } = require("../service/permissionCache");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

const authorize = (resource, action) => {
  return async (req, res, next) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const permission = `${resource.toLowerCase()}:${action}`;

    const allowed = await hasPermission(userId, permission);

    if (!allowed) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
