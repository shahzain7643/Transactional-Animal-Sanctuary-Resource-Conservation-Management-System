const pool = require("../db/database");

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.user_id;

      const result = await pool.query(
        `SELECT r.role_name
         FROM userroles ur
         JOIN roles r ON ur.role_id = r.role_id
         WHERE ur.user_id = $1`,
        [userId]
      );

      const userRole = result.rows[0]?.role_name;

      console.log("USER ROLE:", userRole);

      if (!roles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied"
        });
      }

      next();

    } catch (err) {
      res.status(500).json({
        message: "Role middleware error"
      });
    }
  };
};

module.exports = authorizeRoles;