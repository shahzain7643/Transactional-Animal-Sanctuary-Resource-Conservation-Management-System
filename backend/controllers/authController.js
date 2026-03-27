const pool = require("../db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const login = async (req, res) => {
  try {
    console.log("LOGIN API HIT");

    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    // 🔥 Get role
    const roleResult = await pool.query(
      `SELECT r.role_name 
       FROM userroles ur
       JOIN roles r ON ur.role_id = r.role_id
       WHERE ur.user_id = $1`,
      [user.user_id]
    );

    const role = roleResult.rows[0]?.role_name || "Adopter";

    // 🔐 Token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token, role });

  } catch (error) {
    console.error("🔥 ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { login };