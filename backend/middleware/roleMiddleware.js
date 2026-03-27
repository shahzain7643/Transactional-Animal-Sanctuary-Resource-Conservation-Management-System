const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // DEBUG (optional)
      console.log("User role:", req.user);

      // IMPORTANT: use correct field
      const userRole = req.user.role || req.user.role_name;

      if (!userRole) {
        return res.status(403).json({ message: "No role found" });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next();
    } catch (err) {
      return res.status(500).json({ message: "Role check failed" });
    }
  };
};

module.exports = authorizeRoles;