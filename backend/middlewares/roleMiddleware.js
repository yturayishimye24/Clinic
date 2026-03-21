export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false
      });
    }

    if (req.user.role.toLowerCase().trim() !== role.toLowerCase()) {
      return res.status(403).json({
        message: `Access denied. Required role: ${role}`,
        success: false
      });
    }

    next();
  };
};