export const requireRole = (roles) => {
  const allowedRoles = Array.isArray(roles)
    ? roles.map((role) => role.toLowerCase().trim())
    : [roles.toLowerCase().trim()];

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    if (!allowedRoles.includes(req.user.role.toLowerCase().trim())) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
        success: false,
      });
    }

    next();
  };
};