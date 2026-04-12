const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load('./docs/swagger.yaml');

const authRoutes = require("./routes/authRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const medicalRoutes = require("./routes/medicalRoutes");
const animalsRoutes = require("./routes/animalsRoutes");

const express = require("express");
const cors = require("cors");
const pool = require("./db/database");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("👉 REQUEST:", req.method, req.url);
  next();
});
// ✅ ROOT TEST
app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json({
    message: "Animal Sanctuary API running",
    time: result.rows[0]
  });
});

// 🔥 FIXED ROUTES (NO OVERLAP)
app.use("/api/v1/animals", animalsRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/adoptions", adoptionRoutes);
app.use("/api/v1/medical", medicalRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;