const pool = require("../db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//  LOGIN
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

    //  Get role
    const roleResult = await pool.query(
      `SELECT r.role_name 
       FROM userroles ur
       JOIN roles r ON ur.role_id = r.role_id
       WHERE ur.user_id = $1`,
      [user.user_id]
    );

    const role = roleResult.rows[0]?.role_name || "Adopter";

    //  Token
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


//  REGISTER (NEW)
const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // check existing user
    const existing = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const newUser = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING user_id`,
      [full_name || "New User", email, hashedPassword]
    );

    const userId = newUser.rows[0].user_id;

    // assign Adopter role (role_id = 3)
    await pool.query(
      "INSERT INTO userroles (user_id, role_id) VALUES ($1, $2)",
      [userId, 3]
    );

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Registration failed",
      error: err.message
    });
  }
};

module.exports = { login, register };